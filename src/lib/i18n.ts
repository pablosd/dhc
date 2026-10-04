// Idiomas del sitio (ver docs/02-arquitectura.md → Internacionalización).
// Diccionarios y fill(): T03.

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
