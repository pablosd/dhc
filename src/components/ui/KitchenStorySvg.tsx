// Cocina que se arma con el scroll (docs/03 → Firma). Server Component: el
// HTML trae el ESTADO FINAL (cocina terminada), que es lo que se ve sin JS o
// con prefers-reduced-motion. ScrollStory anima los grupos según el progreso:
//   data-s / data-e   ventana de progreso (0–1) en la que el grupo entra
//   data-dy           desplazamiento vertical inicial (unidades SVG)
//   data-op           el grupo aparece con opacidad
//   data-draw         el trazo se dibuja (pathLength = 1)
//   data-out="a,b"    el grupo se desvanece entre a y b
//   .wood / .edge     relleno de madera que sustituye a las líneas del plano
import type { ReactNode } from "react";
import { cabinetDoors, HOOD_PATH, KITCHEN, KitchenDefs, TilePattern } from "./KitchenSvg";

const ID = "story";
const GLOW = "#F2B66D";
const DOOR = { door: "#3a1c0c", doorFill: `url(#${ID}-wood2)`, handle: "#E8D9C4" };

type Anim = {
  s?: number;
  e?: number;
  dy?: number;
  op?: boolean;
  out?: [number, number];
  children: ReactNode;
};

// Grupo animable. Atributos SSR = estado final.
function A({ s, e, dy, op, out, children }: Anim) {
  return (
    <g
      data-s={s}
      data-e={e}
      data-dy={dy}
      data-op={op ? "" : undefined}
      data-out={out ? out.join(",") : undefined}
      opacity={out ? 0 : undefined}
    >
      {children}
    </g>
  );
}

type Props = {
  /** Rótulo del plano: "PLAN · KITCHEN" / "PLANO · COCINA". */
  planLabel: string;
};

