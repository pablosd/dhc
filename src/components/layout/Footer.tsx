import { site } from "@/content/site";
import { filler, getDictionary, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { Wordmark } from "./Wordmark";

type Props = {
  lang: Locale;
};

// Footer (docs/04 §12): marca, servicios, empresa, NAP y selector de idioma.
// El NAP debe coincidir con Google Business (docs/05 §5).
export function Footer({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const f = dict.footer;
  const home = `/${lang}/`;
  const a = dict.anchors;
  const other: Locale = lang === "en" ? "es" : "en";
  const owner = site.legalName && site.legalName !== site.name ? site.legalName : site.name;
  const copyright = t(f.copyright).replace(site.name, owner);
  const place = [site.address.street, `${site.address.city}, ${site.address.region}`, site.address.postalCode]
    .filter(Boolean)
    .join(", ");

  const company = [
    { href: `${home}#${a.about}`, label: dict.nav.about },
    { href: `${home}#${a.process}`, label: dict.nav.process },
    { href: `${home}#${a.work}`, label: dict.nav.work },
    { href: `${home}#${a.faq}`, label: dict.nav.faq },
    { href: `${home}#${a.estimate}`, label: dict.nav.cta },
  ];

  return (
    <footer className="site-footer">
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark href={home} label={dict.a11y.logoHome} />
            <p>{f.tagline}</p>
          </div>

          <nav aria-label={f.colServices}>
            <h2 className="footer-title">{f.colServices}</h2>
            <ul>
              {site.services.map((id) => (
                <li key={id}>
                  <a href={`${home}#service-${id}`}>{dict.services.items[id].short}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={f.colCompany}>
            <h2 className="footer-title">{f.colCompany}</h2>
            <ul>
              {company.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer-title">{f.colContact}</h2>
            <address className="footer-nap">
              <span>{site.name}</span>
              <span>{place}</span>
              {(["en", "es"] as const).map((l) => (
                <a key={l} href={`tel:${site.phones[l].e164}`} data-umami-event={`click_call_${l}`}>
                  {l === "en" ? dict.estimate.contact.lineEn : dict.estimate.contact.lineEs}: {site.phones[l].display}
                </a>
              ))}
              {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : null}
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{copyright}</p>
          <LanguageSwitch to={other} href={`/${other}/`} text={dict.nav.language} label={dict.a11y.languageSwitch} />
        </div>
      </div>
    </footer>
  );
}
