import type { ServiceId } from "@/content/site";
import type { IconName } from "./Icon";

// Icono de línea de cada servicio (docs/04 §4).
export const serviceIcons: Record<ServiceId, IconName> = {
  cabinets: "cabinet",
  kitchens: "kitchen",
  ceilings: "beam",
  trim: "molding",
  doors: "door",
  decks: "deck",
  framing: "framing",
  general: "hammer",
};
