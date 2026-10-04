import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  /** En la 404 global se muestran los dos idiomas: solo el primero lleva H1. */
  headingLevel?: 1 | 2;
};

// Contenido de las páginas 404 (docs/04 → Página 404).
export function NotFoundContent({ lang, headingLevel = 1 }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const n = dict.notFound;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="not-found" lang={lang === "en" ? "en-US" : "es-US"}>
      <Heading>{n.title}</Heading>
      <p className="lead">{n.text}</p>
      <div className="not-found-actions">
        <Button href={`/${lang}/`}>{n.home}</Button>
        <Button href={`tel:${site.phones[lang].e164}`} variant="light" icon="phone" data-umami-event={`click_call_${lang}`}>
          {t(n.call)}
        </Button>
      </div>
    </div>
  );
}
