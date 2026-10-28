import { createFileRoute } from "@tanstack/react-router";
import { fetchHomeData } from "@/lib/home-data";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { FeaturedServices } from "@/components/site/FeaturedServices";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Testimonials } from "@/components/site/Testimonials";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { organizationLd, pageMeta, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => fetchHomeData(),
  head: ({ loaderData }) => {
    const company = loaderData?.company;
    const title = "Electricista en Valencia 24h | Boletines, Proyectos y OCA | Provolt";
    const description =
      "Electricista en Valencia y alrededores: averías urgentes 24 h, boletines eléctricos, proyectos eléctricos e inspección OCA. Presupuesto sin compromiso.";
    const og = pageMeta({ title, description, path: "/" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
      scripts: company ? [ldScript(organizationLd(company))] : [],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { company, services, servicesTotal, projects, testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-canvas text-text">
      <Header />
      <main>
        <Hero company={company} />
        <TrustStrip foundedYear={company.founded_year} servicesCount={servicesTotal} />
        <FeaturedServices services={services} />
        {projects.length > 0 ? <FeaturedProjects projects={projects} /> : null}
        {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
        <FinalCta />
      </main>
      <Footer company={company} />
    </div>
  );
}
