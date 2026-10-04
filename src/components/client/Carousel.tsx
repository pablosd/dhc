"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type CarouselLabels = {
  /** aria-roledescription del contenedor: "carrusel". */
  carousel: string;
  prev: string;
  next: string;
  pause: string;
  resume: string;
  /** Plantilla con {n}: "Ir a la {n}". */
  goTo: string;
};

type Props = {
  /** Nombre accesible del carrusel (p. ej. el título de la sección). */
  label: string;
  labels: CarouselLabels;
  /** Milisegundos entre diapositivas. */
  interval?: number;
  /** Cada hijo es una diapositiva; el padre le pone role="group",
   * aria-roledescription="diapositiva" y aria-label "1 de 5". */
  children: ReactNode;
};

// Carrusel con avance automático (docs/03 → Carrusel). Se detiene con hover,
// foco, toque, tarjeta volteada, fuera de pantalla y pestaña oculta. Botón de
// pausa visible (WCAG 2.2.2). Con prefers-reduced-motion arranca en pausa.
export function Carousel({ label, labels, interval = 5000, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(0);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [running, setRunning] = useState(false);
  const holds = useRef({ hover: false, focus: false, visible: false, flipped: false, hidden: false });
  const reduce = useRef(false);
  const slideCount = Children.count(children);

  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 1;
    const [a, b] = track.children as unknown as HTMLElement[];
    return a && b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const s = step();
    setPages(Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / s) + 1));
    setIndex(Math.round(track.scrollLeft / s));
  }, [step]);

  const go = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const s = step();
      const n = Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / s) + 1);
      const target = ((i % n) + n) % n;
      track.scrollTo({ left: target * s, behavior: reduce.current ? "auto" : "smooth" });
    },
    [step],
  );

  const evaluate = useCallback(() => {
    const h = holds.current;
    setRunning(!userPaused && !h.hover && !h.focus && h.visible && !h.flipped && !h.hidden);
  }, [userPaused]);

  // Referencia estable a la última versión de evaluate (para listeners).
  const evaluateRef = useRef(evaluate);
  useEffect(() => {
    evaluateRef.current = evaluate;
    evaluate();
  }, [evaluate]);

  // Estado inicial, medidas y eventos que no dependen del estado.
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) setUserPaused(true);
    measure();
    const root = rootRef.current!;
    const track = trackRef.current!;

    let scrollTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => setIndex(Math.round(track.scrollLeft / step())), 80);
    };
    const onResize = () => measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        holds.current.visible = entry.isIntersecting;
        evaluateRef.current();
      },
      { threshold: 0.4 },
    );
    io.observe(root);

    const onVisibility = () => {
      holds.current.hidden = document.hidden;
      evaluateRef.current();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      window.clearTimeout(scrollTimer);
    };
  }, [measure, step]);

  // Temporizador del avance automático.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(index + 1), interval);
    return () => window.clearTimeout(id);
  }, [running, index, interval, go]);

  const hold = (key: "hover" | "focus" | "flipped", value: boolean) => {
    holds.current[key] = value;
    evaluate();
  };

  return (
    <div
      ref={rootRef}
      className={`carousel ${running ? "is-running" : ""}`}
      role="region"
      aria-roledescription={labels.carousel}
      aria-label={label}
      style={{ ["--interval" as string]: `${interval}ms` }}
      onMouseEnter={() => hold("hover", true)}
      onMouseLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hold("focus", false);
      }}
      onChange={() => hold("flipped", !!rootRef.current?.querySelector(".flip input:checked"))}
    >
      <div
        ref={trackRef}
        className="carousel-track"
        tabIndex={0}
        onTouchStart={() => setUserPaused(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(index - 1);
          }
        }}
      >
        {children}
      </div>

      <div className="carousel-time" aria-hidden="true">
        {/* La key reinicia la animación de la barra en cada diapositiva. */}
        <i key={`${index}-${running}`} />
      </div>

      <div className="carousel-bar">
        <div className="carousel-dots">
          {Array.from({ length: pages || slideCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels.goTo.replace("{n}", String(i + 1))}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="carousel-btn" aria-label={labels.prev} onClick={() => go(index - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="15 5 8 12 15 19" />
          </svg>
        </button>
        <button
          type="button"
          className="carousel-btn"
          aria-pressed={userPaused}
          aria-label={userPaused ? labels.resume : labels.pause}
          onClick={() => setUserPaused((p) => !p)}
        >
          {userPaused ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 4l13 8-13 8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          )}
        </button>
        <button type="button" className="carousel-btn" aria-label={labels.next} onClick={() => go(index + 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="9 5 16 12 9 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
