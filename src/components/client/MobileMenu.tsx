"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Link = { href: string; label: string };

type Props = {
  labels: { open: string; close: string; nav: string };
  links: Link[];
  cta: Link;
  phone: Link & { ariaLabel: string; event: string };
  language: { href: string; text: string; label: string; lang: string };
};

// Menú móvil (docs/03): diálogo a pantalla completa con foco atrapado, Esc
// para cerrar, bloqueo del scroll y devolución del foco al botón.
// Recibe textos ya resueltos: no importa diccionarios (no van al cliente).
export function MobileMenu({ labels, links, cta, phone, language }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current!;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (el) => el.offsetParent !== null,
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={labels.open}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.nav}
        hidden={!open}
      >
        <div className="mobile-menu-top">
          <a href={language.href} lang={language.lang} hrefLang={language.lang} aria-label={language.label} className="lang-switch" data-umami-event="click_language_switch">
            {language.text}
          </a>
          <button type="button" className="menu-button" aria-label={labels.close} onClick={close}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav aria-label={labels.nav}>
          <ul className="mobile-menu-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-actions">
          <a href={cta.href} className="btn btn-primary" onClick={() => setOpen(false)} data-umami-event="click_estimate_cta">
            {cta.label}
          </a>
          <a href={phone.href} className="btn btn-light" aria-label={phone.ariaLabel} data-umami-event={phone.event}>
            {phone.label}
          </a>
        </div>
      </div>
    </>
  );
}
