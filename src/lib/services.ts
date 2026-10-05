import { serviceSection, serviceSlugs } from "@/content/service-routes";
import { site, type ServiceId } from "@/content/site";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { LocalizedPaths } from "@/lib/seo";

/** Rutas de la página de un servicio en cada idioma. */
export function servicePaths(id: ServiceId): LocalizedPaths {
  return {
    en: `/en/${serviceSection.en}/${serviceSlugs[id].en}/`,
    es: `/es/${serviceSection.es}/${serviceSlugs[id].es}/`,
  };
}

export function isServicePagePublished(id: ServiceId): boolean {
  return site.servicePages.includes(id);
}

/** Enlace a un servicio: su página si está publicada; si no, su tarjeta en la landing. */
export function serviceHref(lang: Locale, id: ServiceId): string {
  return isServicePagePublished(id) ? servicePaths(id)[lang] : `/${lang}/#service-${id}`;
}

/** id del servicio a partir del slug de la URL (o null si no existe). */
export function serviceFromSlug(lang: Locale, slug: string): ServiceId | null {
  const entry = Object.entries(serviceSlugs).find(([, s]) => s[lang] === slug);
  return entry ? (entry[0] as ServiceId) : null;
}

/** Nombre corto del servicio en el idioma (para migas de pan y enlaces). */
export function serviceName(lang: Locale, id: ServiceId): string {
  return getDictionary(lang).services.items[id].title;
}
