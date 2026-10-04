import type { ReactNode } from "react";

type Props = {
  /** id único: enlaza el <label> con su checkbox. */
  id: string;
  title: string;
  description: string;
  before: ReactNode;
  after: ReactNode;
  labels: { before: string; after: string; flip: string; sample?: string };
};

// Tarjeta antes/después que se voltea (docs/03 → Antes y después). Sin JS: un
// checkbox oculto dentro del <label> guarda el estado y el CSS gira la tarjeta
// con :hover o :checked (toque, Enter o Espacio). Con movimiento reducido,
// fundido en lugar de giro.
export function BeforeAfterCard({ id, title, description, before, after, labels }: Props) {
  return (
    <figure className="flip-figure">
      <label className="flip" htmlFor={id}>
        <input type="checkbox" id={id} aria-label={labels.flip} />
        <span className="flip-inner">
          <span className="flip-face flip-front">
            {before}
            <span className="flip-tag flip-tag-before">{labels.before}</span>
            {labels.sample ? <span className="flip-sample">{labels.sample}</span> : null}
          </span>
          <span className="flip-face flip-back">
            {after}
            <span className="flip-tag flip-tag-after">{labels.after}</span>
            {labels.sample ? <span className="flip-sample">{labels.sample}</span> : null}
          </span>
        </span>
      </label>
      <figcaption className="flip-caption">
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
    </figure>
  );
}
