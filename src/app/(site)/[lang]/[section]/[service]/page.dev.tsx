// Página de un servicio (fase 1.5, T27–T28). SOLO EN DESARROLLO mientras no
// haya ninguna publicada: el export estático no admite una ruta sin páginas.
// Para publicar, ver README.md en esta carpeta.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { ServicePage } from "@/components/sections/ServicePage";
import { serviceSection, serviceSlugs } from "@/content/service-routes";
import { servicePages } from "@/content/service-pages";
import { serviceIds, site } from "@/content/site";
import { filler, hasLocale, type Locale } from "@/lib/i18n";
import { jsonLd, serviceGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { serviceFromSlug, servicePaths } from "@/lib/services";

export const dynamicParams = false;

const isProd = process.env.NODE_ENV === "production";

// En producción: solo los servicios de site.servicePages con contenido final.
// En desarrollo: todos los que tengan contenido (también borradores).
export function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const ids = (isProd ? site.servicePages : serviceIds).filter((id) => {
    const content = servicePages[lang]?.[id];
    return content && (!isProd || !content.draft);
  });
  return ids.map((id) => ({ section: serviceSection[lang], service: serviceSlugs[id][lang] }));
}

type Params = { params: Promise<{ lang: string; section: string; service: string }> };

async function resolve({ params }: Params) {
  const { lang, section, service } = await params;
  if (!hasLocale(lang) || section !== serviceSection[lang]) return null;
  const id = serviceFromSlug(lang, service);
  const content = id ? servicePages[lang][id] : undefined;
  return id && content ? { lang, id, content } : null;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const r = await resolve(props);
  if (!r) return {};
  const t = filler(r.lang);
  const meta = pageMetadata(r.lang, servicePaths(r.id), { title: r.content.metaTitle, description: t(r.content.metaDescription) });
  return r.content.draft ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function ServiceRoute(props: Params) {
  const r = await resolve(props);
  if (!r) notFound();
  const other: Locale = r.lang === "en" ? "es" : "en";
  return (
    <SiteShell lang={r.lang} alternateHref={servicePaths(r.id)[other]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceGraph(r.lang, r.id, r.content)) }} />
      <ServicePage lang={r.lang} id={r.id} content={r.content} />
    </SiteShell>
  );
}
