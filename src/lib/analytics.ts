/**
 * Contador propio de visitas y clics.
 * - Sin cookies ni almacenamiento en el dispositivo del visitante (todo en memoria).
 * - No se guarda IP, ni navegador completo, ni ningún identificador de persona.
 * - Solo se envía: tipo de evento, ruta (sin parámetros), web de origen, utm de campaña,
 *   si viene de un anuncio de Google y la clase de dispositivo.
 * - Además, si el visitante ha aceptado las cookies, se avisa a Google Ads de las conversiones
 *   (llamada, WhatsApp, formulario): ver `google-ads.ts`.
 */
import { supabase } from "@/integrations/supabase/client";
import { trackAdsConversion } from "@/lib/google-ads";

export type SiteEvent = "view" | "call" | "whatsapp" | "form";

type Attribution = {
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  fromAds: boolean;
};

/** Origen de la visita: se captura al entrar y se conserva solo en memoria durante la navegación. */
let attribution: Attribution | null = null;

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp\/|curl|wget/i;

function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.webdriver === true || BOT.test(navigator.userAgent);
}

function deviceClass(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

function captureAttribution(): Attribution {
  if (attribution) return attribution;
  const q = new URLSearchParams(window.location.search);
  let referrerHost: string | null = null;
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      // Solo orígenes externos; la navegación interna no cuenta como "referencia".
      if (host && host !== window.location.hostname.replace(/^www\./, "")) referrerHost = host;
    }
  } catch {
    referrerHost = null;
  }
  attribution = {
    referrerHost,
    utmSource: q.get("utm_source"),
    utmMedium: q.get("utm_medium"),
    utmCampaign: q.get("utm_campaign"),
    // gclid (clic en anuncio de Google) o gad_source/gbraid/wbraid; solo se guarda que vino de un anuncio.
    fromAds: ["gclid", "gbraid", "wbraid", "gad_source"].some((k) => q.has(k)),
  };
  return attribution;
}

export function trackEvent(event: SiteEvent, path?: string): void {
  if (typeof window === "undefined" || isBot()) return;
  const p = path ?? window.location.pathname;
  if (p.startsWith("/admin")) return;
  const a = captureAttribution();
  // Conversión de Google Ads: solo con consentimiento de cookies (lo comprueba la propia función)
  trackAdsConversion(event);
  try {
    void supabase
      .rpc("track_site_event", {
        p_event: event,
        p_path: p,
        ...(a.referrerHost ? { p_referrer_host: a.referrerHost } : {}),
        ...(a.utmSource ? { p_utm_source: a.utmSource } : {}),
        ...(a.utmMedium ? { p_utm_medium: a.utmMedium } : {}),
        ...(a.utmCampaign ? { p_utm_campaign: a.utmCampaign } : {}),
        p_from_ads: a.fromAds,
        p_device: deviceClass(),
      })
      .then(
        () => undefined,
        () => undefined,
      );
  } catch {
    /* la medición nunca debe romper la web */
  }
}

/** Detecta pulsaciones en enlaces de llamada y de WhatsApp (delegación de eventos). */
export function classifyLink(anchor: HTMLAnchorElement): SiteEvent | null {
  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "call";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  return null;
}
