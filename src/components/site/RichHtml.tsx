/** Pinta HTML de artículo ya limpiado en el servidor (ver blog-wp.server.ts). */
export function RichHtml({ html }: { html: string }) {
  return <div className="wp-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
