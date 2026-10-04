type Props = {
  items: string[];
  /** aria-label del interruptor (dict.a11y.marqueePause). */
  pauseLabel: string;
};

// Cinta de servicios (docs/03 → Marquee accesible). Sin JS: el interruptor es
// un checkbox con role="switch" y el CSS pausa la animación con :has(:checked).
// La copia que hace el bucle continuo va con aria-hidden.
export function Marquee({ items, pauseLabel }: Props) {
  return (
    <div className="plank">
      <div className="marquee">
        <div className="marquee-viewport">
          <ul className="marquee-track">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {items.map((item) => (
              <li key={`copy-${item}`} aria-hidden="true">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <label className="marquee-switch">
          <input type="checkbox" role="switch" aria-label={pauseLabel} />
          <span className="marquee-switch-icon" aria-hidden="true">
            <svg className="icon-pause" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1" width="3" height="10" />
              <rect x="7" y="1" width="3" height="10" />
            </svg>
            <svg className="icon-play" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1l8 5-8 5z" />
            </svg>
          </span>
        </label>
      </div>
    </div>
  );
}
