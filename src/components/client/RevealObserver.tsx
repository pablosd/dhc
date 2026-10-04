"use client";

import { useEffect } from "react";

// Un único IntersectionObserver para toda la página (docs/02 → Componentes
// cliente). Añade .is-visible a los [data-reveal] al entrar en pantalla y anima
// los contadores [data-count] (el número final ya está en el HTML).
export function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-count]");

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-visible");
      if (el.dataset.count !== undefined && !reduce) countUp(el);
    };

    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const decimals = (el.dataset.count!.split(".")[1] ?? "").length;
  const duration = 1200;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
