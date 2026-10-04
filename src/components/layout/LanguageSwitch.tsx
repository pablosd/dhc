import { htmlLang, type Locale } from "@/lib/i18n";

type Props = {
  /** Idioma de destino. */
  to: Locale;
  href: string;
  /** Texto visible: "Español" / "English". */
  text: string;
  /** aria-label en el idioma de destino. */
  label: string;
  className?: string;
};

// Enlace a la página equivalente en el otro idioma (no un <select>, docs/02).
export function LanguageSwitch({ to, href, text, label, className = "" }: Props) {
  return (
    <a
      href={href}
      lang={htmlLang[to]}
      hrefLang={htmlLang[to]}
      aria-label={label}
      className={`lang-switch ${className}`}
      data-umami-event="click_language_switch"
    >
      {text}
    </a>
  );
}
