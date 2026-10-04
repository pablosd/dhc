"use client";

import { useEffect } from "react";

// Header transparente sobre el hero y sólido al bajar (docs/03 → Header).
// Añade .is-scrolled al header con id="site-header".
export function HeaderScroll() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return null;
}
