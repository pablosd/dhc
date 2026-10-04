// Idiomas del sitio (ver docs/02-arquitectura.md → Internacionalización).
import en, { type Dictionary } from "@/content/en";
import es from "@/content/es";
import { site } from "@/content/site";
import { fill, type FillValues } from "@/lib/fill";

export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Valor del atributo <html lang> por idioma.
export const htmlLang: Record<Locale, string> = {
  en: "en-US",
  es: "es-US",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

// Datos del negocio disponibles como marcadores en los textos. Un dato
// pendiente (null en site.ts) no se incluye: si un texto lo pide, fill() falla.
export function businessValues(lang: Locale): FillValues {
  const values: FillValues = {
    phone: site.phones[lang].display,
    phoneEn: site.phones.en.display,
    phoneEs: site.phones.es.display,
    // Año del build: el sitio es estático, se actualiza al volver a publicar.
    year: new Date().getFullYear(),
  };
  if (site.email) values.email = site.email;
  return values;
}

// Devuelve un `t(texto, extras?)` que rellena los marcadores del idioma dado.
// Ej.: t(dict.hero.ctaCall) → "Call (737) 267-9565"
//      t(dict.a11y.slideOf, { n: 1, total: 5 }) → "1 of 5"
export function filler(lang: Locale) {
  const base = businessValues(lang);
  return (template: string, extra: FillValues = {}) =>
    fill(template, { ...base, ...extra });
}
