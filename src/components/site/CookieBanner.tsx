import { useEffect, useRef, useState } from "react";
import { Cookie } from "lucide-react";
import { COOKIE_CONSENT_KEY } from "@/lib/consent";

/** Aviso de cookies en la primera visita. Hoy solo hay almacenamiento técnico (sesión). */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  // En móvil el aviso ocupa todo el ancho: los botones flotantes se colocan encima de él
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const update = () => {
      if (ref.current) root.style.setProperty("--cookie-h", `${ref.current.offsetHeight}px`);
    };
    root.setAttribute("data-cookie-banner", "open");
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.removeAttribute("data-cookie-banner");
      root.style.removeProperty("--cookie-h");
    };
  }, [visible]);

  function save(choice: "aceptadas" | "rechazadas_no_esenciales") {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ choice, date: new Date().toISOString() }),
      );
    } catch {
      // Sin almacenamiento disponible: se cierra igualmente para esta visita
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Aviso de cookies"
      className="fixed right-3 left-3 z-40 max-w-md rounded-lg border border-line bg-surface p-4 text-text shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none sm:right-auto sm:left-6 sm:p-5"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="flex items-start gap-3 text-xs leading-relaxed text-text-muted sm:text-sm">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
        <span>
          Usamos cookies técnicas necesarias para el funcionamiento del sitio (sesión de usuario).
          No usamos cookies de analítica ni publicidad de terceros en esta versión.{" "}
          <a href="/politica-privacidad" className="font-medium text-electric hover:underline">
            Más información
          </a>
        </span>
      </p>
      <div className="mt-3 flex gap-2 sm:mt-4">
        <button
          type="button"
          onClick={() => save("aceptadas")}
          className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => save("rechazadas_no_esenciales")}
          className="btn-secondary px-3 py-2 text-sm sm:px-4"
        >
          <span className="sm:hidden">Rechazar</span>
          <span className="hidden sm:inline">Rechazar no esenciales</span>
        </button>
      </div>
    </div>
  );
}
