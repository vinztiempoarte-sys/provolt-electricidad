import type { LandingBlock, LandingFaq, LandingItem } from "./landing-pages";

export type LandingContentEn = {
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
  whatsapp: string;
};

export const EN_PATH = "/en/emergency-electrician-valencia";

/** Versión en inglés de la página de averías urgentes (campaña de Google Ads en inglés). */
export const AVERIAS_EN: LandingContentEn = {
  path: EN_PATH,
  metaTitle: "Emergency Electrician in Valencia, 24 Hours | Provolt Electricidad",
  metaDescription:
    "24-hour emergency electrician in Valencia and the surrounding towns, every day of the year. No power, tripping breaker, short circuits. Call 722 62 40 40 or message us in English on WhatsApp.",
  serviceName: "24-hour emergency electrician",
  crumb: "Emergency electrician",
  kicker: "// emergency electrician 24 h",
  title: "Emergency electrician in Valencia, 24 hours",
  subtitle:
    "No power or an electrical fault at home? Call us or write to us in English on WhatsApp. We attend emergencies every day of the year, weekends and public holidays included, in Valencia and the surrounding towns.",
  blocks: [
    {
      id: "faults",
      kicker: "// what we fix",
      title: "Electrical faults we repair",
      intro: "In homes, shops, offices and industrial units.",
      items: [
        { title: "No power", text: "In the whole home, in one area or on a single circuit." },
        { title: "Tripping breaker or RCD", text: "We find what is causing it and fix it." },
        { title: "Sockets and switches", text: "That do not work, spark or get hot." },
        {
          title: "Short circuits and sparks",
          text: "Damaged cables, poor connections and insulation faults.",
        },
        { title: "Smell of burning", text: "We check the installation before it gets worse." },
        {
          title: "Fuse box (consumer unit) problems",
          text: "Repair and replacement of protection devices.",
        },
      ],
    },
    {
      id: "safety",
      kicker: "// safety",
      title: "What to do until we arrive",
      intro: "A few simple precautions that prevent accidents.",
      items: [
        {
          title: "Switch off the main power",
          text: "If there is a smell of burning, sparks or smoke and you can do it safely.",
        },
        {
          title: "Do not touch damaged cables or sockets",
          text: "And never work on the installation with wet hands.",
        },
        {
          title: "Unplug the appliances on the affected circuit",
          text: "It avoids damage and helps find the source of the fault.",
        },
        { title: "If there is fire or danger to people", text: "Call 112 first." },
      ],
    },
  ],
  stepsTitle: "How we handle an emergency",
  steps: [
    {
      title: "Call or message us",
      text: "Call 722 62 40 40 (phone calls are in Spanish) or write to us in English on WhatsApp. Tell us what is happening and where you are.",
    },
    {
      title: "We find the source",
      text: "We check the installation until we find the cause of the fault.",
    },
    {
      title: "We repair it",
      text: "We fix or replace what is needed to get your power back safely.",
    },
    {
      title: "We explain it",
      text: "We tell you what happened and how to avoid it happening again.",
    },
  ],
  faq: [
    {
      q: "Can I contact you in English?",
      a: "Yes. You can write to us in English on WhatsApp and we will reply in writing. Phone calls are handled in Spanish.",
    },
    {
      q: "Do you attend emergencies at night, at weekends and on public holidays?",
      a: "Yes. We attend electrical faults 24 hours a day, every day of the year, weekends and public holidays included.",
    },
    {
      q: "Why does my breaker keep tripping?",
      a: "It is usually caused by a leakage to earth: a faulty appliance, damp or a fault in the installation. Unplug your appliances to see which one triggers it. If it keeps tripping, contact us so we can find the source.",
    },
    {
      q: "What should I do if I smell burning?",
      a: "If you can do it safely, switch off the main power and do not use that circuit. Then contact us. If there is fire or danger, call 112.",
    },
    {
      q: "How much does a repair cost?",
      a: "It depends on the fault and on what needs repairing. Contact us and tell us about the problem.",
    },
    {
      q: "Do you also work in shops, offices and industrial units?",
      a: "Yes. We attend electrical faults in homes, shops, offices and industrial units.",
    },
    {
      q: "Which areas do you cover?",
      a: "Valencia city and the surrounding towns, such as Paiporta, Torrent, Paterna, Mislata, Alaquàs, Manises, Alboraya, Burjassot, Xirivella, Catarroja, Albal, Massanassa and Aldaia.",
    },
  ],
  ctaTitle: "No power or an electrical fault? Contact us now",
  whatsapp: "Hello, I need an emergency electrician in Valencia.",
};
