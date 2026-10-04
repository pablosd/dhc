"use client";

import { useEffect } from "react";

type Props = {
  sectionId: string;
};

// Sincroniza el resaltado entre la lista de ciudades y las zonas del mapa
// (docs/03 → Mapa). Delegación de eventos: un listener por tipo.
export function AreaMapHover({ sectionId }: Props) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const toggle = (city: string | undefined, on: boolean) => {
      if (!city) return;
      section.querySelectorAll(`[data-city="${CSS.escape(city)}"]`).forEach((el) => el.classList.toggle("is-on", on));
    };
    const target = (e: Event) => (e.target as Element).closest<HTMLElement | SVGElement>("[data-city]:not(.is-ask)");
    const over = (e: Event) => toggle(target(e)?.dataset.city, true);
    const out = (e: Event) => toggle(target(e)?.dataset.city, false);
    section.addEventListener("pointerover", over);
    section.addEventListener("pointerout", out);
    return () => {
      section.removeEventListener("pointerover", over);
      section.removeEventListener("pointerout", out);
    };
  }, [sectionId]);
  return null;
}
