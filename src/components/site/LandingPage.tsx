import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, MessageCircle, Phone } from "lucide-react";
import type { CompanyInfo } from "@/lib/site-data";
import { MUNICIPIOS, type LandingContent } from "@/lib/landing-pages";
import { whatsappNumber } from "@/lib/contact-widgets";
import { PageShell } from "./PageShell";
import { PageHero } from "./PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { CtaBand } from "./CtaBand";
import { AVERIAS_VIDEOS, BOLETINES_VIDEOS } from "@/lib/media";

function telHref(phone: string | null): string | undefined {
  return phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;
}

function CallButtons({ company, page, className }: { company: CompanyInfo; page: LandingContent; className?: string }) {
  const tel = telHref(company.phone);
  const wa = whatsappNumber(company.whatsapp ?? company.phone);
  return (
    <div className={className ?? "flex flex-col gap-3 sm:flex-row sm:gap-4"}>
      {tel ? (
        <a href={tel} className="btn-accent px-7 py-3.5 text-base">
          <Phone className="h-5 w-5" aria-hidden="true" />
          Llamar al {company.phone?.replace(/^\+34\s*/, "")}
        </a>
      ) : null}
      {wa ? (
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent(page.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-7 py-3.5 text-base backdrop-blur"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp
        </a>
      ) : null}
      <Link to="/contacto" className="btn-secondary px-7 py-3.5 text-base backdrop-blur">
        Pedir presupuesto
      </Link>
    </div>
  );
}

export function LandingPage({ company, page }: { company: CompanyInfo; page: LandingContent }) {
  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: page.crumb }]} />
        }
        kicker={page.kicker}
        title={page.title}
        subtitle={page.subtitle}
        videos={page.path === "/averias-urgentes" ? AVERIAS_VIDEOS : BOLETINES_VIDEOS}
      >
        <CallButtons company={company} page={page} className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" />
      </PageHero>

      {page.blocks.map((block, bi) => (
        <section
          key={block.id}
          id={block.id}
          className={`theme-light border-t border-line py-16 sm:py-24 ${bi % 2 === 0 ? "bg-canvas" : "bg-surface"}`}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading kicker={block.kicker} title={block.title}>
                {block.intro}
              </SectionHeading>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {block.items.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="card-tech h-full bg-canvas p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-text">{item.title}</h3>
                    {item.text ? (
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.text}</p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// proceso" title={page.stepsTitle} />
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="card-tech h-full list-none p-6">
                  <span className="font-mono text-3xl text-electric">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-lg font-semibold text-text">{step.title}</h3>
                  {step.text ? (
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.text}</p>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// zona" title="Valencia y alrededores">
              Trabajamos en Valencia capital y en los municipios de alrededor.
            </SectionHeading>
          </Reveal>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {MUNICIPIOS.map((m) => (
              <li key={m} className="rounded-full border border-line bg-canvas px-4 py-2 text-sm text-text">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-muted">
            Instalador autorizado.{" "}
            <Link to="/requisitos-legales" className="font-medium text-electric hover:underline">
              Consulta nuestros requisitos legales
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// preguntas frecuentes" title="Preguntas frecuentes" />
          </Reveal>
          <div className="mt-10 divide-y divide-line rounded-md border border-line">
            {page.faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text">
                  {f.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-electric transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 leading-relaxed text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={page.ctaTitle}>
        <CallButtons company={company} page={page} className="flex flex-col items-center gap-3 sm:flex-row" />
      </CtaBand>
    </PageShell>
  );
}
