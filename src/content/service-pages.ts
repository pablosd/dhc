// Contenido de las páginas por servicio (fase 1.5, docs/04 → Fase 1.5).
// Uno por servicio e idioma. Se redacta en T29 con las respuestas del
// cuestionario (C, C10, D5, K2) y fotos reales (H1). Una página solo se publica
// si su servicio está en site.servicePages (y no es `draft`).
//
// Regla: nada inventado. Mientras falte un dato, el texto lleva
// "[Pendiente T29 …]" y la página es `draft` (solo se ve en desarrollo).
import type { Locale } from "@/lib/i18n";
import type { ServiceId } from "./site";

export type ServicePageContent = {
  /** Borrador: solo en desarrollo, con franja visible y noindex. */
  draft?: boolean;
  /** ≤ 60 caracteres. */
  metaTitle: string;
  /** ≤ 155 caracteres; puede usar {phone}. */
  metaDescription: string;
  /** Servicio + ciudad (docs/05 §8). */
  h1: string;
  intro: string[];
  includes: string[];
  materials: string[];
  /** Plazos típicos (D5). */
  timeline?: string;
  faqs: { question: string; answer: string }[];
  /** Fotos reales (nombres de src/content/images.json). */
  photos: { name: string; alt: string }[];
  /** Servicios relacionados (2–3). */
  related: ServiceId[];
};

export const servicePages: Record<Locale, Partial<Record<ServiceId, ServicePageContent>>> = {
  en: {
    cabinets: {
      draft: true,
      metaTitle: "Custom Cabinets in Austin, TX | DHC Woodcraft",
      metaDescription:
        "Custom kitchen, bath and closet cabinets and built-ins, made to measure and installed in Austin, TX. Call {phone}.",
      h1: "Custom Cabinets & Built-ins in Austin, TX",
      intro: [
        "Kitchen, bath and closet cabinets, vanities and built-ins made to measure and installed with precision.",
        "[Pendiente T29: workshop, process and what makes DHC cabinets different (C5, C6, C10)]",
      ],
      includes: ["Made to measure", "Shaker, flat & inset", "Refacing & installs", "[Pendiente T29: C1, C10]"],
      materials: ["[Pendiente T29: woods, finishes and hardware (C10)]"],
      timeline: "[Pendiente T29: typical timeline (D5)]",
      faqs: [{ question: "[Pendiente T29: FAQ (K2)]", answer: "[Pendiente T29]" }],
      photos: [],
      related: ["kitchens", "trim", "general"],
    },
  },
  es: {
    cabinets: {
      draft: true,
      metaTitle: "Gabinetes a Medida en Austin, TX | DHC Woodcraft",
      metaDescription:
        "Gabinetes de cocina, baño y clóset y empotrados hechos a la medida e instalados en Austin, TX. Llama al {phone}.",
      h1: "Gabinetes a medida y empotrados en Austin, TX",
      intro: [
        "Gabinetes de cocina, baño y clóset, muebles de baño y empotrados hechos a la medida e instalados con precisión.",
        "[Pendiente T29: taller, proceso y qué hace distintos los gabinetes de DHC (C5, C6, C10)]",
      ],
      includes: ["Hechos a la medida", "Estilo shaker, liso o inset", "Renovación e instalación", "[Pendiente T29: C1, C10]"],
      materials: ["[Pendiente T29: maderas, acabados y herrajes (C10)]"],
      timeline: "[Pendiente T29: plazos típicos (D5)]",
      faqs: [{ question: "[Pendiente T29: preguntas frecuentes (K2)]", answer: "[Pendiente T29]" }],
      photos: [],
      related: ["kitchens", "trim", "general"],
    },
  },
};
