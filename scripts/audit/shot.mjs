// Captura una página o un elemento a varios anchos e informa desbordes y errores.
// node scripts/audit/shot.mjs <ruta> <selector|full> <anchos,separados> <prefijo> [reduced]
// Las imágenes van a $AUDIT_OUT (por defecto scripts/audit/.out/).
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { launch, newPage, open, sleep } from "./lib.mjs";

const [, , path = "/en/", selector = "full", widths = "1440,390", prefix = "shot", reduced] = process.argv;
const OUT = process.env.AUDIT_OUT || fileURLToPath(new URL("./.out/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const browser = await launch();
const out = {};
for (const w of widths.split(",").map(Number)) {
  const page = await newPage(browser, { width: w, height: w < 700 ? 780 : 900, reduced: !!reduced });
  await open(page, path);
  await sleep(900);
  const file = `${OUT}/${prefix}-${w}.png`;
  if (selector === "full") await page.screenshot({ path: file, fullPage: true });
  else {
    // recorrer la página para disparar las animaciones de aparición
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    await page.$eval(selector, (el) => el.scrollIntoView());
    await sleep(900);
    await (await page.$(selector)).screenshot({ path: file });
  }
  out[w] = { file, overflowX: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors: page.errors };
  await page.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
