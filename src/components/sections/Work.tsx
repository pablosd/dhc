import { Carousel } from "@/components/client/Carousel";
import { BeforeAfterCard } from "@/components/ui/BeforeAfterCard";
import { KitchenSvg } from "@/components/ui/KitchenSvg";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Recorte de la ilustración para cada ejemplo (mientras no haya fotos reales).
const crops = [undefined, "60 70 400 260", "180 0 440 260", "300 60 420 250", "360 200 400 250"];

// Proyectos: antes y después en carrusel (docs/04 §7). Con fotos reales, cada
// par será del mismo proyecto, con permiso del cliente (H1).
export function Work({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const w = dict.work;
  const total = w.items.length;

  return (
    <section id={dict.anchors.work} className="section bg-cream" aria-labelledby="work-title">
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <SectionHeading id="work-title" eyebrow={w.eyebrow} title={w.title} lead={w.lead} className="section-head" />
        <Carousel
          label={w.title}
          interval={5000}
          labels={{
            carousel: dict.a11y.carousel,
            prev: dict.a11y.prev,
            next: dict.a11y.next,
            pause: dict.a11y.pause,
            resume: dict.a11y.resume,
            goTo: dict.a11y.goTo,
          }}
        >
          {w.items.map((item, i) => (
            <div key={item.title} role="group" aria-roledescription={dict.a11y.slide} aria-label={t(dict.a11y.slideOf, { n: i + 1, total })}>
              <BeforeAfterCard
                id={`flip-${lang}-${i}`}
                title={item.title}
                description={item.description}
                before={<KitchenSvg mode="before" id={`ba-before-${i}`} viewBox={crops[i]} />}
                after={<KitchenSvg mode="after" id={`ba-after-${i}`} viewBox={crops[i]} />}
                labels={{ before: w.before, after: w.after, flip: t(dict.a11y.flip, { title: item.title }), sample: dict.sample.illustration }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
