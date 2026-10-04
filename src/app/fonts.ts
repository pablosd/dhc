import localFont from "next/font/local";

// Tipografía (docs/03 → Tipografía): 2 archivos, subconjunto latino
// (incluye á é í ó ú ñ ü ¿ ¡). Licencias SIL OFL en fonts/OFL-*.txt.

// Títulos (H1–H3), números y wordmark.
export const displayFont = localFont({
  src: "./fonts/barlow-condensed-700.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

// Texto, eyebrows, botones y etiquetas: Inter variable (un archivo, todos los pesos).
export const bodyFont = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-body-face",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
