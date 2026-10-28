import { createFileRoute } from "@tanstack/react-router";
import { ServiceForm } from "@/components/admin/sections/Services";

export const Route = createFileRoute("/admin/servicios/$id/editar")({
  head: () => ({ meta: [{ title: "Editar servicio | Admin Provolt" }] }),
  component: EditService,
});

function EditService() {
  const { id } = Route.useParams();
  return <ServiceForm id={id} />;
}
