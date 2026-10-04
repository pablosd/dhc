import { AreaMapHover } from "@/components/client/AreaMapHover";
import { AreaMapSvg } from "@/components/ui/AreaMapSvg";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Zona de servicio (docs/04 §9): mapa de zonas de fondo y tarjeta de vidrio
// con la lista de ciudades, la leyenda y los dos CTA.
export function Areas({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const a = dict.areas;
  const id = dict.anchors.areas;
  const cities = [...site.areas.served].sort((x, y) => (x === "Austin" ? -1 : y === "Austin" ? 1 : x.localeCompare(y)));

  return (
    <section id={id} className="areas" aria-labelledby="areas-title">
      <div className="areas-map">
        <AreaMapSvg served={site.areas.served} label={a.mapLabel} scaleLabel={a.scale} />
      </div>
      <div className="areas-inner mx-auto w-full max-w-site px-5 md:px-8">
        <GlassCard variant="map" className="areas-card">
          <p className="eyebrow">{a.eyebrow}</p>
          <h2 id="areas-title">{a.title}</h2>
          <p className="lead">{a.lead}</p>
          <ul className="city-list" aria-label={dict.a11y.cityList}>
            {cities.map((city) => (
              <li key={city} data-city={city}>
                {city}
              </li>
            ))}
          </ul>
          <ul className="area-legend">
            <li>
              <i className="swatch-served" aria-hidden="true" />
              {a.legendServed}
            </li>
            <li>
              <i className="swatch-ask" aria-hidden="true" />
              {a.legendAsk}
            </li>
            <li>
              <i className="swatch-base" aria-hidden="true" />
              {a.legendBase}
            </li>
          </ul>
          <div className="areas-ctas">
            <Button href={`#${dict.anchors.estimate}`} data-umami-event="click_estimate_cta">
              {a.ctaEstimate}
            </Button>
            <Button href={`tel:${site.phones[lang].e164}`} variant="light" icon="phone" data-umami-event={`click_call_${lang}`}>
              {t(a.ctaCall)}
            </Button>
          </div>
        </GlassCard>
      </div>
      <AreaMapHover sectionId={id} />
    </section>
  );
}
