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
    const title = "Provolt Electricidad · Electricistas en Valencia | Urgencias 24 h";
    const description =
      "Electricistas autorizados en Valencia y alrededores: averías 24 h, cuadros, reformas, boletines, fotovoltaica y cargadores. 35 años de experiencia. Presupuesto sin compromiso.";
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
  const { company, services, projects, testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-canvas text-text">
      <Header />
      <main>
        <Hero company={company} />
        <TrustStrip foundedYear={company.founded_year} servicesCount={services.length} />
        <FeaturedServices services={services} />
        {projects.length > 0 ? <FeaturedProjects projects={projects} /> : null}
        {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
        <FinalCta />
      </main>
      <Footer company={company} />
    </div>
  );
}
