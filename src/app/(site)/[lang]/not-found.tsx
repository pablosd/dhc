import { lang } from "next/root-params";
import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { defaultLocale, hasLocale } from "@/lib/i18n";

// Para notFound() dentro de [lang] (docs/02 → Páginas 404).
export default async function NotFound() {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  return (
    <SiteShell lang={locale}>
      <main id="main" className="not-found-page surface-dark">
        <NotFoundContent lang={locale} />
      </main>
    </SiteShell>
  );
}
