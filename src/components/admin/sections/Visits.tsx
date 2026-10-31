import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/admin/api";
import {
  KEY_PAGES,
  bySource,
  contactRate,
  contacts,
  totalsByPage,
  viewsByDay,
  type DayRow,
  type PageTotals,
  type SourceRow,
} from "@/lib/visits";
import { AdminPage } from "../AdminPage";
import { EmptyState } from "@/components/site/EmptyState";

const PERIODS = [
  { days: 7, label: "7 días" },
  { days: 30, label: "30 días" },
  { days: 90, label: "90 días" },
] as const;

async function fetchVisits(days: number) {
  const [day, source] = await Promise.all([
    supabase.rpc("analytics_by_day", { p_days: days }),
    supabase.rpc("analytics_by_source", { p_days: days }),
  ]);
  if (day.error) throw new Error(friendlyError(day.error));
  if (source.error) throw new Error(friendlyError(source.error));
  return { day: (day.data ?? []) as DayRow[], source: (source.data ?? []) as SourceRow[] };
}

const nf = new Intl.NumberFormat("es-ES");
const fmt = (n: number) => nf.format(n);

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      scope="col"
      className={`px-3 py-2 font-mono text-xs font-medium text-text-muted uppercase ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function Num({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <td
      className={`px-3 py-3 text-right font-mono ${strong ? "font-semibold text-text" : "text-text-muted"}`}
    >
      {children}
    </td>
  );
}

function PageRow({ label, t }: { label: string; t: PageTotals }) {
  const rate = contactRate(t);
  return (
    <tr className="border-t border-line">
      <td className="px-3 py-3 text-text">{label}</td>
      <Num strong>{fmt(t.views)}</Num>
      <Num>{fmt(t.calls)}</Num>
      <Num>{fmt(t.whatsapp)}</Num>
      <Num>{fmt(t.forms)}</Num>
      <Num strong>{fmt(contacts(t))}</Num>
      <Num>{rate === null ? "—" : `${rate.toLocaleString("es-ES")} %`}</Num>
    </tr>
  );
}

export function VisitsDashboard() {
  const [days, setDays] = useState<number>(30);
  const query = useQuery({ queryKey: ["admin", "visits", days], queryFn: () => fetchVisits(days) });
  const loading = query.isLoading;
  const data = query.data;

  const totals = data ? totalsByPage(data.day) : null;
  const daily = data ? viewsByDay(data.day) : [];
  const sources = data ? bySource(data.source) : [];
  const hasData = !!data && data.day.length > 0;

  return (
    <AdminPage
      kicker="// visitas"
      title="Visitas"
      description="Contador propio: sin cookies y sin datos personales. Cuenta todas las visitas, hayan aceptado o no las cookies."
      action={
        <div className="flex gap-2" role="group" aria-label="Periodo">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => setDays(p.days)}
              aria-pressed={days === p.days}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                days === p.days
                  ? "border-logo-accent bg-logo-accent/15 text-text"
                  : "border-line text-text-muted hover:text-text"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      {query.error ? (
        <p role="alert" className="card-tech p-6 text-sm text-danger">
          {query.error.message}
        </p>
      ) : null}

      {loading ? (
        <div className="card-tech h-48 animate-pulse" aria-busy="true" />
      ) : !hasData ? (
        <div className="card-tech">
          <EmptyState
            icon={Eye}
            message="Todavía no hay visitas registradas en este periodo. Aparecerán en cuanto alguien entre en la web."
          />
        </div>
      ) : (
        <div className="space-y-8">
          <section className="card-tech overflow-x-auto p-4 sm:p-6" aria-label="Por página">
            <h2 className="font-semibold text-text">Por página</h2>
            <table className="mt-4 w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <Th>Página</Th>
                  <Th right>Visitas</Th>
                  <Th right>Llamadas</Th>
                  <Th right>WhatsApp</Th>
                  <Th right>Formularios</Th>
                  <Th right>Contactos</Th>
                  <Th right>% contacto</Th>
                </tr>
              </thead>
              <tbody>
                {totals?.pages.map((p) => <PageRow key={p.path} label={p.label} t={p.totals} />)}
                {totals && totals.other.views + contacts(totals.other) > 0 ? (
                  <PageRow label="Resto de páginas" t={totals.other} />
                ) : null}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-text-muted">
              «Llamadas» y «WhatsApp» cuentan las pulsaciones en los botones, no las llamadas
              realmente conectadas. «% contacto» = contactos por cada 100 visitas.
            </p>
          </section>

          <section className="card-tech overflow-x-auto p-4 sm:p-6" aria-label="Visitas por día">
            <h2 className="font-semibold text-text">Visitas por día</h2>
            <table className="mt-4 w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <Th>Día</Th>
                  {KEY_PAGES.map((p) => (
                    <Th key={p.path} right>
                      {p.label}
                    </Th>
                  ))}
                  <Th right>Total</Th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.day} className="border-t border-line">
                    <td className="px-3 py-2.5 font-mono text-text">
                      {new Date(`${d.day}T12:00:00`).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    {d.perPage.map((n, i) => (
                      <Num key={KEY_PAGES[i]?.path}>{fmt(n)}</Num>
                    ))}
                    <Num strong>{fmt(d.total)}</Num>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-text-muted">
              El total incluye todas las páginas. Días en hora de Madrid.
            </p>
          </section>

          <section className="card-tech overflow-x-auto p-4 sm:p-6" aria-label="Origen">
            <h2 className="font-semibold text-text">De dónde vienen</h2>
            <table className="mt-4 w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <Th>Origen</Th>
                  <Th right>Visitas</Th>
                  <Th right>Contactos</Th>
                  <Th right>% contacto</Th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => {
                  const rate = contactRate(s.totals);
                  return (
                    <tr key={`${s.source}|${s.fromAds}`} className="border-t border-line">
                      <td className="px-3 py-3 text-text">
                        {s.source}
                        {s.fromAds ? (
                          <span className="ml-2 rounded-full bg-amber/15 px-2 py-0.5 font-mono text-xs text-amber">
                            anuncio
                          </span>
                        ) : null}
                      </td>
                      <Num strong>{fmt(s.totals.views)}</Num>
                      <Num>{fmt(contacts(s.totals))}</Num>
                      <Num>{rate === null ? "—" : `${rate.toLocaleString("es-ES")} %`}</Num>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-text-muted">
              «Directo» es quien escribe la dirección o llega sin web de origen. Una visita se marca
              como «anuncio» si la URL trae la marca de Google Ads. Para ver cada campaña por su
              nombre, el anuncio debe llevar el parámetro <span className="font-mono">utm_campaign</span>.
            </p>
          </section>
        </div>
      )}
    </AdminPage>
  );
}
