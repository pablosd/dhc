import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { RevealObserver } from "@/components/client/RevealObserver";
import { Analytics } from "@/components/layout/Analytics";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/content/site";
import { getDictionary, hasLocale, htmlLang, locales } from "@/lib/i18n";
import { bodyFont, displayFont } from "../../fonts";
import "../../globals.css";

// Solo existen las rutas generadas aquí: /en/ y /es/.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Base para todas las URLs absolutas (canonical, hreflang, Open Graph).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
};

// themeColor va en viewport, no en metadata (Next 14+, docs/05 §2).
export const viewport: Viewport = {
  themeColor: "#141210",
};

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
        <DemoBanner text={dict.demoBanner} label={dict.demoBannerLabel} />
        <Header lang={lang} />
        {children}
        <Footer lang={lang} />
        <MobileCtaBar lang={lang} />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
