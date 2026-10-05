import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { locales } from "@/lib/i18n";
import { landingPaths, languageAlternates, type LocalizedPaths } from "@/lib/seo";
import { servicePaths } from "@/lib/services";

// Export estático: se genera una vez en el build (docs/02, docs/05 §4).
export const dynamic = "force-static";

// Páginas indexables: la landing y las páginas de servicio publicadas
// (site.servicePages). Excluidas: "/", page-not-found, styleguide y cuestionario.
const pages: LocalizedPaths[] = [landingPaths, ...site.servicePages.map(servicePaths)];

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => new URL(path, site.url).toString();
  return pages.flatMap((paths) =>
    locales.map((lang) => ({
      url: abs(paths[lang]),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(paths)).map(([k, v]) => [k, abs(v)])),
      },
    })),
  );
}
