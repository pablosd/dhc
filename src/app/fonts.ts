import localFont from "next/font/local";

// Familia Barlow (docs/03 → Tipografía): 3 archivos, subconjunto latino
// (incluye á é í ó ú ñ ü ¿ ¡). Licencia SIL OFL: fonts/OFL-Barlow.txt.

export const displayFont = localFont({
  src: "./fonts/barlow-condensed-700.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

export const bodyFont = localFont({
  src: [
    { path: "./fonts/barlow-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body-face",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// Solo para comparar en la styleguide (T05). Se borra cuando Pablo elija.
export const interFont = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  variable: "--font-inter-face",
  display: "swap",
  preload: false,
});
