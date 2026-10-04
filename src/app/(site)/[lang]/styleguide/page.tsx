// TEMPORAL (T05–T24): guía visual de tokens, tipografía y componentes.
// noindex, fuera del sitemap, se borra en T24. Única página exenta de la regla
// "todo el texto sale de los diccionarios" (CLAUDE.md, regla 3).
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { interFont } from "../../../fonts";

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

const sample =
  "Gabinetes de cocina, baño y clóset hechos a la medida e instalados con precisión. Te visitamos, escuchamos lo que quieres y tomamos medidas precisas: ¿cocina nueva, techo de madera o molduras? Respondemos en inglés y español.";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

export default async function StyleguidePage({ params }: PageProps<"/[lang]/styleguide">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

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

      <section aria-labelledby="sg-compare" className="grid gap-6">
        <h2 id="sg-compare">Texto: Barlow o Inter</h2>
        <p className="lead">Los títulos siguen en Barlow Condensed. Compara solo el texto corrido y elige una.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="grid gap-3 rounded border border-line bg-paper p-6">
            <p className="eyebrow">A · Barlow 400 / 600 (actual)</p>
            <h3>{dict.about.blocks[0].title}</h3>
            <p>{sample}</p>
            <p><b>{dict.about.blocks[0].points[0].title}.</b> {dict.about.blocks[0].points[0].text}</p>
          </article>
          <article className={`${interFont.variable} grid gap-3 rounded border border-line bg-paper p-6`} style={{ fontFamily: "var(--font-inter-face), system-ui, sans-serif" }}>
            <p className="eyebrow" style={{ fontFamily: "inherit" }}>B · Inter (variable)</p>
            <h3>{dict.about.blocks[0].title}</h3>
            <p>{sample}</p>
            <p><b>{dict.about.blocks[0].points[0].title}.</b> {dict.about.blocks[0].points[0].text}</p>
          </article>
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
    </main>
  );
}
