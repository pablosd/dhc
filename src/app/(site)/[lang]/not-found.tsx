import { lang } from "next/root-params";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { defaultLocale, hasLocale } from "@/lib/i18n";

// Para notFound() dentro de [lang] (docs/02 → Páginas 404).
export default async function NotFound() {
  const value = await lang();
  return (
    <main id="main" className="not-found-page surface-dark">
      <NotFoundContent lang={hasLocale(value) ? value : defaultLocale} />
    </main>
  );
}
