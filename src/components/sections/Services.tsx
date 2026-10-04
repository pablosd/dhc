import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceIcons } from "@/components/ui/serviceIcons";
import { site } from "@/content/site";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Servicios (docs/04 §4): chips + una tarjeta por servicio activo en site.ts.
// En la fase 1.5 los chips y "Ver más" enlazarán a la página de cada servicio.
export function Services({ lang }: Props) {
  const dict = getDictionary(lang);
  const s = dict.services;
  const services = site.services.map((id) => {
    const item = s.items[id];
    // "Trabajos pequeños bienvenidos" solo si el dueño lo confirma (C9).
    const points = id === "general" && !site.claims.smallJobs ? item.points.slice(0, -1) : item.points;
    return { id, ...item, points };
  });

  return (
    <section id={dict.anchors.services} className="section bg-cream" aria-labelledby="services-title">
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <SectionHeading id="services-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} className="section-head" />

        <nav aria-label={dict.a11y.serviceChips}>
          <ul className="chips">
            {services.map((svc) => (
              <li key={svc.id}>
                <a href={`#service-${svc.id}`} className="chip">
                  {svc.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="service-grid">
          {services.map((svc, i) => (
            <li key={svc.id} data-reveal="up" style={{ ["--delay" as string]: `${(i % 4) * 0.06}s` }}>
              <article id={`service-${svc.id}`} className="service-card">
                <Icon name={serviceIcons[svc.id]} size={44} className="service-icon" />
                <h3>{svc.title}</h3>
                <p>{svc.text}</p>
                <ul className="service-points">
                  {svc.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <p className="services-footer">
          <a href={`tel:${site.phones[lang].e164}`} data-umami-event={`click_call_${lang}`}>
            <Icon name="phone" size={18} />
            {s.footerCta}
          </a>
        </p>
      </div>
    </section>
  );
}
