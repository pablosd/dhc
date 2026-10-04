import { notFound } from "next/navigation";
import { RevealObserver } from "@/components/client/RevealObserver";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
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
    <html
      lang={htmlLang[lang]}
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Marca .js antes de pintar: las animaciones solo ocultan contenido con JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <SkipLink label={dict.a11y.skipLink} />
        <DemoBanner text={dict.demoBanner} />
        <Header lang={lang} />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
