import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { serviceIcons } from "@/components/ui/serviceIcons";
import type { ServicePageContent } from "@/content/service-pages";
import { site, type ServiceId } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";
import { serviceHref } from "@/lib/services";
import { Contact } from "./Contact";

type Props = {
  lang: Locale;
  id: ServiceId;
  content: ServicePageContent;
};

// Página de un servicio (fase 1.5, docs/04 → Fase 1.5): migas de pan → hero →
// qué incluye + materiales → cómo trabajamos → galería → preguntas →
// relacionados → formulario. El contenido viene de content/service-pages.ts.
export function ServicePage({ lang, id, content }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const sp = dict.servicePage;
  const icon = serviceIcons[id];
  const faqs = content.faqs.filter((f) => f.question && f.answer);
  const galleryPhotos = content.photos.slice(1);

  return (
    <main id="main" className="service-page">
      {content.draft ? (
        // Solo existe en desarrollo (page.dev.tsx): texto interno, no del diccionario.
        <p className="draft-banner">BORRADOR — solo en desarrollo. Contenido pendiente de T29.</p>
      ) : null}

      <section className="service-hero surface-dark" aria-labelledby="service-title">
        <div className="mx-auto w-full max-w-site px-5 md:px-8">
          <nav aria-label={dict.a11y.breadcrumb} className="breadcrumb">
            <ol>
              <li>
                <a href={`/${lang}/`}>{dict.nav.home}</a>
              </li>
              <li>
                <a href={`/${lang}/#${dict.anchors.services}`}>{dict.nav.services}</a>
              </li>
              <li aria-current="page">{dict.services.items[id].title}</li>
            </ol>
          </nav>
          <div className="service-hero-grid">
            <div className="grid gap-4">
              <p className="eyebrow">{sp.eyebrow}</p>
              <h1 id="service-title">{content.h1}</h1>
              {content.intro.map((p) => (
                <p key={p} className="lead">
                  {p}
                </p>
              ))}
              <div className="hero-ctas">
                <Button href={`#${dict.anchors.estimate}`} data-umami-event="click_estimate_cta">
                  {dict.hero.ctaEstimate}
                </Button>
                <Button href={`tel:${site.phones[lang].e164}`} variant="light" icon="phone" data-umami-event={`click_call_${lang}`}>
                  {t(dict.hero.ctaCall)}
                </Button>
              </div>
            </div>
            <PhotoPlaceholder
              icon={icon}
              label={dict.sample.photo}
              photo={content.photos[0] ? { ...content.photos[0], sizes: "(min-width: 900px) 45vw, 100vw" } : undefined}
            />
          </div>
        </div>
      </section>

      <section className="section bg-cream" aria-labelledby="includes-title">
        <div className="service-includes mx-auto w-full max-w-site px-5 md:px-8">
          <div className="grid gap-5">
            <h2 id="includes-title">{sp.includesTitle}</h2>
            <ul className="check-list">
              {content.includes.map((item) => (
                <li key={item}>
                  <Icon name="check" size={20} className="text-oak" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="service-materials">
            <h3>{sp.materialsTitle}</h3>
            <ul className="chips">
              {content.materials.map((m) => (
                <li key={m} className="chip">
                  {m}
                </li>
              ))}
            </ul>
            {content.timeline ? <p className="lead">{content.timeline}</p> : null}
          </div>
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="sp-process-title">
        <div className="mx-auto w-full max-w-site px-5 md:px-8">
          <h2 id="sp-process-title" className="section-head">
            {sp.processTitle}
          </h2>
          <ol className="service-steps">
            {dict.process.steps.map((step, i) => (
              <li key={step.title}>
                <span className="service-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-cream" aria-labelledby="gallery-title">
        <div className="mx-auto w-full max-w-site px-5 md:px-8">
          <h2 id="gallery-title" className="section-head">
            {sp.galleryTitle}
          </h2>
          <ul className="service-gallery">
            {(galleryPhotos.length ? galleryPhotos : [null, null, null]).map((photo, i) => (
              <li key={photo?.name ?? `ph-${i}`}>
                <PhotoPlaceholder
                  icon={icon}
                  label={dict.sample.photo}
                  photo={photo ? { ...photo, sizes: "(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" } : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {faqs.length ? (
        <section className="section bg-paper" aria-labelledby="sp-faq-title">
          <div className="mx-auto w-full max-w-site px-5 md:px-8">
            <h2 id="sp-faq-title" className="section-head">
              {sp.faqTitle}
            </h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details key={f.question} open={i === 0}>
                  <summary>{f.question}</summary>
                  <p>{t(f.answer)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section bg-cream" aria-labelledby="related-title">
        <div className="mx-auto w-full max-w-site px-5 md:px-8">
          <h2 id="related-title" className="section-head">
            {sp.relatedTitle}
          </h2>
          <ul className="service-grid service-grid-fit">
            {content.related.map((rid) => {
              const item = dict.services.items[rid];
              return (
                <li key={rid}>
                  <article className="service-card">
                    <Icon name={serviceIcons[rid]} size={44} className="service-icon" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <a href={serviceHref(lang, rid)} className="service-more">
                      {sp.relatedLink} →
                    </a>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Contact lang={lang} />
    </main>
  );
}
