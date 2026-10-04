import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqItems } from "@/lib/faq";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Preguntas frecuentes (docs/04 §10): <details> nativo, la primera abierta,
// y una foto al lado en escritorio. Solo preguntas con respuesta confirmada.
export function Faq({ lang }: Props) {
  const dict = getDictionary(lang);
  const items = getFaqItems(lang);
  if (items.length === 0) return null;

  return (
    <section id={dict.anchors.faq} className="section bg-paper" aria-labelledby="faq-title">
      <div className="faq-grid mx-auto w-full max-w-site px-5 md:px-8">
        <div className="faq-side">
          <SectionHeading id="faq-title" eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
          <PhotoPlaceholder icon="kitchen" label={dict.sample.photo} className="faq-photo" />
        </div>
        <div className="faq-list">
          {items.map((item, i) => (
            <details key={item.id} open={i === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
