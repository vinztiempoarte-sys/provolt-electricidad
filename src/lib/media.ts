/**
 * Vídeos de fondo (Pexels, licencia gratuita). Cada vídeo lleva varias fuentes en
 * orden de preferencia: el navegador usa la primera que cargue.
 *  1) Descarga original de Pexels → máxima calidad disponible (4K cuando existe).
 *  2) Versión 1080p verificada (si la hay) como respaldo.
 * PROVISIONAL: son vídeos de stock enlazados. Antes de publicar se sustituyen por vídeos propios o
 * con licencia, alojados en el servidor, para no depender de terceros.
 */
export type BackgroundVideo = {
  id: string;
  label: string;
  sources: string[];
  poster?: string;
  /** Tiempo en pantalla en la rotación del hero (por defecto 7 s). */
  durationMs?: number;
};

const original = (id: number) => `https://www.pexels.com/download/video/${id}/`;

/** Vídeo propio de Provolt: primer clip de la portada y de averías urgentes. */
export const PROVOLT_SPOT: BackgroundVideo = {
  id: "provolt-spot",
  label: "Provolt Electricidad, 24 horas",
  sources: ["/videos/provolt-averias.mp4"],
  poster: "/videos/provolt-averias-poster.jpg",
  durationMs: 10000,
};

export const HERO_VIDEOS: BackgroundVideo[] = [
  PROVOLT_SPOT,
  {
    id: "cuadro-electrico",
    label: "Cuadros eléctricos",
    sources: [
      original(28886877),
      "https://videos.pexels.com/video-files/28886877/12504681_1920_1080_30fps.mp4",
    ],
    poster:
      "https://images.pexels.com/videos/28886877/electrical-panel-28886877.jpeg?auto=compress&w=1920",
  },
  {
    id: "instalacion",
    label: "Instalaciones",
    sources: [original(34572318)],
  },
  {
    id: "industria",
    label: "Industria",
    sources: [original(35552709)],
  },
  {
    id: "alta-tension",
    label: "Red eléctrica",
    sources: [
      original(10151854),
      "https://videos.pexels.com/video-files/10151854/10151854-hd_1920_1080_24fps.mp4",
    ],
    poster:
      "https://images.pexels.com/videos/10151854/pexels-photo-10151854.jpeg?auto=compress&w=1920",
  },
];

export const TRUST_VIDEO: BackgroundVideo = {
  id: "lineas",
  label: "Líneas eléctricas",
  sources: [original(30567734)],
};

const byId = (ids: string[]) =>
  ids.map((id) => HERO_VIDEOS.find((v) => v.id === id)).filter((v): v is BackgroundVideo => !!v);

/** Clips de averías de día (claros). Distintos de los de la portada. */
export const AVERIAS_VIDEOS: BackgroundVideo[] = [
  PROVOLT_SPOT,
  { id: "operario-cuadro", label: "Operario trabajando en un cuadro eléctrico", sources: [original(30295544)] },
  { id: "tecnico-pared", label: "Técnico revisando cableado", sources: [original(18780266)] },
  { id: "cuadro-interruptores", label: "Cuadro con interruptores", sources: [original(6520278)] },
];

/** Versión nocturna (oscura), guardada por si se quiere volver a ella: cambiar AVERIAS_VIDEOS por esta. */
export const AVERIAS_VIDEOS_NOCHE: BackgroundVideo[] = [
  { id: "armario-noche", label: "Armario eléctrico de noche", sources: [original(19888574)] },
  { id: "cuadro-interruptores", label: "Cuadro con interruptores", sources: [original(6520278)] },
  { id: "tecnico-averia", label: "Técnico reparando", sources: [original(29731535)] },
];

/** Vídeos de cabecera de boletines (mismos clips que la portada). */
export const BOLETINES_VIDEOS = byId(["cuadro-electrico", "instalacion", "industria"]);
