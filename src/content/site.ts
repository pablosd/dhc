// Datos del negocio: única fuente de verdad (ver CLAUDE.md, regla 4).
// Lo que no está confirmado lleva `// TODO(confirmar) <código>` con la
// pregunta del cuestionario (docs/07-cuestionario-dueno.md).

export const serviceIds = [
  "cabinets",
  "kitchens",
  "ceilings",
  "trim",
  "doors",
  "decks",
  "framing",
  "general",
] as const;

export type ServiceId = (typeof serviceIds)[number];

type Phone = {
  /** Como se muestra: (737) 267-9565 */
  display: string;
  /** Formato E.164 para `tel:` y schema: +17372679565 */
  e164: string;
};

export const site = {
  name: "DHC Woodcraft & Installation",
  shortName: "DHC Woodcraft",
  legalName: null as string | null, // TODO(confirmar) A2
  slogan: "Custom Build • Install • Remodel",
  /** Wordmark provisional hasta tener el logo en vector (docs/03 → Logo, H3). */
  wordmark: { mark: "DHC", sub: "Woodcraft & Installation" },
  url: "https://dhc.psalazar.dev", // dominio inicial (docs/01 → Decisiones)

  /** Muestra la franja "Vista previa". Pasar a false en T26. */
  demoMode: true,

  phones: {
    en: { display: "(737) 267-9565", e164: "+17372679565" },
    es: { display: "(737) 400-1540", e164: "+17374001540" },
  } satisfies Record<"en" | "es", Phone>,

  email: null as string | null, // TODO(confirmar) B3
  whatsapp: null as Phone | null, // TODO(confirmar) B2

  address: {
    street: null as string | null, // TODO(confirmar) B4 (¿se publica?)
    postalCode: null as string | null, // TODO(confirmar) B4
    city: "Austin",
    region: "TX",
    country: "US",
  },

  hours: null as string | null, // TODO(confirmar) B5

  /** Servicios que se muestran, en este orden. */
  services: [...serviceIds] as ServiceId[], // TODO(confirmar) C1–C3

  areas: {
    /** Zonas en color en el mapa y en la lista. */
    served: [
      "Austin",
      "Cedar Park",
      "Round Rock",
      "Georgetown",
      "Pflugerville",
      "Leander",
      "Lakeway",
      "Bee Cave",
      "West Lake Hills",
      "Dripping Springs",
      "Buda",
      "Kyle",
      "Manor",
      "Hutto",
    ], // TODO(confirmar) F1
    /** Zonas en gris ("consúltanos"). */
    askUs: [
      "Jarrell",
      "Liberty Hill",
      "Lago Vista",
      "Wimberley",
      "San Marcos",
      "Taylor",
    ], // TODO(confirmar) F1
  },

  /** Perfiles públicos (schema `sameAs`, footer). */
  social: {
    googleBusiness: null as string | null, // TODO(confirmar) G1
    facebook: null as string | null, // TODO(confirmar) G2
    instagram: null as string | null, // TODO(confirmar) G2
  },

  /**
   * Cifras de confianza. Solo con datos reales; si es null, la sección de
   * estadísticas no se muestra.
   */
  stats: null as null | {
    years?: number; // TODO(confirmar) A3
    projects?: number; // TODO(confirmar) E3
    googleRating?: number; // TODO(confirmar) G1
    warrantyYears?: number; // TODO(confirmar) D7
  },

  /**
   * Afirmaciones que dependen del dueño. Con `true` se muestran los textos que
   * las mencionan. Los valores actuales son supuestos de la maqueta.
   */
  claims: {
    freeEstimate: true, // TODO(confirmar) D1
    writtenQuotes: true, // TODO(confirmar) D2
    sameCrew: true, // TODO(confirmar) D3
    cleanJobSites: true, // TODO(confirmar) D4
    inHouseFabrication: true, // TODO(confirmar) C5
    smallJobs: true, // TODO(confirmar) C9
    insured: false, // TODO(confirmar) E1
    warranty: false, // TODO(confirmar) D7
    textMessages: true, // TODO(confirmar) J4 (¿responden por SMS?)
    oneBusinessDayReply: true, // TODO(confirmar) B6
  },
};

export type Site = typeof site;
