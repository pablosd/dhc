import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { About } from "@/components/sections/About";
import { Areas } from "@/components/sections/Areas";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Marquee } from "@/components/ui/Marquee";
import { SiteShell } from "@/components/layout/SiteShell";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { jsonLd, landingGraph } from "@/lib/schema";
import { landingPaths, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return pageMetadata(lang, landingPaths);
}

// La landing: compone las secciones en el orden de docs/04.
export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <SiteShell lang={lang}>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(landingGraph(lang)) }} />
        <Hero lang={lang} />
        <Marquee items={dict.marquee} pauseLabel={dict.a11y.marqueePause} />
        <Services lang={lang} />
        <About lang={lang} />
        <Process lang={lang} />
        <Work lang={lang} />
        <Reviews lang={lang} />
        <Areas lang={lang} />
        <Faq lang={lang} />
        <Contact lang={lang} />
      </main>
    </SiteShell>
  );
}
