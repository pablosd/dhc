import type { ReactNode } from "react";

type Props = {
  media: ReactNode;
  /** Pone la imagen a la derecha en escritorio (los bloques alternan). */
  reverse?: boolean;
  children: ReactNode;
};

// Bloque texto + imagen alternado (docs/03 → ZigZag). En móvil, la imagen
// siempre va arriba.
export function ZigZag({ media, reverse = false, children }: Props) {
  return (
    <div className={`zigzag ${reverse ? "zigzag-reverse" : ""}`}>
      <div className="zigzag-media" data-reveal="fade">
        {media}
      </div>
      <div className="zigzag-text" data-reveal="up">
        {children}
      </div>
    </div>
  );
}
