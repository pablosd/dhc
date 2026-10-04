import type { Metadata } from "next";
import { site } from "@/content/site";
import { filler, getDictionary, htmlLang, locales, type Locale } from "@/lib/i18n";

// Rutas equivalentes en cada idioma para una página. En la fase 1.5 las
// páginas de servicio pasarán sus slugs traducidos.
export type LocalizedPaths = Record<Locale, string>;

export const landingPaths: LocalizedPaths = { en: "/en/", es: "/es/" };

const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_US" };

/** hreflang recíprocos + x-default (→ inglés). Rutas relativas a metadataBase. */
export function languageAlternates(paths: LocalizedPaths) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = paths[l];
  languages["x-default"] = paths.en;
  return languages;
}

// Metadata completa de una página por idioma (docs/05 §2).
export function pageMetadata(lang: Locale, paths: LocalizedPaths, override?: { title?: string; description?: string }): Metadata {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const title = override?.title ?? dict.meta.title;
  const description = override?.description ?? t(dict.meta.description);
  const other: Locale = lang === "en" ? "es" : "en";
  const image = { url: `/og/og-${lang}.jpg`, width: 1200, height: 630, alt: dict.og.alt };

  return {
    title,
    description,
    alternates: {
      canonical: paths[lang],
      languages: languageAlternates(paths),
    },
    openGraph: {
      type: "website",
      url: paths[lang],
      siteName: site.name,
      title,
      description,
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[other]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    robots: { index: true, follow: true },
  };
}
