// Auditoría completa del sitio. Sin BASE_URL sirve /out en local (hace falta `npm run build` antes).
//   npm run qa                    → local (out/)
//   npm run qa:prod               → https://dhc.psalazar.dev (Umami bloqueado, formulario simulado)
//   npm run qa -- layout a11y     → solo esos chequeos
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { BASE, IS_PROD, sleep } from "./lib.mjs";

const ALL = ["layout", "a11y", "jsonld", "interactions"];
const wanted = process.argv.slice(2).filter((a) => ALL.includes(a));
const checks = wanted.length ? wanted : ALL;

let server;
if (!IS_PROD) {
  if (!existsSync("out/index.html")) {
    console.error("No hay build: ejecuta `npm run build` primero.");
    process.exit(2);
  }
  const port = new URL(BASE).port || "4173";
  server = spawn("npx", ["-y", "serve@14", "out", "-l", port], { stdio: "ignore" });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(BASE + "/en/")).ok) break; } catch {}
    await sleep(200);
  }
}

console.log(`Auditando ${BASE} → ${checks.join(", ")}\n`);
let failed = 0;
try {
  for (const name of checks) {
    const t0 = Date.now();
    let c;
    try { c = await (await import(`./${name}.mjs`)).default(); }
    catch (e) { c = { name, fails: [`no se pudo ejecutar: ${e.message}`] }; }
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    if (c.fails.length) {
      failed++;
      console.log(`✗ ${c.name} (${secs}s)\n   ${c.fails.join("\n   ")}`);
    } else console.log(`✓ ${c.name} (${secs}s)`);
  }
} finally {
  server?.kill();
}
console.log(failed ? `\n${failed} chequeo(s) con fallos.` : "\nTodo OK.");
process.exit(failed ? 1 : 0);
