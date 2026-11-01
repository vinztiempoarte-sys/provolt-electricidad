/**
 * Lectura del blog desde WordPress (API REST pública). Solo se ejecuta en el servidor:
 * descarga los artículos, limpia el HTML (sanitize-html) y los guarda en memoria unos minutos.
 * Si WordPress no responde se sirve la última copia buena, para que /blog nunca se caiga.
 */
import sanitizeHtml from "sanitize-html";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML ya limpio, listo para pintar. */
  content: string;
  cover_url: string | null;
  category: string;
  author: string;
  published_at: string | null;
  updated_at: string;
};

/** Raíz del WordPress que publica los artículos (sin barra final). Se puede cambiar con WORDPRESS_URL. */
const DEFAULT_WP_URL = "https://apps4pymes.com/162146000078789051nueva-web-scoreapps-20261101213949";
const TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const AUTHOR = "Provolt Electricidad";

type WpTerm = { name?: string; taxonomy?: string };
type WpPost = {
  id: number;
  slug: string;
  date_gmt?: string;
  modified_gmt?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
    "wp:term"?: WpTerm[][];
  };
};

function baseUrl(): string {
  return (process.env["WORDPRESS_URL"] || DEFAULT_WP_URL).replace(/\/+$/, "");
}

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1]?.toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

function plainText(html: string): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(text).replace(/\s+/g, " ").trim();
}

function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "u", "blockquote",
      "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "hr", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "srcset", "sizes", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "http"] },
    // El título ya se pinta en la cabecera: un h1 dentro del texto lo duplicaría
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs["href"] ?? "");
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : { ...attribs },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

function toPost(p: WpPost): BlogPost {
  const terms = (p._embedded?.["wp:term"] ?? []).flat();
  const category = terms.find((t) => t.taxonomy === "category" && t.name)?.name;
  const content = cleanContent(p.content?.rendered ?? "");
  const excerpt = plainText(p.excerpt?.rendered ?? "") || plainText(content).slice(0, 160);
  return {
    id: `wp-${p.id}`,
    slug: p.slug,
    title: plainText(p.title?.rendered ?? "") || "Sin título",
    excerpt,
    content,
    cover_url: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
    category: category && category !== "Uncategorized" ? decodeEntities(category) : "Consejos",
    author: AUTHOR,
    published_at: p.date_gmt ? `${p.date_gmt}Z` : null,
    updated_at: p.modified_gmt ? `${p.modified_gmt}Z` : (p.date_gmt ? `${p.date_gmt}Z` : new Date().toISOString()),
  };
}

let cache: { at: number; posts: BlogPost[] } | null = null;
let inFlight: Promise<BlogPost[]> | null = null;

async function download(): Promise<BlogPost[]> {
  const url = `${baseUrl()}/wp-json/wp/v2/posts?per_page=50&_embed=1&orderby=date&order=desc`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`WordPress respondió ${res.status}`);
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("Respuesta de WordPress inesperada");
  // Solo artículos con fecha ya cumplida (WordPress solo publica los programados a su hora)
  return (data as WpPost[])
    .filter((p) => p && typeof p.slug === "string" && p.slug)
    .map(toPost)
    .filter((p) => !p.published_at || new Date(p.published_at).getTime() <= Date.now());
}

/** Artículos publicados, del más reciente al más antiguo (con caché y copia de seguridad). */
export async function listPosts(): Promise<BlogPost[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.posts;
  inFlight ??= download()
    .then((posts) => {
      cache = { at: Date.now(), posts };
      return posts;
    })
    .catch((error) => {
      console.error("Blog: no se pudo leer WordPress:", error);
      // Se reintenta en 1 minuto; mientras tanto se sirve la última copia buena (o nada)
      const posts = cache?.posts ?? [];
      cache = { at: Date.now() - TTL_MS + 60_000, posts };
      return posts;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
