import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Marquee } from "@/components/ui/Marquee";
import { getDictionary, hasLocale } from "@/lib/i18n";

// La landing: compone las secciones en el orden de docs/04.
export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <main id="main">
      <Hero lang={lang} />
      <Marquee items={dict.marquee} pauseLabel={dict.a11y.marqueePause} />
      <Services lang={lang} />
    </main>
  );
}
