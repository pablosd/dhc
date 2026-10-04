"use client";

import { useEffect } from "react";

type Props = {
  /** id de la sección que contiene el escenario y los pasos. */
  sectionId: string;
  /** Plantilla con {n}: "Paso {n} de 4". */
  indicator: string;
  /** Qué se está construyendo en cada paso. */
  captions: string[];
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// Anima la cocina de KitchenStorySvg según el progreso de scroll de la sección
// (docs/03 → Firma). Un listener pasivo + requestAnimationFrame; solo toca
// transform, opacity y stroke-dashoffset. Con prefers-reduced-motion no hace
// nada: el HTML ya trae la cocina terminada.
export function ScrollStory({ sectionId, indicator, captions }: Props) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = document.getElementById(sectionId);
    const steps = section?.querySelector<HTMLElement>("[data-story-steps]");
    const stage = section?.querySelector<HTMLElement>("[data-story-stage]");
    if (!section || !steps || !stage) return;

    const anims = [...stage.querySelectorAll<SVGElement>("[data-s], [data-out]")].map((el) => {
      const out = el.dataset.out?.split(",").map(Number);
      return {
        el,
        s: el.dataset.s !== undefined ? Number(el.dataset.s) : null,
        e: el.dataset.e !== undefined ? Number(el.dataset.e) : null,
        dy: el.dataset.dy !== undefined ? Number(el.dataset.dy) : 0,
        op: el.hasAttribute("data-op"),
        draw: el.hasAttribute("data-draw"),
        out: out && out.length === 2 ? (out as [number, number]) : null,
      };
    });
    const woods = [...stage.querySelectorAll<SVGElement>(".wood")];
    const edges = [...stage.querySelectorAll<SVGElement>(".edge")];
    const label = stage.querySelector<HTMLElement>("[data-hud-label]");
    const caption = stage.querySelector<HTMLElement>("[data-hud-caption]");
    const bar = stage.querySelector<HTMLElement>("[data-hud-bar]");
    let lastStep = -1;

    const render = (p: number) => {
      for (const a of anims) {
        let opacity = 1;
        if (a.s !== null && a.e !== null) {
          const t = ease(clamp((p - a.s) / (a.e - a.s)));
          if (a.draw) {
            a.el.style.strokeDasharray = "1";
            a.el.style.strokeDashoffset = String(1 - t);
          }
          if (a.dy) a.el.setAttribute("transform", `translate(0 ${(a.dy * (1 - t)).toFixed(1)})`);
          if (a.op) opacity = t;
        }
        if (a.out) opacity *= 1 - clamp((p - a.out[0]) / (a.out[1] - a.out[0]));
        if (a.op || a.out) a.el.setAttribute("opacity", opacity.toFixed(3));
      }
      const wood = clamp((p - 0.74) / 0.12);
      for (const g of woods) g.setAttribute("fill-opacity", wood.toFixed(3));
      for (const r of edges) r.setAttribute("stroke-opacity", (1 - wood).toFixed(3));
      stage.style.setProperty("--halo", (clamp((p - 0.9) / 0.1) * 0.16).toFixed(3));

      const step = Math.min(captions.length - 1, Math.floor(p * captions.length * 1.0001));
      if (step !== lastStep) {
        lastStep = step;
        if (label) label.textContent = indicator.replace("{n}", String(step + 1));
        if (caption) caption.textContent = captions[step];
      }
      bar?.style.setProperty("--progress", `${(p * 100).toFixed(1)}%`);
    };

    const progress = () => {
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((-r.top + vh * 0.15) / (r.height - vh));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        render(progress());
      });
    };

    render(progress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionId, indicator, captions]);

  return null;
}
