// Guía visual de tokens, tipografía y componentes. SOLO EN DESARROLLO: la
// extensión .dev.tsx solo cuenta en `next dev` (pageExtensions en
// next.config.ts), así que el build de producción no la genera (decisión de Pablo: se conserva para uso
// futuro). noindex, fuera del sitemap. Única página exenta de la regla
// "todo el texto sale de los diccionarios" (CLAUDE.md, regla 3).
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, iconNames } from "@/components/ui/Icon";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import images from "@/content/images.json";
import { Marquee } from "@/components/ui/Marquee";
import { Carousel } from "@/components/client/Carousel";
import { filler } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Styleguide · DHC",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "ink", hex: "#141210", use: "Texto principal, fondos oscuros" },
  { name: "ink-soft", hex: "#2A2622", use: "Footer, superficies oscuras secundarias" },
  { name: "walnut", hex: "#7A3E1D", use: "Marca: botones, enlaces, acentos" },
  { name: "walnut-deep", hex: "#4E2512", use: "Hover de botones" },
  { name: "oak", hex: "#B8692F", use: "Iconos, bordes, decoración" },
  { name: "glow", hex: "#F2B66D", use: "Luz cálida sobre oscuro" },
  { name: "cream", hex: "#F7F1E8", use: "Fondo principal" },
  { name: "paper", hex: "#FFFFFF", use: "Tarjetas" },
  { name: "stone", hex: "#A39B91", use: "Texto secundario sobre oscuro" },
  { name: "line", hex: "#E4DACB", use: "Bordes sobre claro" },
  { name: "muted", hex: "#5E554C", use: "Texto secundario sobre claro" },
];

const contrast = [
  ["walnut sobre cream", "7.4", "Texto y enlaces"],
  ["blanco sobre walnut", "8.3", "Botones"],
  ["muted sobre cream", "6.5", "Texto secundario"],
  ["stone sobre ink / ink-soft", "6.8 / 5.5", "Texto secundario sobre oscuro"],
  ["glow sobre ink", "10.4", "Acentos sobre oscuro"],
  ["oak sobre cream", "3.7", "Solo texto ≥ 24 px o decoración"],
];

const firstPhoto = Object.keys(images)[0];

const sample =
  "Gabinetes de cocina, baño y clóset hechos a la medida e instalados con precisión. Te visitamos, escuchamos lo que quieres y tomamos medidas precisas: ¿cocina nueva, techo de madera o molduras? Respondemos en inglés y español.";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

