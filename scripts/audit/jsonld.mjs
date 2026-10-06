// JSON-LD: tipos y propiedades válidos según el vocabulario de schema.org, y FAQ del JSON-LD = FAQ visible.
// El vocabulario se descarga una vez a scripts/audit/.cache/ (ignorado por git).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { BASE, checker } from "./lib.mjs";

const VOCAB_URL = "https://schema.org/version/latest/schemaorg-current-https.jsonld";
const CACHE = new URL("./.cache/schemaorg.jsonld", import.meta.url);
const PAGES = ["/en/", "/es/"];

async function vocabulary() {
  if (!existsSync(CACHE)) {
    mkdirSync(new URL("./.cache/", import.meta.url), { recursive: true });
    const res = await fetch(VOCAB_URL);
    if (!res.ok) throw new Error(`No se pudo descargar el vocabulario de schema.org (${res.status})`);
    writeFileSync(CACHE, await res.text());
  }
  const graph = JSON.parse(readFileSync(CACHE, "utf8"))["@graph"];
  const id = (x) => (typeof x === "string" ? x : x["@id"]).replace("schema:", "");
  const arr = (x) => (x === undefined ? [] : Array.isArray(x) ? x : [x]);
  const classes = {}, props = {};
  for (const n of graph) {
    const types = arr(n["@type"]);
    if (types.includes("rdfs:Class")) classes[id(n)] = arr(n["rdfs:subClassOf"]).map(id);
    if (types.includes("rdf:Property")) props[id(n)] = arr(n["schema:domainIncludes"]).map(id);
  }
  return { classes, props };
}

const decode = (s) =>
  s.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export default async function jsonld() {
  const c = checker("jsonld");
  const { classes, props } = await vocabulary();
  const ancestors = (t, seen = new Set()) => {
    if (seen.has(t)) return seen;
    seen.add(t);
    for (const p of classes[t] || []) ancestors(p, seen);
    return seen;
  };
  const check = (node, path) => {
    if (Array.isArray(node)) return node.forEach((n, i) => check(n, `${path}[${i}]`));
    if (!node || typeof node !== "object") return;
    const t = node["@type"];
    if (!t) return Object.entries(node).forEach(([k, v]) => check(v, `${path}.${k}`));
    if (!classes[t]) c.fails.push(`${path}: tipo desconocido ${t}`);
    const anc = ancestors(t);
    for (const [k, v] of Object.entries(node)) {
      if (!k.startsWith("@")) {
        if (!props[k]) c.fails.push(`${path}.${k}: propiedad desconocida`);
        else if (!props[k].some((d) => anc.has(d))) c.fails.push(`${path}.${k}: no válida para ${t}`);
      }
      check(v, `${path}.${k}`);
    }
  };
  for (const p of PAGES) {
    const html = await (await fetch(`${BASE}${p}`)).text();
    const raw = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
    c.expect(raw, `${p}: sin JSON-LD`);
    if (!raw) continue;
    const graph = JSON.parse(raw)["@graph"];
    check(graph, p);
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    if (!faq) continue;
    const visible = [...html.matchAll(/<details[^>]*><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map((m) => [decode(m[1]), decode(m[2])]);
    const ld = faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
    c.expect(JSON.stringify(visible) === JSON.stringify(ld), `${p}: la FAQ del JSON-LD no coincide con la visible`);
  }
  return c;
}
