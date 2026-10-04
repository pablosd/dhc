// Ilustración de cocina en vista frontal (docs/03). Se usa como fondo del hero
// mientras no haya foto real, en el antes/después de ejemplo y, en T12, como
// base de la cocina que se arma con el scroll.
// Unidades SVG: viewBox 800 × 470.
import type { ReactNode } from "react";

export const KITCHEN = {
  base: [
    [80, 200],
    [200, 300],
    [300, 380],
    [460, 560],
    [560, 720],
  ],
  upper: [
    [80, 200],
    [200, 300],
    [300, 370],
    [470, 560],
    [560, 720],
  ],
  range: [380, 460],
  hood: [370, 470],
} as const;

export type KitchenMode = "after" | "before";

type Palette = {
  wall: string;
  floor: string;
  box: string;
  stroke: string;
  door: string;
  doorFill: string;
  handle: string;
  counter: string;
  tile: string;
  tileLine: string;
  hood: string;
  range: string;
  rangeDoor: string;
  toeKick: string;
  beams: boolean;
  glow: boolean;
  shaker: boolean;
};

const palettes = (id: string): Record<KitchenMode, Palette> => ({
  after: {
    wall: "#2A2622",
    floor: "#1d1a17",
    box: `url(#${id}-wood)`,
    stroke: "#4E2512",
    door: "#3a1c0c",
    doorFill: `url(#${id}-wood2)`,
    handle: "#E8D9C4",
    counter: "#EDE7DE",
    tile: "#F3EADB",
    tileLine: "#d9cbb5",
    hood: "#cfc7bc",
    range: "#232323",
    rangeDoor: "#555",
    toeKick: "#1d1a17",
    beams: true,
    glow: true,
    shaker: true,
  },
  before: {
    wall: "#d8d2c4",
    floor: "#b9b0a1",
    box: "#cbbf9f",
    stroke: "#9d927a",
    door: "#9d927a",
    doorFill: "#d2c7aa",
    handle: "#8a8a8a",
    counter: "#bdb3a0",
    tile: "#e6e1d6",
    tileLine: "#cfc8b9",
    hood: "#e9e9e9",
    range: "#f2f2f2",
    rangeDoor: "#bbb",
    toeKick: "#a39880",
    beams: false,
    glow: false,
    shaker: false,
  },
});

type DoorOptions = {
  door: string;
  doorFill: string;
  handle: string;
  upper?: boolean;
  drawers?: boolean;
  shaker?: boolean;
};

/** Puertas, cajones y tiradores de un módulo. */
export function cabinetDoors(x1: number, x2: number, y1: number, y2: number, o: DoorOptions): ReactNode[] {
  const w = x2 - x1;
  const pad = 7;
  const out: ReactNode[] = [];
  if (o.drawers) {
    const h = (y2 - y1 - pad * 4) / 3;
    for (let i = 0; i < 3; i++) {
      const y = y1 + pad + i * (h + pad);
      out.push(
        <rect key={`d${i}`} x={x1 + pad} y={y} width={w - pad * 2} height={h} fill={o.doorFill} stroke={o.door} strokeWidth={1.5} />,
        <rect key={`h${i}`} x={x1 + w / 2 - 14} y={y + h / 2 - 2} width={28} height={4} rx={2} fill={o.handle} />,
      );
    }
    return out;
  }
  const n = w > 110 ? 2 : 1;
  const dw = (w - pad * (n + 1)) / n;
  for (let i = 0; i < n; i++) {
    const x = x1 + pad + i * (dw + pad);
    out.push(<rect key={`p${i}`} x={x} y={y1 + pad} width={dw} height={y2 - y1 - pad * 2} fill={o.doorFill} stroke={o.door} strokeWidth={1.5} />);
    if (o.shaker) {
      out.push(
        <rect key={`s${i}`} x={x + 9} y={y1 + pad + 9} width={dw - 18} height={y2 - y1 - pad * 2 - 18} fill="none" stroke={o.door} strokeWidth={1} opacity={0.7} />,
      );
    }
    const hx = n === 2 ? (i === 0 ? x + dw - 12 : x + 8) : x + dw - 12;
    const hy = o.upper ? y2 - pad - 34 : y1 + pad + 8;
    out.push(<rect key={`h${i}`} x={hx} y={hy} width={4} height={26} rx={2} fill={o.handle} />);
  }
  return out;
}

