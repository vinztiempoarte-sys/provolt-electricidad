import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type CompanyInfo = Tables<"company_info">;
export type Service = Tables<"services">;
export type Project = Tables<"projects">;
export type Testimonial = Tables<"testimonials">;

export type HomeData = {
  company: CompanyInfo;
  services: Service[];
  /** Total de especialidades publicadas (no solo las destacadas de la portada). */
  servicesTotal: number;
  projects: Project[];
  testimonials: Testimonial[];
};

/** Carga en paralelo todo lo que necesita la Home pública. */
export async function fetchHomeData(): Promise<HomeData> {
  const [company, services, servicesCount, projects, testimonials] = await Promise.all([
    supabase.from("company_info").select("*").eq("id", 1).single(),
    supabase
      .from("services")
      .select("*")
      .eq("featured", true)
      .order("order_index", { ascending: true })
      .limit(6),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: true })
      .limit(4),
    supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: true })
      .limit(3),
  ]);

  const error = company.error ?? services.error ?? servicesCount.error ?? projects.error ?? testimonials.error;
  if (error) throw new Error(`No se pudieron cargar los datos: ${error.message}`);
  if (!company.data) throw new Error("Falta la fila de company_info (id = 1).");

  return {
    company: company.data,
    services: services.data ?? [],
    servicesTotal: servicesCount.count ?? 0,
    projects: projects.data ?? [],
    testimonials: testimonials.data ?? [],
  };
}
