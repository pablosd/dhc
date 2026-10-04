import { site } from "@/content/site";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Barra fija inferior solo en móvil (docs/03): [Llamar] [Estimado gratis].
// La llamada usa la línea del idioma de la página.
export function MobileCtaBar({ lang }: Props) {
  const dict = getDictionary(lang);
  return (
    <nav className="mobile-cta-bar" aria-label={dict.nav.cta}>
      <a href={`tel:${site.phones[lang].e164}`} className="btn btn-light" data-umami-event={`click_call_${lang}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        {dict.mobileBar.call}
      </a>
      <a href={`/${lang}/#${dict.anchors.estimate}`} className="btn btn-primary" data-umami-event="click_estimate_cta">
        {dict.mobileBar.estimate}
      </a>
    </nav>
  );
}
