import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { fetchCompany, type CompanyInfo } from "@/lib/site-data";
import { PageSkeleton } from "@/components/site/Skeletons";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { Logo } from "@/components/site/Logo";
import { AVERIAS_VIDEOS } from "@/lib/media";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/business";
import { MUNICIPIOS } from "@/lib/landing-pages";
import { whatsappNumber } from "@/lib/contact-widgets";
import { AVERIAS_EN, type LandingContentEn } from "@/lib/landing-pages-en";
import { absoluteUrl, breadcrumbLd, faqLd, ldScript, pageMeta, serviceLd } from "@/lib/seo";

export const Route = createFileRoute("/en/emergency-electrician-valencia")({
  loader: () => fetchCompany(),
  head: () => {
    const page = AVERIAS_EN;
    const og = pageMeta({ title: page.metaTitle, description: page.metaDescription, path: page.path });
    const crumbs = [{ label: "Home", to: "/" }, { label: page.crumb }];
    return {
      meta: [
        { title: page.metaTitle },
        { name: "description", content: page.metaDescription },
        ...og.meta,
        { property: "og:locale", content: "en_GB" },
      ],
      links: [
        ...og.links,
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(page.path) },
        { rel: "alternate", hrefLang: "es", href: absoluteUrl("/averias-urgentes") },
      ],
      scripts: [
        ldScript({
          ...serviceLd(
            { title: page.serviceName, short_description: page.metaDescription },
            page.path,
          ),
          inLanguage: "en",
        }),
        ldScript(faqLd(page.faq)),
        ldScript(breadcrumbLd(crumbs)),
      ],
    };
  },
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  component: Page,
});

/** Cabecera mínima en inglés: logo, enlace a la versión en español y botón de llamada. */
function HeaderEn() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="shrink-0" aria-label="Provolt Electricidad (Spanish home page)">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/averias-urgentes"
            hrefLang="es"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Español
          </Link>
          <a
            href={PHONE_TEL}
            className="btn-urgent gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            Call now
          </a>
        </div>
      </div>
    </header>
  );
}

function FooterEn({ company }: { company: CompanyInfo }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Logo className="text-2xl" />
        <ul className="mt-6 space-y-3 text-sm text-text-muted">
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
            <a href={PHONE_TEL} className="transition-colors hover:text-text">
              {PHONE_DISPLAY}
            </a>
          </li>
          {company.email ? (
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-text">
                {company.email}
              </a>
            </li>
          ) : null}
        </ul>
        <p className="mt-6 text-sm text-text-muted">
          Authorised electrical installer.{" "}
          <Link to="/requisitos-legales" className="font-medium text-electric hover:underline">
            Legal requirements (in Spanish)
          </Link>
          .
        </p>
        <p className="mt-8 text-xs text-text-muted">
          © {year} Provolt Electricidad ·{" "}
          <Link to="/politica-privacidad" className="hover:text-text">
            Privacy policy (in Spanish)
          </Link>
        </p>
      </div>
    </footer>
  );
}

function ContactButtons({
  company,
  page,
  className,
}: {
  company: CompanyInfo;
  page: LandingContentEn;
  className?: string;
}) {
  const wa = whatsappNumber(company.whatsapp ?? company.phone);
  return (
    <div className={className ?? "flex flex-col gap-3 sm:flex-row sm:gap-4"}>
      <a href={PHONE_TEL} className="btn-urgent px-7 py-3 text-base sm:py-3.5">
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call now
      </a>
      {wa ? (
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent(page.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp px-7 py-3 text-base sm:py-3.5"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp (English)
        </a>
      ) : null}
    </div>
  );
}

/** Página de captación en inglés (misma estructura que LandingPage, con cabecera y pie propios). */
function LandingPageEn({ company, page }: { company: CompanyInfo; page: LandingContentEn }) {
  return (
    <div lang="en" className="min-h-screen bg-canvas text-text">
      <HeaderEn />
      <main>
        <PageHero
          breadcrumb={<Breadcrumbs items={[{ label: "Home", to: "/" }, { label: page.crumb }]} />}
          kicker={page.kicker}
          title={page.title}
          subtitle={page.subtitle}
          compact
          videos={AVERIAS_VIDEOS}
        >
          <ContactButtons
            company={company}
            page={page}
            className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          />
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
              <SectionHeading kicker="// process" title={page.stepsTitle} />
            </Reveal>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <li className="card-tech h-full list-none p-6">
                    <span className="font-mono text-3xl text-electric">
                      {String(i + 1).padStart(2, "0")}
                    </span>
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
              <SectionHeading kicker="// area" title="Valencia and surrounding towns">
                We work in Valencia city and in the towns around it.
              </SectionHeading>
            </Reveal>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {MUNICIPIOS.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-line bg-canvas px-4 py-2 text-sm text-text"
                >
                  {m === "Valencia capital" ? "Valencia city" : m}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading kicker="// faq" title="Frequently asked questions" />
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
          <ContactButtons
            company={company}
            page={page}
            className="flex flex-col items-center gap-3 sm:flex-row"
          />
        </CtaBand>
      </main>
      <FooterEn company={company} />
    </div>
  );
}

function Page() {
  const company = Route.useLoaderData();
  return <LandingPageEn company={company} page={AVERIAS_EN} />;
}
