import type { ReactNode } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { DemoBanner } from "./DemoBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileCtaBar } from "./MobileCtaBar";

type Props = {
  lang: Locale;
  /** Página equivalente en el otro idioma (selector de idioma). Por defecto, su landing. */
  alternateHref?: string;
  children: ReactNode;
};

// Estructura común de las páginas del sitio: franja de vista previa, header,
// contenido, footer y barra móvil. Va en cada página (no en el layout) para que
// el selector de idioma apunte a la página equivalente.
export function SiteShell({ lang, alternateHref, children }: Props) {
  const dict = getDictionary(lang);
  const other: Locale = lang === "en" ? "es" : "en";
  const alt = alternateHref ?? `/${other}/`;
  return (
    <>
      <DemoBanner text={dict.demoBanner} label={dict.demoBannerLabel} />
      <Header lang={lang} alternateHref={alt} />
      {children}
      <Footer lang={lang} alternateHref={alt} />
      <MobileCtaBar lang={lang} />
    </>
  );
}
