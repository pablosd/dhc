import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { getDictionary, hasLocale } from "@/lib/i18n";

// 404 por idioma que sirve Caddy con estado 404 para URLs desconocidas bajo
// /en/ y /es/ (docs/02 → Páginas 404). No se indexa ni va en el sitemap.
export async function generateMetadata({ params }: PageProps<"/[lang]/page-not-found">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: true } };
}

export default async function PageNotFound({ params }: PageProps<"/[lang]/page-not-found">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <main id="main" className="not-found-page surface-dark">
      <NotFoundContent lang={lang} />
    </main>
  );
}
