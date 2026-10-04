import { notFound } from "next/navigation";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import "../../globals.css";

// Solo existen las rutas generadas aquí: /en/ y /es/.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={htmlLang[lang]}>
      <body>{children}</body>
    </html>
  );
}
