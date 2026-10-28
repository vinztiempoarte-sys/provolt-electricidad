import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany } from "@/lib/site-data";
import { LandingPage } from "@/components/site/LandingPage";
import { PageSkeleton } from "@/components/site/Skeletons";
import { BOLETINES } from "@/lib/landing-pages";
import { breadcrumbLd, faqLd, ldScript, pageMeta, serviceLd } from "@/lib/seo";

export const Route = createFileRoute("/boletines-y-proyectos-electricos")({
  loader: () => fetchCompany(),
  head: () => {
    const page = BOLETINES;
    const og = pageMeta({ title: page.metaTitle, description: page.metaDescription, path: page.path });
    const crumbs = [{ label: "Inicio", to: "/" }, { label: page.crumb }];
    return {
      meta: [{ title: page.metaTitle }, { name: "description", content: page.metaDescription }, ...og.meta],
      links: og.links,
      scripts: [
        ldScript(
          serviceLd({ title: page.serviceName, short_description: page.metaDescription }, page.path),
        ),
        ldScript(faqLd(page.faq)),
        ldScript(breadcrumbLd(crumbs)),
      ],
    };
  },
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  component: Page,
});

function Page() {
  const company = Route.useLoaderData();
  return <LandingPage company={company} page={BOLETINES} />;
}
