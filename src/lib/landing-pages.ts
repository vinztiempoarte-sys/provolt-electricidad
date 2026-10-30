/**
 * Contenido de las páginas de captación (averías urgentes y boletines + proyectos).
 * Solo datos verificados del titular o información general del sector; sin cifras inventadas.
 */

export type LandingItem = { title: string; text?: string };
export type LandingBlock = { id: string; kicker: string; title: string; intro?: string; items: LandingItem[] };
export type LandingFaq = { q: string; a: string };

export type LandingContent = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  serviceName: string;
  crumb: string;
  kicker: string;
  title: string;
  subtitle: string;
  blocks: LandingBlock[];
  stepsTitle: string;
  steps: LandingItem[];
  faq: LandingFaq[];
  ctaTitle: string;
  /** Mensaje de WhatsApp precargado. */
  whatsapp: string;
};

/** Municipios que atiende el titular (zona de servicio: Valencia y alrededores). */
export const MUNICIPIOS = [
  "Valencia capital",
  "Paiporta",
  "Torrent",
  "Paterna",
  "Mislata",
  "Alaquàs",
  "Manises",
  "Alboraya",
  "Burjassot",
  "Xirivella",
  "Catarroja",
  "Sagunto",
  "Albal",
  "Massanassa",
  "Aldaia",
] as const;

export const AVERIAS: LandingContent = {
  path: "/averias-urgentes",
  metaTitle: "Electricista Urgente en Valencia 24 horas | Averías Eléctricas | Provolt",
  metaDescription:
    "Electricista urgente en Valencia y alrededores, 24 horas, todos los días del año. Sin luz, salta el diferencial, cortocircuitos y averías. Llama al 722 62 40 40.",
  serviceName: "Electricista urgente 24 horas",
  crumb: "Averías urgentes",
  kicker: "// averías urgentes 24 h",
  title: "Electricista urgente en Valencia, 24 horas",
  subtitle:
    "¿Te has quedado sin luz o tienes una avería eléctrica? Llámanos. Atendemos urgencias todos los días del año, festivos y fines de semana incluidos, en Valencia y alrededores.",
  blocks: [
    {
      id: "averias",
      kicker: "// qué atendemos",
      title: "Averías eléctricas que reparamos",
      intro: "En viviendas, locales, comercios y naves.",
      items: [
        { title: "Sin luz", text: "En toda la casa, en una zona o en un solo circuito." },
        { title: "Salta el diferencial o el magnetotérmico", text: "Localizamos qué lo provoca y lo solucionamos." },
        { title: "Enchufes e interruptores", text: "Que no funcionan, chisporrotean o se calientan." },
        { title: "Cortocircuitos y chispas", text: "Cables dañados, empalmes en mal estado y fallos de aislamiento." },
        { title: "Olor a quemado", text: "Revisamos la instalación antes de que vaya a más." },
        { title: "Cuadro eléctrico con problemas", text: "Reparación y sustitución de protecciones." },
      ],
    },
    {
      id: "seguridad",
      kicker: "// seguridad",
      title: "Qué hacer mientras llegamos",
      intro: "Unas precauciones sencillas que evitan accidentes.",
      items: [
        { title: "Corta la corriente general", text: "Si hay olor a quemado, chispas o humo y puedes hacerlo con seguridad." },
        { title: "No toques cables ni enchufes dañados", text: "Y no manipules la instalación con las manos mojadas." },
        { title: "Desconecta los aparatos del circuito afectado", text: "Así evitas daños y facilitas encontrar el origen del fallo." },
        { title: "Si hay fuego o peligro para las personas", text: "Llama primero al 112." },
      ],
    },
  ],
  stepsTitle: "Cómo trabajamos una urgencia",
  steps: [
    { title: "Llámanos", text: "Al 722 62 40 40, a cualquier hora, y cuéntanos qué ocurre." },
    { title: "Localizamos el origen", text: "Revisamos la instalación hasta encontrar la causa de la avería." },
    { title: "Reparamos", text: "Arreglamos o sustituimos lo necesario para dejarte con luz y con seguridad." },
    { title: "Te lo explicamos", text: "Te contamos qué ha pasado y cómo evitar que se repita." },
  ],
  faq: [
    {
      q: "¿Atendéis urgencias de noche, fines de semana y festivos?",
      a: "Sí. Atendemos averías las 24 horas, todos los días del año, festivos y fines de semana incluidos.",
    },
    {
      q: "¿Por qué salta el diferencial?",
      a: "Suele deberse a una fuga a tierra: un aparato defectuoso, humedad o un fallo en la instalación. Desconecta los aparatos para ver cuál lo provoca. Si sigue saltando, llámanos para localizar el origen.",
    },
    {
      q: "¿Qué hago si huele a quemado?",
      a: "Si puedes hacerlo con seguridad, corta la corriente general y no uses ese circuito. Después llámanos. Si hay fuego o peligro, llama al 112.",
    },
    {
      q: "¿Cuánto cuesta reparar una avería?",
      a: "Depende de cuál sea la avería y de lo que haya que reparar. Llámanos y cuéntanos el problema.",
    },
    {
      q: "¿Trabajáis también en locales, comercios y naves?",
      a: "Sí. Atendemos averías en viviendas, locales, comercios y naves.",
    },
    {
      q: "¿Qué zonas cubrís?",
      a: "Valencia capital y los municipios de alrededor, como Paiporta, Torrent, Paterna, Mislata, Alaquàs, Manises, Alboraya, Burjassot, Xirivella, Catarroja, Sagunto, Albal, Massanassa y Aldaia.",
    },
  ],
  ctaTitle: "¿Sin luz o con una avería? Llámanos ahora",
  whatsapp: "Hola, necesito un electricista urgente.",
};

