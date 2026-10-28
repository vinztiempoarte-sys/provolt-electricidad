import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Check, Headset, Layers, Users } from "lucide-react";
import { experienceLabel, fetchCompany, fetchServices, fetchTeam } from "@/lib/site-data";
import { teamPhoto } from "@/lib/images";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SafeImage } from "@/components/site/SafeImage";
import { TrustStrip } from "@/components/site/TrustStrip";
import { PageSkeleton } from "@/components/site/Skeletons";
import { pageMeta } from "@/lib/seo";

const VALUES = [
  {
    Icon: Users,
    title: "Trato directo",
    text: "Hablas con el instalador que va a hacer el trabajo: Vicente Cataluña Sala, autónomo, con 35 años de trayectoria profesional.",
  },
  {
    Icon: Award,
    title: "Instalador autorizado",
    text: "Carnets IBTB e IBTE 1 a 9 e inscripción en el Registro Integrado Industrial (nº 46/94224), con póliza de responsabilidad civil en vigor.",
  },
  {
    Icon: Layers,
    title: "De la avería a la obra",
    text: "Desde un cuadro que salta o un enchufe que falla hasta reformas, boletines, fotovoltaica y cargadores de coche eléctrico.",
  },
  {
    Icon: Headset,
    title: "Urgencias 24 h",
    text: "Atención de averías las 24 horas, todos los días del año, festivos y fines de semana incluidos.",
  },
];

export const Route = createFileRoute("/sobre-nosotros")({
  loader: async () => {
    const [company, team, services] = await Promise.all([
      fetchCompany(),
      fetchTeam(),
      fetchServices(),
    ]);
    return { company, team, services };
  },
  head: () => {
    const title = "Sobre Provolt Electricidad | 35 años de experiencia";
    const description =
      "Provolt Electricidad: instalador eléctrico autorizado en Valencia y alrededores, con 35 años de experiencia, carnets IBTB e IBTE 1-9 y atención de urgencias 24 h.";
    const og = pageMeta({ title, description, path: "/sobre-nosotros" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
    };
  },
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: SobreNosotros,
});

function SobreNosotros() {
  const { company, team, services } = Route.useLoaderData();
  const years = experienceLabel(company.founded_year);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Sobre nosotros" }]} />
        }
        kicker="// trabajo y compromiso"
        title={`${years} años de experiencia en instalaciones eléctricas`}
        subtitle={company.slogan}
      />

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <SectionHeading
              kicker="// quiénes somos"
              title="Un electricista de confianza en Valencia"
            />
          </Reveal>
          <Reveal
            delay={100}
            className="max-w-[68ch] space-y-6 text-lg leading-relaxed text-text-muted"
          >
            <p>
              {company.name} es el negocio de Vicente Cataluña Sala, instalador electricista
              autorizado con sede en Paiporta. Trabaja en Valencia capital y en los municipios de
              alrededor: viviendas, locales, comercios y naves.
            </p>
            <p>
              Los 35 años de experiencia son su trayectoria profesional en el sector. Hace
              instalaciones con su boletín y certificados en regla, presupuesta sin compromiso y
              atiende las urgencias a cualquier hora.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// valores" title="Calidad y fiabilidad" />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card-tech h-full bg-canvas p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-text">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// qué hacemos" title="Especialidades de Provolt" />
          </Reveal>
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service.id} className="flex gap-3 text-text">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                  <span>{service.title}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {team.length > 0 ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={i * 80}>
                  <article className="card-tech h-full overflow-hidden">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-elevated">
                      <SafeImage
                        src={teamPhoto(m, i)}
                        alt={`Retrato de ${m.full_name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-text">{m.full_name}</h3>
                      <p className="mt-1 font-mono text-xs text-electric">{m.role_title}</p>
                      {m.bio ? (
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">{m.bio}</p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}

          <div className="mt-12">
            <Link to="/contacto" className="btn-primary px-7 py-3.5">
              Pedir presupuesto
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip foundedYear={company.founded_year} servicesCount={services.length} />
    </PageShell>
  );
}
