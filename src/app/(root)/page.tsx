import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary, htmlLang, locales } from "@/lib/i18n";

// "/" no se indexa: es solo la puerta a /en/ y /es/ (ver docs/02 → Redirección).
// En producción Caddy redirige antes de llegar aquí; esta página es el
// respaldo (local con `npx serve out`, o si se sirve sin Caddy).
export const metadata: Metadata = {
  title: site.name,
  robots: { index: false, follow: true },
};

// Español si el idioma preferido del navegador es es / es-XX; si no, inglés.
const redirectScript = `(function(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||"";location.replace(/^es(-|$)/i.test(l)?"/es/":"/en/");})();`;

export default function RootPage() {
  return (
    <main className="grid min-h-svh place-items-center p-6">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <ul className="grid gap-6 text-center">
        {locales.map((lang) => {
          const dict = getDictionary(lang);
          return (
            <li key={lang} lang={htmlLang[lang]}>
              <p>{dict.root.title}</p>
              <a href={`/${lang}/`} hrefLang={htmlLang[lang]} className="underline">
                {dict.root.link}
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
