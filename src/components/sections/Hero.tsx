import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { KitchenSvg } from "@/components/ui/KitchenSvg";
import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Hero (docs/04 §2): fondo (foto real cuando la haya; mientras, ilustración),
// H1 con acento en glow, CTA de estimado y de llamada, y tarjeta de vidrio con
// las dos líneas (la del idioma de la página primero).
export function Hero({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const h = dict.hero;
  const estimateHref = `#${dict.anchors.estimate}`;
  const lines = (lang === "en" ? (["en", "es"] as const) : (["es", "en"] as const)).map((l) => ({
    lang: l,
    label: l === "en" ? h.card.lineEn : h.card.lineEs,
    phone: site.phones[l],
  }));

  const trust = [
    site.claims.freeEstimate ? h.trust.freeEstimates : null,
    h.trust.bilingual,
    site.claims.insured ? h.trust.insured : null,
  ].filter((x): x is string => x !== null);

  return (
    <section id="top" className="hero surface-dark" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <KitchenSvg mode="after" id="hero-kitchen" />
      </div>
      <div className="hero-grid mx-auto w-full max-w-site px-5 md:px-8">
        <div className="hero-anim">
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 id="hero-title">
            {h.titleStart} <span className="text-glow">{h.titleAccent}</span>
          </h1>
          <p className="lead hero-lead">{h.lead}</p>
          <div className="hero-ctas">
            <Button href={estimateHref} data-umami-event="click_estimate_cta">
              {h.ctaEstimate}
            </Button>
            <Button href={`tel:${site.phones[lang].e164}`} variant="light" icon="phone" data-umami-event={`click_call_${lang}`}>
              {t(h.ctaCall)}
            </Button>
          </div>
          <ul className="hero-trust">
            {trust.map((item) => (
              <li key={item}>
                <Icon name="check" size={18} className="text-glow" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <GlassCard className="hero-card hero-anim">
          {lines.map((line) => (
            <div key={line.lang} className="hero-card-row">
              <span className="hero-card-label">{line.label}</span>
              <a
                href={`tel:${line.phone.e164}`}
                className="hero-card-phone"
                aria-label={t(line.lang === "en" ? dict.a11y.callEn : dict.a11y.callEs)}
                data-umami-event={`click_call_${line.lang}`}
              >
                {line.phone.display}
              </a>
            </div>
          ))}
          <Button href={estimateHref} data-umami-event="click_estimate_cta">
            {h.card.cta}
          </Button>
        </GlassCard>
      </div>
    </section>
  );
}