export function KitchenStorySvg({ planLabel }: Props) {
  const [r0] = KITCHEN.range;
  return (
    <svg viewBox="0 0 800 470" xmlns="http://www.w3.org/2000/svg" className="story-svg" focusable="false">
      <KitchenDefs id={ID} />
      <defs>
        <TilePattern id={`${ID}-tiles`} tile="#F3EADB" line="#d9cbb5" />
      </defs>

      <rect width="800" height="470" fill="#141210" />

      {/* Plano: rejilla */}
      <A out={[0.74, 0.86]}>
        <rect width="800" height="470" fill={`url(#${ID}-grid)`} />
      </A>

      {/* Pared y piso */}
      <A s={0.55} e={0.9} op>
        <rect width="800" height="440" fill="#2A2622" />
        <rect y="440" width="800" height="30" fill="#1d1a17" />
      </A>

      {/* Plano: contorno que se dibuja */}
      <A out={[0.8, 0.9]}>
        <g fill="none" stroke={GLOW} strokeWidth="1.5" strokeOpacity="0.8">
          <path data-draw="" data-s="0" data-e="0.1" pathLength={1} d="M60 440 H740" />
          <path data-draw="" data-s="0.02" data-e="0.12" pathLength={1} d="M60 440 V60 H740 V440" />
        </g>
      </A>

      {/* Plano: cotas en pies y pulgadas */}
      <A s={0.08} e={0.16} op out={[0.76, 0.86]}>
        <g fontFamily="var(--font-sans), sans-serif" fontSize="13" fill={GLOW} stroke={GLOW}>
          <line x1="80" y1="455" x2="720" y2="455" strokeWidth="1" />
          <line x1="80" y1="449" x2="80" y2="461" />
          <line x1="720" y1="449" x2="720" y2="461" />
          <text x="400" y="468" textAnchor="middle" stroke="none">
            13&apos; 4&quot;
          </text>
          <line x1="45" y1="90" x2="45" y2="430" strokeWidth="1" />
          <line x1="39" y1="90" x2="51" y2="90" />
          <line x1="39" y1="430" x2="51" y2="430" />
          <text x="30" y="265" textAnchor="middle" stroke="none" transform="rotate(-90 30 265)">
            7&apos; 1&quot;
          </text>
          <text x="400" y="80" textAnchor="middle" stroke="none" fontSize="12" letterSpacing="2">
            {planLabel}
          </text>
        </g>
      </A>

      {/* Diseño: módulos en línea punteada */}
      <A s={0.22} e={0.34} op out={[0.5, 0.62]}>
        <g fill="none" stroke={GLOW} strokeWidth="1.2" strokeDasharray="5 5" strokeOpacity="0.9">
          {KITCHEN.upper.map(([a, b]) => (
            <rect key={`gu${a}`} x={a} y="90" width={b - a} height="120" />
          ))}
          {KITCHEN.base.map(([a, b]) => (
            <rect key={`gb${a}`} x={a} y="330" width={b - a} height="100" />
          ))}
          <rect x={r0} y="330" width="80" height="100" />
          <rect x="70" y="318" width="660" height="12" />
        </g>
      </A>

      {/* Azulejo */}
      <A s={0.58} e={0.66} op>
        <rect x="80" y="210" width="640" height="108" fill={`url(#${ID}-tiles)`} />
      </A>

      {/* Gabinetes bajos: suben */}
      {KITCHEN.base.map(([a, b], i) => {
        const st = 0.42 + i * 0.03;
        return (
          <A key={`b${a}`} s={st} e={st + 0.08} dy={150} op>
            <g className="wood">
              <rect x={a} y="330" width={b - a} height="100" fill={`url(#${ID}-wood)`} />
            </g>
            <rect x={a} y="330" width={b - a} height="100" fill="none" stroke={GLOW} strokeWidth="1.5" strokeOpacity="0" className="edge" />
            <A s={0.76} e={0.84} op>
              {cabinetDoors(a, b, 330, 430, { ...DOOR, drawers: a === 300, shaker: true })}
            </A>
          </A>
        );
      })}

      {/* Estufa y zócalo */}
      <A s={0.5} e={0.58} dy={150} op>
        <rect x="80" y="430" width="640" height="10" fill="#1d1a17" />
        <rect x={r0} y="330" width="80" height="100" fill="#232323" stroke={GLOW} strokeWidth="1" />
        <rect x={r0 + 8} y="352" width="64" height="66" rx="3" fill="none" stroke="#555" strokeWidth="2" />
      </A>

      {/* Cubierta: cae */}
      <A s={0.55} e={0.61} dy={-220} op>
        <rect x="70" y="318" width="660" height="12" fill="#EDE7DE" />
      </A>

      {/* Alacenas: bajan */}
      {KITCHEN.upper.map(([a, b], i) => {
        const st = 0.6 + i * 0.025;
        return (
          <A key={`u${a}`} s={st} e={st + 0.08} dy={-200} op>
            <g className="wood">
              <rect x={a} y="90" width={b - a} height="120" fill={`url(#${ID}-wood)`} />
            </g>
            <rect x={a} y="90" width={b - a} height="120" fill="none" stroke={GLOW} strokeWidth="1.5" strokeOpacity="0" className="edge" />
            <A s={0.78} e={0.86} op>
              {cabinetDoors(a, b, 90, 210, { ...DOOR, upper: true, shaker: true })}
            </A>
          </A>
        );
      })}

      {/* Campana */}
      <A s={0.66} e={0.72} dy={-200} op>
        <path d={HOOD_PATH} fill="#cfc7bc" stroke="#4E2512" />
      </A>

      {/* Techo machihembrado y vigas */}
      <A s={0.84} e={0.9} dy={-70} op>
        <rect y="0" width="800" height="40" fill={`url(#${ID}-tg)`} />
        <rect y="0" width="800" height="40" fill={`url(#${ID}-beam)`} opacity="0.55" />
        {[60, 300, 540].map((x) => (
          <rect key={x} x={x} y="40" width="200" height="16" fill={`url(#${ID}-beam)`} />
        ))}
      </A>

      {/* Lámparas que se encienden */}
      {[250, 550].map((x) => (
        <g key={`l${x}`}>
          <A s={0.88} e={0.94} dy={-90} op>
            <line x1={x} y1="56" x2={x} y2="120" stroke="#0e0c0b" strokeWidth="2" />
            <path d={`M${x - 18} 120 h36 l8 22 h-52z`} fill="#0e0c0b" />
          </A>
          <A s={0.93} e={1} op>
            <circle cx={x} cy="150" r="80" fill={`url(#${ID}-halo)`} />
            <ellipse cx={x} cy="143" rx="22" ry="3" fill={GLOW} />
          </A>
        </g>
      ))}
    </svg>
  );
}
