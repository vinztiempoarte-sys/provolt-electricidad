import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany, fetchProjects } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageSkeleton } from "@/components/site/Skeletons";
import { breadcrumbLd, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/proyectos/")({
  loader: async () => {
    const [company, projects] = await Promise.all([fetchCompany(), fetchProjects()]);
    return { company, projects };
  },
  head: () => {
    const title = "Trabajos realizados | Provolt Electricidad";
    const description =
      "Trabajos de instalación eléctrica realizados por Provolt Electricidad en Valencia y alrededores.";
    const crumbs = [{ label: "Inicio", to: "/" }, { label: "Trabajos realizados" }];
    const og = pageMeta({ title, description, path: "/proyectos" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
      scripts: [ldScript(breadcrumbLd(crumbs))],
    };
  },
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: ProyectosPage,
});

function ProyectosPage() {
  const { company, projects } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("Todos");
  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = filter === "Todos" ? projects : projects.filter((p) => p.category === filter);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Trabajos realizados" }]} />
        }
        kicker="// áreas de trabajo"
        title="Áreas de trabajo"
        subtitle="Instalaciones y reformas eléctricas realizadas en Valencia y alrededores."
      />
      <section className="theme-light bg-blueprint py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {projects.length > 0 ? (
            <FilterChips
              label="Filtrar áreas de trabajo por categoría"
              options={categories}
              value={filter}
              onChange={setFilter}
            />
          ) : null}
          <div key={filter} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <div
                key={p.id}
                className="animate-in fill-mode-both duration-200 ease-out fade-in motion-reduce:animate-none"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                message={
                  projects.length === 0
                    ? "Muy pronto podrás ver aquí nuestras áreas de trabajo."
                    : "No hay áreas de trabajo en esta categoría todavía."
                }
              />
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