// Parámetros tipados a mano: en producción la ruta no existe y no hay
// PageProps<"/[lang]/styleguide"> generado.
export default async function StyleguidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = filler(lang);

  return (
    <main id="main" className="mx-auto grid max-w-site gap-16 px-5 py-12 md:px-8">
      <header className="grid gap-3">
        <p className="eyebrow">Temporal · T05</p>
        <h1>Styleguide</h1>
        <p className="lead">Tokens, tipografía y botones del sistema de diseño (docs/03). Pulsa Tab para ver el foco y el enlace “Saltar al contenido”.</p>
      </header>

      <section aria-labelledby="sg-colors" className="grid gap-6">
        <h2 id="sg-colors">Colores</h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {colors.map((c) => (
            <li key={c.name} className="overflow-hidden rounded border border-line bg-paper">
              <div className="h-20" style={{ background: c.hex }} />
              <div className="grid gap-1 p-3 text-sm">
                <b>--{c.name}</b>
                <code>{c.hex}</code>
                <span className="text-muted">{c.use}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line"><th className="py-2">Combinación</th><th>Ratio</th><th>Uso</th></tr>
            </thead>
            <tbody>
              {contrast.map(([a, b, c]) => (
                <tr key={a} className="border-b border-line"><td className="py-2">{a}</td><td className="tabular-nums">{b}</td><td>{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sg-type" className="grid gap-6">
        <h2 id="sg-type">Tipografía</h2>
        <div className="surface-dark grid gap-5 rounded p-8">
          <p className="eyebrow">{dict.hero.eyebrow}</p>
          <p className="font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1.02] uppercase">
            {dict.hero.titleStart} <span className="text-glow">{dict.hero.titleAccent}</span>
          </p>
          <p className="lead">{dict.hero.lead}</p>
        </div>
        <div className="grid gap-4">
          <p className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] uppercase">H2 · {dict.services.title}</p>
          <p className="font-display text-2xl font-bold">H3 · {dict.services.items.cabinets.title}</p>
          <p className="eyebrow">Eyebrow · {dict.services.eyebrow}</p>
          <p className="lead">Lead · {dict.services.lead}</p>
          <p className="max-w-[65ch]">Texto · {sample}</p>
          <p className="text-sm text-muted">Pequeño · {dict.estimate.form.consent}</p>
        </div>
      </section>


      <section aria-labelledby="sg-buttons" className="grid gap-6">
        <h2 id="sg-buttons">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <a href="#sg-buttons" className="btn btn-primary">{dict.hero.ctaEstimate}</a>
          <a href="#sg-buttons" className="btn btn-ghost">{dict.services.learnMore}</a>
        </div>
        <div className="surface-dark flex flex-wrap gap-3 rounded p-8">
          <a href="#sg-buttons" className="btn btn-primary">{dict.hero.ctaEstimate}</a>
          <a href="#sg-buttons" className="btn btn-light"><PhoneIcon />{dict.mobileBar.call}</a>
        </div>
      </section>

      <section aria-labelledby="sg-components" className="grid gap-10">
        <h2 id="sg-components">Componentes (T06)</h2>

        <div className="grid gap-4">
          <p className="eyebrow">Icon · {iconNames.length} iconos</p>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
            {iconNames.map((n) => (
              <li key={n} className="grid justify-items-center gap-2 rounded border border-line bg-paper p-4 text-xs text-muted">
                <Icon name={n} size={36} className="text-oak" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 rounded border border-line bg-paper p-6">
          <p className="eyebrow">SectionHeading</p>
          <SectionHeading id="sg-heading-demo" eyebrow={dict.services.eyebrow} title={dict.services.title} lead={dict.services.lead} />
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">Button</p>
          <div className="flex flex-wrap gap-3">
            <Button href="#sg-components">{dict.hero.ctaEstimate}</Button>
            <Button href="#sg-components" variant="ghost" icon="arrowRight">{dict.services.learnMore}</Button>
            <Button onClick={undefined}>{"<button>"}</Button>
          </div>
          <div className="surface-dark flex flex-wrap gap-3 rounded p-6">
            <Button href="#sg-components">{dict.hero.ctaEstimate}</Button>
            <Button href="#sg-components" variant="light" icon="phone">{dict.mobileBar.call}</Button>
          </div>
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">GlassCard</p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded p-8" style={{ background: "radial-gradient(60% 70% at 70% 20%, rgba(242,182,109,.35), transparent 60%), linear-gradient(120deg,#4E2512,#141210)" }}>
              <GlassCard className="grid gap-3 p-6">
                <p className="eyebrow">variant=&quot;dark&quot;</p>
                <h3>{dict.process.steps[0].title}</h3>
                <p className="lead">{dict.process.steps[0].text}</p>
              </GlassCard>
            </div>
            <div className="relative overflow-hidden rounded bg-[#EFE5D5] p-8">
              <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3">
                <span className="bg-[#7A3E1D]" /><span className="bg-[#C98B4F]" /><span className="bg-[#DCD0BE]" />
              </div>
              <GlassCard variant="map" className="relative grid gap-3 p-6">
                <p className="eyebrow">variant=&quot;map&quot;</p>
                <h3>{dict.areas.title}</h3>
                <p className="lead">{dict.areas.lead}</p>
              </GlassCard>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">PhotoPlaceholder · sin foto y con foto (Photo + srcset)</p>
          <div className="grid gap-6 md:grid-cols-2">
            <PhotoPlaceholder icon="cabinet" label={dict.sample.photo} />
            {firstPhoto ? (
              <PhotoPlaceholder icon="cabinet" label={dict.sample.photo} photo={{ name: firstPhoto, alt: "Primera foto del manifiesto", sizes: "(min-width: 768px) 50vw, 100vw" }} />
            ) : (
              <p className="text-sm text-muted">Sin fotos todavía: cuando haya fotos reales (scripts/optimize-images.mjs), aquí se verá la primera con su srcset.</p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="sg-motion" className="grid gap-10">
        <h2 id="sg-motion">Animaciones (T07)</h2>

        <div className="grid gap-4">
          <p className="eyebrow">Marquee · pausa con hover, foco o el interruptor</p>
          <Marquee items={dict.marquee} pauseLabel={dict.a11y.marqueePause} />
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">Reveal · up / fade / scale con --delay</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["up", "fade", "scale"] as const).map((v, i) => (
              <div key={v} data-reveal={v} style={{ ["--delay" as string]: `${i * 0.08}s` }} className="rounded border border-line bg-paper p-6">
                data-reveal=&quot;{v}&quot;
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">Contador · data-count</p>
          <p className="font-display text-6xl font-bold text-walnut"><span data-count="25">25</span>+</p>
        </div>

        <div className="grid gap-4">
          <p className="eyebrow">Carousel · 5 diapositivas de ejemplo</p>
          <Carousel
            label={dict.reviews.title}
            interval={4000}
            labels={{ carousel: dict.a11y.carousel, prev: dict.a11y.prev, next: dict.a11y.next, pause: dict.a11y.pause, resume: dict.a11y.resume, goTo: dict.a11y.goTo }}
          >
            {dict.reviews.items.map((r, i) => (
              <article key={r.project} role="group" aria-roledescription={dict.a11y.slide} aria-label={t(dict.a11y.slideOf, { n: i + 1, total: dict.reviews.items.length })} className="grid h-full gap-3 rounded border border-line bg-paper p-6">
                <span className="eyebrow">{dict.sample.review}</span>
                <q>{r.quote}</q>
                <span className="text-sm text-muted">{dict.reviews.sampleName} · {r.project}</span>
              </article>
            ))}
          </Carousel>
        </div>
      </section>
    </main>
  );
}
