import { Link } from "@tanstack/react-router";
import { HeroVideo } from "./HeroVideo";
import { HeroEnergyLines } from "./HeroEnergyLines";
import { HERO_VIDEOS } from "@/lib/media";
import type { CompanyInfo } from "@/lib/home-data";

export function Hero({ company }: { company: CompanyInfo }) {
  return (
    <section
      id="inicio"
      className="theme-space relative isolate flex min-h-[100svh] items-center overflow-hidden bg-canvas pt-16"
    >
      <HeroVideo videos={HERO_VIDEOS} />
      <HeroEnergyLines />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-24 pb-36 sm:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-canvas/50 px-3 py-1 font-mono text-xs text-text backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_8px_var(--provolt-accent)]" />
            Urgencias 24 h · todos los días del año
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold text-text [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] sm:text-6xl lg:text-7xl">
            Electricistas en <span className="text-electric text-glow">Valencia</span> y alrededores
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text/85 sm:text-xl">
            <strong className="font-semibold text-text">{company.slogan}.</strong> Instalador
            autorizado: averías, cuadros, reformas, boletines y fotovoltaica, con presupuesto sin
            compromiso.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link to="/contacto" className="btn-primary px-7 py-3.5 text-base">
              Pedir presupuesto
            </Link>
            <Link to="/servicios" className="btn-secondary px-7 py-3.5 text-base backdrop-blur">
              Ver servicios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
