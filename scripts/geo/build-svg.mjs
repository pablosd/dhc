// Proyecta las zonas, el contorno y los condados a coordenadas SVG y escribe
// src/content/area-map.ts. Proyección equirectangular centrada en 30.3° N.
import { readFile, writeFile } from "node:fs/promises";

const dir = new URL(".", import.meta.url);
const read = async (f) => JSON.parse(await readFile(new URL(f, dir), "utf8"));
const zones = await read("data/zones.json");
const outline = await read("data/outline.json");
const counties = await read("data/counties.json");
const { base } = await read("cities.json");

const LON0 = -98.32, LON1 = -97.1, LAT0 = 29.72, LAT1 = 30.93, K = 800;
const C = Math.cos((30.3 * Math.PI) / 180);
const X = (lon) => (lon - LON0) * K * C;
const Y = (lat) => (LAT1 - lat) * K;
const r = (v) => Math.round(v * 10) / 10;
const geoms = (fc) => fc.geometries ?? fc.features.map((f) => f.geometry);
const rings = (g) => (g.type === "Polygon" ? g.coordinates : g.coordinates.flat());
const path = (g) => rings(g).map((ring) => "M" + ring.map(([lo, la]) => `${r(X(lo))},${r(Y(la))}`).join("L") + "Z").join("");

const data = {
  width: Math.round(X(LON1)),
  height: Math.round(Y(LAT0)),
  /** Píxeles SVG que equivalen a 10 millas (1° de latitud ≈ 69 mi). */
  tenMiles: r((10 / 69) * K),
  base: [r(X(base.lon)), r(Y(base.lat))],
  outline: path(geoms(outline)[0]),
  counties: geoms(counties).map(path),
  zones: zones.features.map((f) => ({
    name: f.properties.zone,
    d: path(f.geometry),
    label: [r(X(f.properties.lx)), r(Y(f.properties.ly))],
  })),
};

const out = `// GENERADO por scripts/geo (npm run geo). No editar a mano.
// Límites: sectores censales y condados del censo de EE. UU. (dominio público),
// agrupados por la ciudad más cercana. Zonas ilustrativas, no límites legales.

export type AreaZone = { name: string; d: string; label: [number, number] };

export const areaMap = ${JSON.stringify(data)} as {
  width: number;
  height: number;
  tenMiles: number;
  base: [number, number];
  outline: string;
  counties: string[];
  zones: AreaZone[];
};
`;
await writeFile(new URL("../../src/content/area-map.ts", dir), out);
console.log(`✓ src/content/area-map.ts (${data.zones.length} zonas, ${(out.length / 1024).toFixed(1)} KB)`);
