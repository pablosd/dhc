import { areaMap } from "@/content/area-map";

// Tono de madera por zona atendida: vecinas con tonos distintos (docs/03 → Mapa).
const TONE: Record<string, string> = {
  Austin: "#7A3E1D",
  "Round Rock": "#B8692F",
  "Cedar Park": "#9c5a2c",
  Leander: "#C98B4F",
  Georgetown: "#8a4a22",
  Pflugerville: "#C98B4F",
  Hutto: "#6b361a",
  Manor: "#B8692F",
  Lakeway: "#C98B4F",
  "Bee Cave": "#B8692F",
  "West Lake Hills": "#D49A5E",
  "Dripping Springs": "#9c5a2c",
  Buda: "#C98B4F",
  Kyle: "#8a4a22",
};
const ASK_FILL = "#DCD0BE";

// Ajustes de etiqueta: [dx, dy, pequeña]
const NUDGE: Record<string, [number, number, boolean?]> = {
  "West Lake Hills": [0, 0, true],
  "Bee Cave": [0, 0, true],
  Austin: [0, 24],
};

type Props = {
  served: string[];
  label: string;
  scaleLabel: string;
};

function labelLines(name: string) {
  const words = name.split(" ");
  if (words.length < 2 || name.length <= 9) return [name];
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
}

// Mapa de zonas de servicio (Server Component). Formas generadas por
// scripts/geo; qué zonas van en color lo decide site.areas.served.
export function AreaMapSvg({ served, label, scaleLabel }: Props) {
  const { width, height, zones, counties, outline, base, tenMiles } = areaMap;
  const isServed = (name: string) => served.includes(name);
  const ordered = [...zones].sort((a, b) => Number(isServed(a.name)) - Number(isServed(b.name)));
  let k = 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label} className="area-map-svg">
      {counties.map((d, i) => (
        <path key={`c${i}`} d={d} className="area-county" />
      ))}
      <path d={outline} className="area-shadow" transform="translate(6 8)" />

      <g className="area-zones" data-reveal="fade">
      {ordered.map((z) => {
        const on = isServed(z.name);
        const delay = on ? `${(k++ * 0.06).toFixed(2)}s` : "0s";
        return (
          <g
            key={z.name}
            className={`area-zone ${on ? "is-served" : "is-ask"}`}
            data-city={z.name}
            style={{ ["--delay" as string]: delay }}
          >
            <path d={z.d} fill={on ? (TONE[z.name] ?? "#9c5a2c") : ASK_FILL} />
          </g>
        );
      })}
      </g>
      <path d={outline} className="area-outline" />

      {zones.map((z) => {
        const [dx, dy, small] = NUDGE[z.name] ?? [0, 0, false];
        const lines = labelLines(z.name);
        const lh = small ? 12 : 16;
        const x = z.label[0] + dx;
        const y0 = z.label[1] + dy - ((lines.length - 1) * lh) / 2 + 5;
        return (
          <text
            key={`t${z.name}`}
            x={x}
            y={y0}
            textAnchor="middle"
            className={`area-label ${isServed(z.name) ? "" : "is-ask"} ${small ? "is-small" : ""}`}
            aria-hidden="true"
          >
            {lines.map((line, i) => (
              <tspan key={line} x={x} dy={i ? lh : 0}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      <path
        d={`M${base[0]} ${base[1] - 10}l2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9z`}
        fill="#F2B66D"
        stroke="#141210"
        strokeWidth="1.2"
      />
      <g transform={`translate(${width - 40} 40)`} className="area-meta" aria-hidden="true">
        <path d="M0 -16 L6 2 L0 -2 L-6 2Z" />
        <text y="16" textAnchor="middle">
          N
        </text>
      </g>
      <g transform={`translate(${width - 150} ${height - 26})`} className="area-meta" aria-hidden="true">
        <line x1="0" y1="0" x2={tenMiles} y2="0" />
        <text x="0" y="-6">
          {scaleLabel}
        </text>
      </g>
    </svg>
  );
}
