// Accesibilidad con axe-core (WCAG 2.2 AA + buenas prácticas), con movimiento reducido para ver el estado final.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { launch, newPage, open, checker } from "./lib.mjs";

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const PATHS = ["/en/", "/es/", "/en/page-not-found/", "/es/page-not-found/", "/404.html"];

export default async function a11y() {
  const c = checker("a11y");
  const browser = await launch();
  for (const path of PATHS) for (const w of [1280, 375]) {
    const page = await newPage(browser, { width: w, reduced: true });
    await open(page, path);
    await page.addScriptTag({ content: axeSource });
    const r = await page.evaluate(() =>
      window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }),
    );
    for (const v of r.violations)
      c.fails.push(`${path} @${w}: ${v.impact} ${v.id} (${v.nodes.length}) → ${v.nodes[0].target.join(" ")}`);
    await page.close();
  }
  await browser.close();
  return c;
}
