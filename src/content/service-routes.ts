import type { ServiceId } from "./site";

// Rutas de las páginas por servicio (fase 1.5, docs/05 §8). Slugs traducidos:
// /en/services/<slug>/ ↔ /es/servicios/<slug>/.

export const serviceSection = { en: "services", es: "servicios" } as const;

export const serviceSlugs: Record<ServiceId, { en: string; es: string }> = {
  cabinets: { en: "custom-cabinets", es: "gabinetes-a-medida" },
  kitchens: { en: "kitchen-remodeling", es: "remodelacion-de-cocinas" },
  ceilings: { en: "wood-ceilings-beams", es: "techos-y-vigas-de-madera" },
  trim: { en: "trim-molding", es: "molduras-y-acabados" },
  doors: { en: "door-installation", es: "instalacion-de-puertas" },
  decks: { en: "decks-patios", es: "decks-y-terrazas" },
  framing: { en: "framing", es: "framing" },
  general: { en: "general-carpentry", es: "carpinteria-general" },
};
