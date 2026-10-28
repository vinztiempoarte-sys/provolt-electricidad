# Provolt Electricidad — web corporativa

Sitio de **provoltelectricidad.com** (TanStack Start + React + Supabase). Incluye web pública,
blog, reservas de citas, registro/login y paneles de cliente, empleado, proveedor y administración.

## Requisitos
- Node 22
- Un proyecto de Supabase con las migraciones de `supabase/migrations` aplicadas

## Variables de entorno
Copia `.env.example` a `.env` y rellena (la clave es la **publicable**; nunca pongas aquí claves secretas):

    VITE_SUPABASE_URL=
    VITE_SUPABASE_PUBLISHABLE_KEY=

Se leen en **tiempo de compilación**: hay que definirlas antes de `npm run build`.

## Comandos
    npm install
    npm run dev      # desarrollo
    npm run build    # genera .output/
    npm start        # arranca .output/server/index.mjs (usa la variable PORT)

## Despliegue (cPanel · Node.js App)
1. Compilar con las variables de entorno definidas.
2. Subir el contenido de `.output/` a la carpeta de la aplicación (fuera de `public_html`).
3. En cPanel → *Setup Node.js App*: Node 22, archivo de inicio `server/index.mjs`.

## Datos privados
El NIF, el domicilio y el horario del titular **no están en el repositorio**: se guardan en la tabla
`company_info` de Supabase y la web los lee de ahí (aviso legal, contacto).
