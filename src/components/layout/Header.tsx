import { HeaderScroll } from "@/components/client/HeaderScroll";
import { MobileMenu } from "@/components/client/MobileMenu";
import { site } from "@/content/site";
import { filler, getDictionary, htmlLang, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { Wordmark } from "./Wordmark";

type Props = {
  lang: Locale;
};

// Header fijo (docs/03): transparente sobre el hero, sólido al bajar o en
// páginas sin hero. Menú en el orden de la página (docs/04 → Header).
export function Header({ lang }: Props) {
  const dict = getDictionary(lang);
  const t = filler(lang);
  const other: Locale = lang === "en" ? "es" : "en";
  const home = `/${lang}/`;
  const a = dict.anchors;

  const links = [
    { href: `${home}#${a.services}`, label: dict.nav.services },
    { href: `${home}#${a.about}`, label: dict.nav.about },
    { href: `${home}#${a.process}`, label: dict.nav.process },
    { href: `${home}#${a.work}`, label: dict.nav.work },
    { href: `${home}#${a.faq}`, label: dict.nav.faq },
  ];
  const cta = { href: `${home}#${a.estimate}`, label: dict.nav.cta };
  const phone = site.phones[lang];
  const phoneAria = t(lang === "en" ? dict.a11y.callEn : dict.a11y.callEs);
  const callEvent = `click_call_${lang}`;

  return (
    <header id="site-header" className="site-header">
      <div className="site-header-inner mx-auto w-full max-w-site px-5 md:px-8">
        <Wordmark href={home} label={dict.a11y.logoHome} />

        <nav aria-label={dict.a11y.mainNav} className="site-nav">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={`tel:${phone.e164}`} className="site-phone" aria-label={phoneAria} data-umami-event={callEvent}>
          {phone.display}
        </a>
        <LanguageSwitch
          to={other}
          href={`/${other}/`}
          text={dict.nav.language}
          label={dict.a11y.languageSwitch}
          className="site-lang"
        />
        <a href={cta.href} className="btn btn-primary site-cta" data-umami-event="click_estimate_cta">
          {cta.label}
        </a>

        <MobileMenu
          labels={{ open: dict.a11y.menuOpen, close: dict.a11y.menuClose, nav: dict.a11y.mainNav }}
          links={links}
          cta={cta}
          phone={{ href: `tel:${phone.e164}`, label: phone.display, ariaLabel: phoneAria, event: callEvent }}
          language={{ href: `/${other}/`, text: dict.nav.language, label: dict.a11y.languageSwitch, lang: htmlLang[other] }}
        />
      </div>
      <HeaderScroll />
    </header>
  );
}
