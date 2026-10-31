import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { classifyLink, trackEvent } from "@/lib/analytics";

/** Registra visitas por página y pulsaciones en llamar / WhatsApp. No muestra nada. */
export function SiteTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    trackEvent("view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const event = classifyLink(anchor as HTMLAnchorElement);
      if (event) trackEvent(event);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
