import { EstimateForm } from "@/components/client/EstimateForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

// Contacto / estimado (docs/04 §11): formulario y columna con los dos
// teléfonos (la línea del idioma primero) y, cuando existan, correo, horario
// y WhatsApp.
export function Contact({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const e = dict.estimate;
  const f = e.form;
  const projectTypes = [...site.services.map((id) => dict.services.items[id].title), f.projectTypeOther];
  const order = lang === "en" ? (["en", "es"] as const) : (["es", "en"] as const);

  return (
    <section id={dict.anchors.estimate} className="section surface-dark" aria-labelledby="estimate-title">
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <SectionHeading id="estimate-title" eyebrow={e.eyebrow} title={e.title} lead={e.lead} className="section-head" />
        <div className="contact-grid">
          <EstimateForm
            lang={lang}
            projectTypes={projectTypes}
            phoneHref={`tel:${site.phones[lang].e164}`}
            text={{
              name: f.name,
              phone: f.phone,
              email: f.email,
              projectType: f.projectType,
              projectTypePlaceholder: f.projectTypePlaceholder,
              city: f.city,
              message: f.message,
              messagePlaceholder: f.messagePlaceholder,
              optional: f.optional,
              submit: f.submit,
              sending: f.sending,
              success: f.success,
              error: t(f.error),
              consent: site.claims.textMessages ? f.consent : f.consentNoText,
              validation: e.validation,
            }}
          />

          <aside className="contact-lines" aria-label={e.contact.callTitle}>
            <p className="contact-title">{e.contact.callTitle}</p>
            {order.map((l) => (
              <a
                key={l}
                href={`tel:${site.phones[l].e164}`}
                className="line-card"
                data-umami-event={`click_call_${l}`}
              >
                <span className="line-card-label">{l === "en" ? e.contact.lineEn : e.contact.lineEs}</span>
                <span className="line-card-value">{site.phones[l].display}</span>
              </a>
            ))}
            {site.whatsapp ? (
              <a
                href={`https://wa.me/${site.whatsapp.e164.replace(/\D/g, "")}`}
                className="line-card"
                aria-label={dict.a11y.whatsapp}
                data-umami-event="click_whatsapp"
                target="_blank"
                rel="noopener"
              >
                <span className="line-card-label">{e.contact.whatsapp}</span>
                <span className="line-card-value">{site.whatsapp.display}</span>
              </a>
            ) : null}
            {site.email ? (
              <a href={`mailto:${site.email}`} className="line-card">
                <span className="line-card-label">{e.contact.email}</span>
                <span className="line-card-text">{site.email}</span>
              </a>
            ) : null}
            {site.hours ? (
              <div className="line-card">
                <span className="line-card-label">{e.contact.hours}</span>
                <span className="line-card-text">{site.hours}</span>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
