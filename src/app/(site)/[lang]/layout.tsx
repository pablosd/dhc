import { notFound } from "next/navigation";
import { SkipLink } from "@/components/layout/SkipLink";
import { getDictionary, hasLocale, htmlLang, locales } from "@/lib/i18n";
import { bodyFont, displayFont } from "../../fonts";
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
  const dict = getDictionary(lang);

  return (
    <html lang={htmlLang[lang]} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <SkipLink label={dict.a11y.skipLink} />
        {children}
      </body>
    </html>
  );
}
