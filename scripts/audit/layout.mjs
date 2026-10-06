// Maquetación: desbordes horizontales, anclas tapadas por el header, marcadores sin rellenar y errores de consola.
import { launch, newPage, open, sleep, checker } from "./lib.mjs";

export default async function layout() {
  const c = checker("layout");
  const browser = await launch();
  for (const lang of ["en", "es"]) for (const w of [1440, 768, 360]) {
    const tag = `${lang}@${w}`;
    const page = await newPage(browser, { width: w, height: 800 });
    await open(page, `/${lang}/`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    c.expect(overflow <= 0, `${tag}: desborde horizontal de ${overflow}px`);
    const anchors = await page.$$eval(".site-nav a", (as) => as.map((a) => a.getAttribute("href").split("#")[1]));
    c.expect(anchors.length > 0, `${tag}: el menú no tiene anclas`);
    for (const id of anchors) {
      await page.evaluate((id) => { location.hash = id; }, id);
      await sleep(250);
      const r = await page.evaluate((id) => {
        const h = document.getElementById(id)?.querySelector("h2");
        if (!h) return null;
        return { top: h.getBoundingClientRect().top, hdr: document.getElementById("site-header").getBoundingClientRect().bottom };
      }, id);
      c.expect(r, `${tag}: #${id} no existe o no tiene h2`);
      if (r) c.expect(r.top >= r.hdr, `${tag}: el header tapa el título de #${id}`);
    }
    const leftovers = await page.evaluate(() => document.body.innerText.match(/\{[a-zA-Z]+\}|undefined|\[object/g) || []);
    c.expect(!leftovers.length, `${tag}: texto sin rellenar ${JSON.stringify(leftovers)}`);
    c.expect(!page.errors.length, `${tag}: errores de consola ${JSON.stringify(page.errors)}`);
    await page.close();
  }
  await browser.close();
  return c;
}
