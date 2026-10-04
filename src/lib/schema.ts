import { site } from "@/content/site";
import { getFaqItems } from "@/lib/faq";
import { getDictionary, htmlLang, type Locale } from "@/lib/i18n";

// JSON-LD (docs/05 §3). Un campo sin dato confirmado se OMITE: nunca se
// rellena con un valor de ejemplo. Sin geo, priceRange, aggregateRating ni
// review hasta tener datos reales.

type Json = Record<string, unknown>;

const tel = (e164: string) => e164.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "+1-$1-$2-$3");
const compact = (obj: Json): Json => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));

export function businessSchema(lang: Locale): Json {
  const dict = getDictionary(lang);
  const url = `${site.url}/${lang}/`;
  const sameAs = Object.values(site.social).filter((v): v is string => Boolean(v));

  return compact({
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    slogan: site.slogan,
    url,
    image: [`${site.url}/og/og-${lang}.jpg`],
    telephone: tel(site.phones[lang].e164),
    email: site.email,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    }),
    areaServed: site.areas.served.map((name) => ({ "@type": "City", name: `${name}, TX` })),
    contactPoint: (["en", "es"] as const).map((l) => ({
      "@type": "ContactPoint",
      telephone: tel(site.phones[l].e164),
      contactType: "customer service",
      availableLanguage: [l === "en" ? "English" : "Spanish"],
    })),
    knowsLanguage: ["en", "es"],
    sameAs: sameAs.length ? sameAs : null,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.title,
      itemListElement: site.services.map((id) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: dict.services.items[id].title,
          description: dict.services.items[id].text,
        },
      })),
    },
  });
}

export function websiteSchema(lang: Locale): Json {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/${lang}/`,
    inLanguage: htmlLang[lang],
    publisher: { "@id": `${site.url}/#business` },
  };
}

/** Mismas preguntas y respuestas que la sección visible (lib/faq.ts). */
export function faqSchema(lang: Locale): Json | null {
  const items = getFaqItems(lang);
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    inLanguage: htmlLang[lang],
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function landingGraph(lang: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [businessSchema(lang), websiteSchema(lang), faqSchema(lang)].filter(Boolean),
  };
}

/** Serializa para <script type="application/ld+json"> sin permitir cerrar la etiqueta. */
export function jsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
