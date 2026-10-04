import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type ClaimKey = keyof typeof site.claims;

// Afirmación del dueño que respalda cada pregunta (docs/04 §10).
const faqClaims: Partial<Record<string, ClaimKey>> = {
  estimates: "freeEstimate",
  fabrication: "inHouseFabrication",
  insured: "insured",
  warranty: "warranty",
};

// Preguntas publicables: con respuesta escrita y con su afirmación confirmada.
// Las usan la sección FAQ y el JSON-LD FAQPage (deben coincidir exactamente).
export function getFaqItems(lang: Locale) {
  const t = filler(lang);
  return getDictionary(lang)
    .faq.items.filter((item) => {
      const claim = faqClaims[item.id];
      return item.answer !== "" && (!claim || site.claims[claim]);
    })
    .map((item) => ({ id: item.id, question: item.question, answer: t(item.answer) }));
}
