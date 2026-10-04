import { ScrollStory } from "@/components/client/ScrollStory";
import { GlassCard } from "@/components/ui/GlassCard";
import { KitchenStorySvg } from "@/components/ui/KitchenStorySvg";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Proceso: la cocina que se arma (docs/03 → Firma, docs/04 §6). El escenario
// queda fijo (sticky) y los paneles de vidrio pasan por encima.
export function Process({ lang }: Props) {
  const dict = getDictionary(lang);
  const p = dict.process;
  const id = dict.anchors.process;
  const captions = p.steps.map((s) => s.caption);

  return (
    <section id={id} className="story surface-dark" aria-labelledby="process-title">
      <div className="story-stage" data-story-stage aria-hidden="true">
        <KitchenStorySvg planLabel={p.planLabel} />
        <div className="story-hud">
          <span className="story-hud-label" data-hud-label>
            {p.stepIndicator.replace("{n}", String(p.steps.length))}
          </span>
          <span className="story-hud-bar" data-hud-bar>
            <i />
          </span>
          <span className="story-hud-caption" data-hud-caption>
            {captions[captions.length - 1]}
          </span>
        </div>
      </div>

      <ol className="story-steps" data-story-steps>
        <li className="story-panel story-intro">
          <div className="mx-auto w-full max-w-site px-5 md:px-8">
            <GlassCard className="story-card">
              <p className="eyebrow">{p.eyebrow}</p>
              <h2 id="process-title">{p.title}</h2>
              <p className="story-text">{p.intro}</p>
            </GlassCard>
          </div>
        </li>
        {p.steps.map((step, i) => (
          <li key={step.title} className={`story-panel ${i % 2 === 0 ? "story-panel-end" : ""}`}>
            <div className="mx-auto w-full max-w-site px-5 md:px-8">
              <GlassCard className="story-card">
                <span className="story-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p className="story-text">{step.text}</p>
              </GlassCard>
            </div>
          </li>
        ))}
      </ol>

      <ScrollStory sectionId={id} indicator={p.stepIndicator} captions={captions} />
    </section>
  );
}
