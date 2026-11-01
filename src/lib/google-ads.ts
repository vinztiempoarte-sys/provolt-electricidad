/**
 * Medición de conversiones de Google Ads (llamada, WhatsApp y formulario).
 * - La etiqueta de Google NO se carga hasta que el visitante pulsa "Aceptar" en el aviso de cookies.
 * - Si rechaza (o no ha elegido), no se carga nada y no se envía nada a Google.
 * - Solo se mide la conversión; no se activan analítica ni personalización de anuncios.
 */
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION } from "@/lib/consent";
import type { SiteEvent } from "@/lib/analytics";

export const GOOGLE_ADS_ID = "AW-16757907999";

/** Etiqueta de cada acción de conversión de Google Ads (cuenta elcomerz). */
const CONVERSION_SEND_TO: Partial<Record<SiteEvent, string>> = {
  call: `${GOOGLE_ADS_ID}/4LrqCKPGyIEaEJ_E5bY-`, // "llamada desde el anuncio"
  whatsapp: `${GOOGLE_ADS_ID}/-XTTCLrR2IEaEJ_E5bY-`, // "click whatsapp"
  form: `${GOOGLE_ADS_ID}/4xvtCJvwg7AdEJ_E5bY-`, // "Provolt - Formulario"
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type CookieConsent = { choice: "aceptadas" | "rechazadas_no_esenciales"; version: number };

/** Elección guardada del aviso de cookies; null si no hay o es de una versión anterior del aviso. */
export function readCookieConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent> | null;
    if (!parsed || parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (parsed.choice !== "aceptadas" && parsed.choice !== "rechazadas_no_esenciales") return null;
    return { choice: parsed.choice, version: parsed.version };
  } catch {
    return null;
  }
}

function hasAdsConsent(): boolean {
  return readCookieConsent()?.choice === "aceptadas";
}

let loaded = false;

/** Carga la etiqueta de Google una sola vez, y solo si el visitante ha aceptado. */
export function loadGoogleTag(): void {
  if (typeof window === "undefined" || loaded || !hasAdsConsent()) return;
  loaded = true;
  try {
    const layer: unknown[] = (window.dataLayer = window.dataLayer ?? []);
    window.gtag = function () {
      // gtag.js necesita el objeto `arguments`, no un array
      // eslint-disable-next-line prefer-rest-params
      layer.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ADS_ID);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
  } catch {
    /* la medición nunca debe romper la web */
  }
}

/** Envía la conversión a Google Ads. No hace nada sin consentimiento. */
export function trackAdsConversion(event: SiteEvent): void {
  const sendTo = CONVERSION_SEND_TO[event];
  if (!sendTo || typeof window === "undefined" || !hasAdsConsent()) return;
  try {
    loadGoogleTag();
    // "beacon": la conversión sale aunque la página pase a abrir WhatsApp o la llamada
    window.gtag?.("event", "conversion", { send_to: sendTo, transport_type: "beacon" });
  } catch {
    /* la medición nunca debe romper la web */
  }
}
