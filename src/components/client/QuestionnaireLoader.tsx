"use client";

import dynamic from "next/dynamic";
import type { Section } from "@/content/questionnaire";

// El cuestionario vive solo en el navegador (borrador en localStorage).
const QuestionnaireForm = dynamic(() => import("./QuestionnaireForm").then((m) => m.QuestionnaireForm), {
  ssr: false,
  loading: () => <p style={{ padding: "2rem 1rem" }}>Cargando el cuestionario…</p>,
});

export function QuestionnaireLoader({ sections }: { sections: Section[] }) {
  return <QuestionnaireForm sections={sections} />;
}
