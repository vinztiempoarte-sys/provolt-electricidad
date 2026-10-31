import { createFileRoute } from "@tanstack/react-router";
import { VisitsDashboard } from "@/components/admin/sections/Visits";

export const Route = createFileRoute("/admin/visitas")({
  head: () => ({ meta: [{ title: "Visitas | Admin Provolt" }] }),
  component: VisitsDashboard,
});
