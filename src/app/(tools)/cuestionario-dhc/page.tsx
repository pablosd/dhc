import type { Metadata } from "next";
import { QuestionnaireLoader } from "@/components/client/QuestionnaireLoader";
import { questionnaire } from "@/content/questionnaire";
import { site } from "@/content/site";

// Cuestionario para el dueño (docs/07), en una URL que no se enlaza ni se
// indexa. Herramienta interna en español: exenta de la regla de diccionarios.
export const metadata: Metadata = {
  title: `Cuestionario · ${site.name}`,
  robots: { index: false, follow: false },
};

export default function QuestionnairePage() {
  return <QuestionnaireLoader sections={questionnaire} />;
}
