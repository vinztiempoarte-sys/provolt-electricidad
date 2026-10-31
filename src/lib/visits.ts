/** Agregaciones del panel de visitas (funciones puras sobre las filas que devuelve la base de datos). */

export type DayRow = { day: string; path: string; event: string; n: number };
export type SourceRow = { source: string; from_ads: boolean; path: string; event: string; n: number };

export const KEY_PAGES = [
  { path: "/", label: "Inicio" },
  { path: "/averias-urgentes", label: "Averías urgentes 24 h" },
  { path: "/boletines-y-proyectos-electricos", label: "Boletines y proyectos" },
] as const;

export type PageTotals = {
  views: number;
  calls: number;
  whatsapp: number;
  forms: number;
};

const empty = (): PageTotals => ({ views: 0, calls: 0, whatsapp: 0, forms: 0 });

function add(t: PageTotals, event: string, n: number) {
  if (event === "view") t.views += n;
  else if (event === "call") t.calls += n;
  else if (event === "whatsapp") t.whatsapp += n;
  else if (event === "form") t.forms += n;
}

export function contacts(t: PageTotals): number {
  return t.calls + t.whatsapp + t.forms;
}

/** Contactos por cada 100 visitas, o null si no hay visitas. */
export function contactRate(t: PageTotals): number | null {
  return t.views > 0 ? Math.round((contacts(t) / t.views) * 1000) / 10 : null;
}

/** Totales por cada página clave y una fila "Resto de páginas". */
export function totalsByPage(rows: DayRow[]) {
  const key = new Map<string, PageTotals>(KEY_PAGES.map((p) => [p.path, empty()]));
  const other = empty();
  for (const r of rows) {
    add(key.get(r.path) ?? other, r.event, r.n);
  }
  return {
    pages: KEY_PAGES.map((p) => ({ ...p, totals: key.get(p.path) ?? empty() })),
    other,
  };
}

/** Visitas por día de las páginas clave (más recientes primero). */
export function viewsByDay(rows: DayRow[]) {
  const days = new Map<string, Record<string, number>>();
  for (const r of rows) {
    if (r.event !== "view") continue;
    const row = days.get(r.day) ?? {};
    row[r.path] = (row[r.path] ?? 0) + r.n;
    days.set(r.day, row);
  }
  return [...days.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, byPath]) => ({
      day,
      perPage: KEY_PAGES.map((p) => byPath[p.path] ?? 0),
      total: Object.values(byPath).reduce((a, b) => a + b, 0),
    }));
}

/** Origen de las visitas: visitas y contactos por fuente. */
export function bySource(rows: SourceRow[]) {
  const map = new Map<string, { source: string; fromAds: boolean; totals: PageTotals }>();
  for (const r of rows) {
    const k = `${r.source}|${r.from_ads}`;
    const cur = map.get(k) ?? { source: r.source, fromAds: r.from_ads, totals: empty() };
    add(cur.totals, r.event, r.n);
    map.set(k, cur);
  }
  return [...map.values()].sort((a, b) => b.totals.views - a.totals.views);
}
