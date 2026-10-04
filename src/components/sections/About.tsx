import { Icon } from "@/components/ui/Icon";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { ZigZag } from "@/components/ui/ZigZag";
import { site } from "@/content/site";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

type ClaimKey = keyof typeof site.claims;

// Qué afirmación del dueño respalda cada punto (null = siempre es cierto).
const pointClaims: (ClaimKey | null)[][] = [
  ["writtenQuotes", "cleanJobSites"],
  ["inHouseFabrication", null],
];

// Por qué DHC (docs/04 §5): dos bloques ZigZag y, solo con cifras reales,
// estadísticas con contador animado.
export function About({ lang }: Props) {
  const dict = getDictionary(lang);
  const a = dict.about;
  const media = [
    <PhotoPlaceholder key="m0" icon="cabinet" label={dict.sample.photo} />,
    <PhotoPlaceholder key="m1" icon="framing" label={dict.sample.photo} />,
  ];

  const stats = site.stats
    ? [
        { value: site.stats.years, label: a.stats.years, suffix: "+" },
        { value: site.stats.projects, label: a.stats.projects, suffix: "+" },
        { value: site.stats.googleRating, label: a.stats.rating, suffix: "★" },
        { value: site.stats.warrantyYears, label: a.stats.warranty, suffix: "" },
      ].filter((s): s is { value: number; label: string; suffix: string } => typeof s.value === "number")
    : [];

  return (
    <section id={dict.anchors.about} className="section bg-paper" aria-labelledby="about-title">
      <div className="mx-auto grid w-full max-w-site gap-[clamp(48px,6vw,88px)] px-5 md:px-8">
        <div className="grid gap-3.5">
          <p className="eyebrow">{a.eyebrow}</p>
          <h2 id="about-title">{a.title}</h2>
        </div>

        {a.blocks.map((block, i) => {
          const showLead = block.lead && (i !== 0 || site.claims.sameCrew);
          const points = block.points.filter((_, j) => {
            const claim = pointClaims[i]?.[j];
            return claim ? site.claims[claim] : true;
          });
          return (
            <ZigZag key={block.title} media={media[i]} reverse={i % 2 === 1}>
              <h3>{block.title}</h3>
              {showLead ? <p className="lead">{block.lead}</p> : null}
              <ul className="check-list">
                {points.map((point) => (
                  <li key={point.title}>
                    <Icon name="check" size={20} className="text-oak" />
                    <span>
                      <strong>{point.title}.</strong> {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </ZigZag>
          );
        })}

        {stats.length > 0 ? (
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
