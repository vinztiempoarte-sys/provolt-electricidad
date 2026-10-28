import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { Header } from "../components/site/Header";
import { FloatingContact } from "../components/site/FloatingContact";
import { CookieBanner } from "../components/site/CookieBanner";
import { NotFoundPanel } from "../components/site/NotFoundPanel";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <NotFoundPanel
        title="Página no encontrada"
        message="La página que buscas no existe o se ha movido."
      >
        <Link to="/" className="btn-primary px-7 py-3.5">
          Volver al inicio
        </Link>
        <Link to="/contacto" className="btn-secondary px-7 py-3.5">
          Contactar
        </Link>
      </NotFoundPanel>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          No se ha podido cargar la página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ha habido un problema por nuestra parte. Prueba a recargar o vuelve al inicio. Si es una urgencia, llámanos al 722 62 40 40.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Electricista en Valencia 24h | Boletines, Proyectos y OCA | Provolt" },
      {
        name: "description",
        content:
          "Si es eléctrico, es Provolt. Electricista en Valencia y alrededores: averías urgentes 24 h, boletines eléctricos, proyectos eléctricos e inspección OCA.",
      },
      { name: "theme-color", content: "#00060c" },
      { property: "og:title", content: "Electricista en Valencia 24h | Boletines, Proyectos y OCA | Provolt" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <FloatingContact />
      <CookieBanner />
      <Toaster theme="dark" position="bottom-center" richColors />
    </QueryClientProvider>
  );
}