export const BOLETINES: LandingContent = {
  path: "/boletines-y-proyectos-electricos",
  metaTitle: "Boletines y Proyectos Eléctricos en Valencia | Provolt Electricidad",
  metaDescription:
    "Gestionamos boletines eléctricos, certificados de instalación y proyectos eléctricos para reformas y obra nueva en Valencia y alrededores.",
  serviceName: "Boletines y proyectos eléctricos",
  crumb: "Boletines y proyectos eléctricos",
  kicker: "// boletines y proyectos",
  title: "Boletines y proyectos eléctricos en Valencia",
  subtitle:
    "Gestionamos el boletín eléctrico, el certificado de instalación y los proyectos eléctricos para reformas y obra nueva, con asesoramiento en todo el proceso para que cumpla la normativa y evites retrasos.",
  blocks: [
    {
      id: "boletin",
      kicker: "// boletín eléctrico",
      title: "Cuándo suele hacer falta un boletín",
      intro: "El boletín es el certificado de instalación eléctrica que firma un instalador autorizado.",
      items: [
        { title: "Obra nueva y reformas", text: "Cuando se modifica o se crea la instalación eléctrica." },
        { title: "Alta de suministro o cambio de potencia", text: "Para contratar o modificar la luz con la distribuidora." },
        { title: "Locales y comercios", text: "Al abrir un negocio o cambiar de actividad." },
        { title: "Regularizar instalaciones antiguas", text: "Poner al día una instalación que no está legalizada." },
        { title: "Cuando te lo exige la distribuidora o la administración", text: "Te decimos qué documentación necesitas." },
      ],
    },
    {
      id: "proyecto",
      kicker: "// proyectos eléctricos",
      title: "Proyectos eléctricos a medida",
      intro: "Según el tipo y la potencia de la instalación, redactamos el proyecto o la memoria técnica y lo tramitamos.",
      items: [
        { title: "Reformas integrales y obra nueva", text: "Planificación de circuitos, protecciones y potencia necesaria." },
        { title: "Locales y naves", text: "Instalaciones adaptadas a tu actividad y a la normativa." },
        { title: "Instalaciones de mayor potencia", text: "Con la documentación técnica que exija cada caso." },
        { title: "Inspección de una OCA", text: "Si tu instalación la necesita, preparamos la instalación y coordinamos la visita." },
      ],
    },
    {
      id: "documentacion",
      kicker: "// documentación",
      title: "Qué conviene tener a mano",
      items: [
        { title: "Datos del titular y de la dirección" },
        { title: "El CUPS del suministro", text: "Es el código que aparece en tu factura de la luz." },
        { title: "La potencia contratada", text: "Y, si la tienes, la documentación o el boletín anterior." },
      ],
    },
  ],
  stepsTitle: "Cómo lo hacemos",
  steps: [
    { title: "Cuéntanos tu caso", text: "Por teléfono, WhatsApp o con el formulario de contacto." },
    { title: "Revisamos la instalación", text: "Y te decimos qué documentación hace falta: boletín, memoria técnica o proyecto." },
    { title: "Preparamos y ejecutamos", text: "Redactamos lo necesario y hacemos las adaptaciones que requiera la instalación." },
    { title: "Emitimos y tramitamos", text: "Emitimos el boletín o certificado y gestionamos los trámites con la distribuidora." },
  ],
  faq: [
    {
      q: "¿Qué es el boletín eléctrico?",
      a: "Es el certificado de instalación eléctrica. Acredita que la instalación cumple el Reglamento Electrotécnico de Baja Tensión y lo firma un instalador autorizado.",
    },
    {
      q: "¿Cuándo hace falta proyecto y cuándo memoria técnica?",
      a: "Depende del tipo de instalación y de su potencia. Revisamos tu caso y te decimos qué documentación corresponde.",
    },
    {
      q: "¿Gestionáis los trámites con la distribuidora?",
      a: "Sí. Gestionamos el boletín, el certificado de instalación y los trámites con la distribuidora.",
    },
    {
      q: "¿Cuánto se tarda?",
      a: "Depende del tipo de instalación y de los plazos de la distribuidora. Te lo indicamos cuando revisamos tu caso.",
    },
    {
      q: "¿Mi instalación necesita inspección de una OCA?",
      a: "Algunas instalaciones deben pasar una inspección inicial o periódica de un Organismo de Control Autorizado. Te decimos si es tu caso, preparamos la instalación y coordinamos la visita.",
    },
    {
      q: "¿Quién firma el boletín?",
      a: "Lo firma un instalador eléctrico autorizado, con carnets IBTB e IBTE 1 a 9 e inscrito en el Registro Integrado Industrial.",
    },
  ],
  ctaTitle: "¿Necesitas un boletín o un proyecto eléctrico?",
  whatsapp: "Hola, necesito información sobre un boletín o un proyecto eléctrico.",
};
