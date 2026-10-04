// Asigna cada sector censal a la ciudad candidata más cercana (distancia
// ponderada por el peso de la ciudad). Entrada: data/tracts.json. Salida:
// data/tracts-z.json con la propiedad `zone`.
import { readFile, writeFile } from "node:fs/promises";

const dir = new URL(".", import.meta.url);
const { cities, overrides } = JSON.parse(await readFile(new URL("cities.json", dir), "utf8"));
const tracts = JSON.parse(await readFile(new URL("data/tracts.json", dir), "utf8"));
const C = Math.cos((30.3 * Math.PI) / 180);

const nearest = (cx, cy, exclude) => {
  let best = null;
  let bd = Infinity;
  for (const c of cities) {
    if (c.name === exclude) continue;
    const d = Math.hypot((cx - c.lon) * C, cy - c.lat) / c.weight;
    if (d < bd) {
      bd = d;
      best = c.name;
    }
  }
  return best;
};

for (const f of tracts.features) {
  const { cx, cy } = f.properties;
  let zone = nearest(cx, cy);
  for (const o of overrides) {
    if (zone === o.zone && o.lonLessThan !== undefined && cx < o.lonLessThan) zone = nearest(cx, cy, o.zone);
  }
  f.properties = { zone };
}

await writeFile(new URL("data/tracts-z.json", dir), JSON.stringify(tracts));
console.log(`✓ ${tracts.features.length} sectores asignados a ${cities.length} ciudades`);
