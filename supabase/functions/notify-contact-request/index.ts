import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import nodemailer from "npm:nodemailer@6.9.13";

// Avisa por correo de cada solicitud nueva: formulario de contacto (contact_requests) y
// citas / solicitudes de llamada (appointments).
// La llama un trigger de la base de datos con el id de la fila. Solo envía si la fila existe
// y aún no se ha avisado (notified_at), así que no sirve para mandar correos arbitrarios.

const SMTP_HOST = "mail.provoltelectricidad.com";
const SMTP_PORT = 465;
const SMTP_USER = "info@provoltelectricidad.com";
const NOTIFY_TO = ["info@provoltelectricidad.com", "provoltelectricidad@gmail.com"];
const PLACEHOLDER_EMAIL = "sin-email@pendiente.provoltelectricidad.com";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

type Line = [label: string, value: string];

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let id = "";
  let table = "contact_requests";
  try {
    const body = await req.json();
    id = typeof body?.id === "string" ? body.id : "";
    if (body?.table === "appointments") table = "appointments";
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!UUID.test(id)) return new Response("Bad request", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const columns =
    table === "appointments"
      ? "id,name,email,phone,service_id,preferred_date,preferred_time,meeting_type,created_at"
      : "id,name,email,phone,message,service_id,source,created_at";

  // Reserva la fila: solo el primero que la marca envía el correo
  const { data, error } = await supabase
    .from(table)
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .is("notified_at", null)
    .select(columns)
    .maybeSingle();
  if (error) return new Response("Error", { status: 500 });
  if (!data) return new Response("Nothing to do", { status: 200 });
  // deno-lint-ignore no-explicit-any
  const row = data as any;

  let service = "";
  if (row.service_id) {
    const { data: s } = await supabase.from("services").select("title").eq("id", row.service_id).maybeSingle();
    service = s?.title ?? "";
  }

  const pass = Deno.env.get("SMTP_PASS");
  if (!pass) {
    await supabase.from(table).update({ notified_at: null }).eq("id", id);
    return new Response("SMTP_PASS no configurado", { status: 500 });
  }

  const when = new Date(row.created_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  const name = oneLine(row.name ?? "");
  const email = oneLine(row.email ?? "");
  const hasEmail = email !== "" && email !== PLACEHOLDER_EMAIL;

  let heading: string;
  let subject: string;
  let lines: Line[];
  let message = "";
  let panel: string;

  if (table === "appointments") {
    const isCall = row.meeting_type === "llamada";
    const tipo = isCall
      ? "Llamada"
      : row.meeting_type === "videollamada"
        ? "Videollamada"
        : row.meeting_type === "presencial"
          ? "Visita presencial"
          : oneLine(String(row.meeting_type ?? ""));
    heading = isCall ? "Nueva solicitud de llamada" : "Nueva solicitud de cita";
    subject = `${isCall ? "Te piden una llamada" : "Nueva cita"}: ${name.slice(0, 80)}`;
    lines = [
      ["Nombre", name],
      ["Teléfono", oneLine(row.phone ?? "(no indicado)")],
      ...(hasEmail ? ([["Email", email]] as Line[]) : []),
      ["Tipo", tipo],
      ...(service ? ([["Servicio", oneLine(service)]] as Line[]) : []),
      ["Fecha preferida", oneLine(String(row.preferred_date ?? ""))],
      ["Franja preferida", oneLine(String(row.preferred_time ?? ""))],
      ["Recibida", when],
    ];
    panel = "https://provoltelectricidad.com/admin/citas";
  } else {
    heading = "Nueva solicitud de contacto";
    subject = `Nueva solicitud: ${name.slice(0, 80)}`;
    lines = [
      ["Nombre", name],
      ["Teléfono", oneLine(row.phone ?? "(no indicado)")],
      ["Email", email],
      ...(service ? ([["Servicio", oneLine(service)]] as Line[]) : []),
      ["Recibida", when],
    ];
    message = row.message ?? "";
    panel = "https://provoltelectricidad.com/admin/solicitudes";
  }

  const text = [
    `${heading} en provoltelectricidad.com`,
    "",
    ...lines.map(([l, v]) => `${l}: ${v}`),
    ...(message ? ["", "Mensaje:", message] : []),
    "",
    `Ver y gestionar: ${panel}`,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
<h2 style="margin:0 0 12px">${esc(heading)}</h2>
${lines.map(([l, v]) => `<p style="margin:0 0 4px"><b>${esc(l)}:</b> ${esc(v)}</p>`).join("\n")}
${message ? `<p style="margin:12px 0 4px"><b>Mensaje:</b></p><p style="margin:0 0 16px;white-space:pre-wrap">${esc(message)}</p>` : ""}
<p style="margin:16px 0 0"><a href="${panel}">Ver y gestionar en el panel</a></p>
</div>`;

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: SMTP_USER, pass },
    });
    await transport.sendMail({
      from: `Provolt Web <${SMTP_USER}>`,
      to: NOTIFY_TO,
      replyTo: hasEmail && EMAIL.test(email) ? email : undefined,
      subject,
      text,
      html,
    });
  } catch (e) {
    // Libera la fila para poder reintentar y deja el motivo en los logs
    await supabase.from(table).update({ notified_at: null }).eq("id", id);
    console.error("Error enviando el correo:", e instanceof Error ? e.message : String(e));
    return new Response("Error enviando el correo", { status: 502 });
  }

  return new Response("ok", { status: 200 });
});
