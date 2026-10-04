import { Carousel } from "@/components/client/Carousel";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Reseñas (docs/04 §8). Mientras site.demoMode: reseñas de ejemplo, marcadas
// como tales. En producción: solo reseñas reales con permiso (G3) o el enlace
// a Google (G1); si no hay ninguna de las dos cosas, la sección no se muestra.
export function Reviews({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const r = dict.reviews;
  const showSamples = site.demoMode;
  const google = site.social.googleBusiness;
  if (!showSamples && !google) return null;

  return (
    <section id={dict.anchors.reviews} className="section bg-paper" aria-labelledby="reviews-title">
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <SectionHeading
          id="reviews-title"
          eyebrow={r.eyebrow}
          title={r.title}
          lead={showSamples ? r.sampleNotice : undefined}
          className="section-head"
        />

        {showSamples ? (
          <Carousel
            label={r.title}
            interval={6000}
            labels={{
              carousel: dict.a11y.carousel,
              prev: dict.a11y.prev,
              next: dict.a11y.next,
              pause: dict.a11y.pause,
              resume: dict.a11y.resume,
              goTo: dict.a11y.goTo,
            }}
          >
            {r.items.map((item, i) => (
              <div
                key={item.project}
                className="review-card"
                role="group"
                aria-roledescription={dict.a11y.slide}
                aria-label={t(dict.a11y.slideOf, { n: i + 1, total: r.items.length })}
              >
                <span className="review-badge">{dict.sample.review}</span>
                <span className="review-stars" aria-hidden="true">
                  ★★★★★
                </span>
                <blockquote>
                  <p>{item.quote}</p>
                </blockquote>
                <p className="review-who">
                  {r.sampleName} · {r.sampleArea} · {item.project}
                </p>
              </div>
            ))}
          </Carousel>
        ) : null}

        {google ? (
          <p className="mt-8">
            <Button href={google} variant="ghost" icon="star" target="_blank" rel="noopener">
              {r.readOnGoogle}
            </Button>
          </p>
        ) : null}
      </div>
    </section>
  );
}
