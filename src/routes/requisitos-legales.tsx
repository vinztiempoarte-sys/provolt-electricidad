import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  ClipboardList,
  FileCheck,
  Landmark,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { fetchCompany } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { PageSkeleton } from "@/components/site/Skeletons";
import { breadcrumbLd, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/requisitos-legales")({
  loader: () => fetchCompany(),
  head: () => {
    const title = "Requisitos legales | Provolt Electricidad";
    const description =
      "Provolt Electricidad trabaja como instalador eléctrico autorizado: carnets IBTB e IBTE 1-9, inscripción en el Registro Integrado Industrial y seguro de responsabilidad civil en vigor.";
    const crumbs = [{ label: "Inicio", to: "/" }, { label: "Requisitos legales" }];
    const og = pageMeta({ title, description, path: "/requisitos-legales" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
      scripts: [ldScript(breadcrumbLd(crumbs))],
    };
  },
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: RequisitosLegalesPage,
});

type Item = { Icon: LucideIcon; title: string; text: string };

const HABILITACION: Item[] = [
  {
    Icon: BadgeCheck,
    title: "Carnet de instalador IBTB",
    text: "Carnet de Instalador en Baja Tensión (categoría básica), que habilita para ejecutar y legalizar instalaciones eléctricas de baja tensión.",
  },
  {
    Icon: Award,
    title: "Categorías de especialista IBTE 1 a 9",
    text: "Además de la categoría básica, el titular cuenta con las categorías de especialista IBTE 1 a 9.",
  },
  {
    Icon: Landmark,
    title: "Registro Integrado Industrial",
    text: "Inscripción en el Registro Integrado Industrial con el número 46/94224. Puedes comprobarla en la consulta pública del propio registro.",
  },
];

const GARANTIAS: Item[] = [
  {
    Icon: ShieldCheck,
    title: "Seguro de responsabilidad civil",
    text: "Póliza de responsabilidad civil en vigor para la actividad de instalador eléctrico.",
  },
  {
    Icon: FileCheck,
    title: "Boletines y certificados",
    text: "Cuando la instalación lo requiere se emite el boletín o certificado de instalación eléctrica y se gestiona su tramitación.",
  },
  {
    Icon: ClipboardList,
    title: "Actividad dada de alta",
    text: "La actividad la ejerce su titular, Vicente Cataluña Sala, como autónomo. Los datos identificativos completos están en el aviso legal.",
  },
];

function Block({ Icon, title, text }: Item) {
  return (
    <div className="card-tech card-tech-interactive h-full p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{text}</p>
    </div>
  );
}

function Grid({ items }: { items: Item[] }) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80}>
          <Block {...item} />
        </Reveal>
      ))}
    </div>
  );
}

function RequisitosLegalesPage() {
  const company = Route.useLoaderData();

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Requisitos legales" }]} />
        }
        kicker="// marco normativo"
        title="Instalador eléctrico autorizado"
        subtitle="Habilitación técnica, registro y seguro: lo que debes poder comprobar antes de contratar a un electricista."
      />

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// habilitación" title="Habilitación para instalar">
              Lo que exige el Reglamento Electrotécnico de Baja Tensión para poder ejecutar y
              legalizar instalaciones.
            </SectionHeading>
          </Reveal>
          <Grid items={HABILITACION} />
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// garantías" title="Seguro, documentación y alta">
              Qué respalda cada trabajo una vez terminado.
            </SectionHeading>
          </Reveal>
          <Grid items={GARANTIAS} />
        </div>
      </section>

      <CtaBand title="¿Tienes una instalación que legalizar o revisar?">
        <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
          Pedir presupuesto
        </Link>
      </CtaBand>
    </PageShell>
  );
}
