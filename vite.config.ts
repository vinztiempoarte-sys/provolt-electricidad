// Configuración de build de Provolt Electricidad (TanStack Start + Nitro).
// Destino: servidor Node (cPanel "Setup Node.js App" en Koryfi). Salida: .output/server/index.mjs
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    // Envoltorio SSR propio de la app (captura de errores): src/server.ts
    tanstackStart({ server: { entry: "server" } }),
    nitro({ preset: "node-server" }),
    viteReact(),
  ],
});
