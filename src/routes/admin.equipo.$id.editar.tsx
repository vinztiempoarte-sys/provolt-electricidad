import { createFileRoute } from "@tanstack/react-router";
import { TeamForm } from "@/components/admin/sections/Team";

export const Route = createFileRoute("/admin/equipo/$id/editar")({
  head: () => ({ meta: [{ title: "Editar miembro | Admin Provolt" }] }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  return <TeamForm id={id} />;
}
