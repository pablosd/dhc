import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { locales } from "@/lib/i18n";
import { landingPaths, languageAlternates, type LocalizedPaths } from "@/lib/seo";

// Export estático: se genera una vez en el build (docs/02, docs/05 §4).
export const dynamic = "force-static";

// Páginas indexables. Excluidas: "/", page-not-found y styleguide.
// Fase 1.5: añadir aquí las páginas de servicio con sus rutas traducidas.
const pages: LocalizedPaths[] = [landingPaths];

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
