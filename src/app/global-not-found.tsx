import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { site } from "@/content/site";
import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

// 404 global bilingüe → /404.html (docs/02 → Páginas 404). Experimental en
// Next 16 (experimental.globalNotFound): no pasa por ningún layout, por eso
// importa sus propios estilos y fuentes.
export const metadata: Metadata = {
  title: `404 · ${site.name}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-US" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-ink">
        <main id="main" className="not-found-page surface-dark min-h-svh">
          <NotFoundContent lang="en" />
          <NotFoundContent lang="es" headingLevel={2} />
        </main>
      </body>
    </html>
  );
}