/** Gradientes y patrones compartidos. `id` hace únicos los identificadores. */
export function KitchenDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-wood`} x1="0" x2="1" y1="0" y2="0.3">
        <stop offset="0" stopColor="#8a4a22" />
        <stop offset="0.5" stopColor="#7A3E1D" />
        <stop offset="1" stopColor="#5a2d14" />
      </linearGradient>
      <linearGradient id={`${id}-wood2`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#94522a" />
        <stop offset="1" stopColor="#6e3818" />
      </linearGradient>
      <linearGradient id={`${id}-beam`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#B8692F" />
        <stop offset="1" stopColor="#7A3E1D" />
      </linearGradient>
      <radialGradient id={`${id}-halo`}>
        <stop offset="0" stopColor="#F2B66D" stopOpacity="0.75" />
        <stop offset="1" stopColor="#F2B66D" stopOpacity="0" />
      </radialGradient>
      <pattern id={`${id}-tg`} width="18" height="40" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#5a2d14" strokeWidth="1" />
      </pattern>
      <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="#F2B66D" strokeOpacity="0.12" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

export function TilePattern({ id, tile, line }: { id: string; tile: string; line: string }) {
  return (
    <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse">
      <rect width="24" height="12" fill={tile} />
      <path d="M0 12H24M12 0V6M0 6H24M0 6V12M24 6V12" stroke={line} strokeWidth="1" fill="none" />
    </pattern>
  );
}

const HOOD_PATH = `M${KITCHEN.hood[0]} 90 H${KITCHEN.hood[1]} V150 L${KITCHEN.hood[1] + 14} 205 H${KITCHEN.hood[0] - 14} L${KITCHEN.hood[0]} 150Z`;
export { HOOD_PATH };

type Props = {
  mode: KitchenMode;
  /** Prefijo único para los ids internos (varias cocinas en la misma página). */
  id: string;
  /** Recorte de la vista, p. ej. "60 70 400 260" para un detalle. */
  viewBox?: string;
  className?: string;
  /** Si no se pasa, la ilustración es decorativa (aria-hidden). */
  label?: string;
};

export function KitchenSvg({ mode, id, viewBox = "0 0 800 470", className, label }: Props) {
  const p = palettes(id)[mode];
  const [r0] = KITCHEN.range;
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <KitchenDefs id={id} />
      <defs>
        <TilePattern id={`${id}-tiles`} tile={p.tile} line={p.tileLine} />
      </defs>
      <rect width="800" height="470" fill={p.wall} />
      <rect y="440" width="800" height="30" fill={p.floor} />

      {p.beams ? (
        <g>
          <rect y="0" width="800" height="40" fill={`url(#${id}-tg)`} />
          <rect y="0" width="800" height="40" fill={`url(#${id}-beam)`} opacity="0.55" />
          {[60, 300, 540].map((x) => (
            <rect key={x} x={x} y="40" width="200" height="16" fill={`url(#${id}-beam)`} />
          ))}
        </g>
      ) : (
        <rect x="300" y="18" width="200" height="14" rx="3" fill="#f7f7f2" stroke="#ccc" />
      )}

      <rect x="80" y="210" width="640" height="108" fill={`url(#${id}-tiles)`} />

      {KITCHEN.upper.map(([a, b]) => (
        <g key={`u${a}`}>
          <rect x={a} y="90" width={b - a} height="120" fill={p.box} stroke={p.stroke} strokeWidth="1.5" />
          {cabinetDoors(a, b, 90, 210, { door: p.door, doorFill: p.doorFill, handle: p.handle, upper: true, shaker: p.shaker })}
        </g>
      ))}
      <path d={HOOD_PATH} fill={p.hood} stroke={p.stroke} strokeWidth="1" />

      {KITCHEN.base.map(([a, b]) => (
        <g key={`b${a}`}>
          <rect x={a} y="330" width={b - a} height="100" fill={p.box} stroke={p.stroke} strokeWidth="1.5" />
          {cabinetDoors(a, b, 330, 430, { door: p.door, doorFill: p.doorFill, handle: p.handle, drawers: a === 300, shaker: p.shaker })}
        </g>
      ))}
      <rect x="80" y="430" width="640" height="10" fill={p.toeKick} />
      <rect x={r0} y="330" width="80" height="100" fill={p.range} stroke={p.stroke} />
      <rect x={r0 + 8} y="352" width="64" height="66" rx="3" fill="none" stroke={p.rangeDoor} strokeWidth="2" />
      <rect x="70" y="318" width="660" height="12" fill={p.counter} />

      {p.glow
        ? [250, 550].map((x) => (
            <g key={`l${x}`}>
              <line x1={x} y1="56" x2={x} y2="120" stroke="#1d1a17" strokeWidth="2" />
              <circle cx={x} cy="150" r="70" fill={`url(#${id}-halo)`} />
              <path d={`M${x - 18} 120 h36 l8 22 h-52z`} fill="#1d1a17" />
              <ellipse cx={x} cy="143" rx="22" ry="3" fill="#F2B66D" />
            </g>
          ))
        : null}
    </svg>
  );
}
