// Genera los recursos de marca (docs/03 → Logo, docs/04 → Imágenes OG):
//   public/og/og-en.jpg, public/og/og-es.jpg  (1200 × 630)
//   src/app/apple-icon.png (180 × 180) y src/app/favicon.ico (16 + 32)
// a partir de src/app/icon.svg, las fuentes locales y los diccionarios.
// Uso: npm run brand   (requiere Google Chrome; ruta en CHROME_PATH si no es la de macOS)
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import puppeteer from "puppeteer-core";
import { renderToStaticMarkup } from "react-dom/server";
import { KitchenSvg } from "../../src/components/ui/KitchenSvg";
import { site } from "../../src/content/site";
import { getDictionary, locales } from "../../src/lib/i18n";

const ROOT = resolve(__dirname, "../..");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const font = (file: string) => `data:font/woff2;base64,${readFileSync(join(ROOT, "src/app/fonts", file)).toString("base64")}`;

const fontFaces = `
@font-face { font-family: "BC"; src: url(${font("barlow-condensed-700.woff2")}) format("woff2"); font-weight: 700; }
@font-face { font-family: "B"; src: url(${font("inter-variable.woff2")}) format("woff2"); font-weight: 100 900; }`;

function ogHtml(lang: "en" | "es") {
  const dict = getDictionary(lang);
  const kitchen = renderToStaticMarkup(<KitchenSvg mode="after" id="og" />);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaces}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #141210; color: #F7F1E8; position: relative; font-family: "B"; }
  .bg { position: absolute; inset: 0 0 0 420px; opacity: .55; }
  .bg svg { width: 100%; height: 100%; }
  .shade { position: absolute; inset: 0; background: radial-gradient(55% 70% at 80% 15%, rgba(242,182,109,.22), transparent 60%), linear-gradient(90deg, #141210 38%, rgba(20,18,16,.75) 62%, rgba(20,18,16,.35)); }
  .content { position: absolute; left: 72px; top: 64px; right: 72px; }
  .mark { font-family: "BC"; font-weight: 700; font-size: 190px; line-height: .82; letter-spacing: .01em; }
  .sub { margin-top: 14px; font-weight: 600; font-size: 22px; letter-spacing: .28em; color: #F2B66D; text-transform: uppercase; }
  .tag { margin-top: 44px; font-family: "BC"; font-weight: 700; font-size: 58px; line-height: 1; text-transform: uppercase; }
  .phone { margin-top: 18px; font-family: "BC"; font-weight: 700; font-size: 64px; color: #F2B66D; letter-spacing: .02em; }
  .plank { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; display: flex; align-items: center; padding-left: 72px; background: linear-gradient(100deg, #5a2d14, #8a4a22 40%, #6b361a 70%, #4E2512); color: #F7E6CF; font-family: "BC"; font-weight: 700; font-size: 28px; letter-spacing: .14em; text-transform: uppercase; }
  </style></head><body>
  <div class="bg">${kitchen}</div><div class="shade"></div>
  <div class="content">
    <div class="mark">${site.wordmark.mark}</div>
    <div class="sub">${site.wordmark.sub}</div>
    <div class="tag">${dict.og.tagline}</div>
    <div class="phone">${site.phones[lang].display}</div>
  </div>
  <div class="plank">${dict.hero.eyebrow}</div>
  </body></html>`;
}

// ICO con imágenes PNG embebidas (válido en todos los navegadores actuales).
function ico(pngs: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();

  for (const lang of locales) {
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(ogHtml(lang), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const out = join(ROOT, `public/og/og-${lang}.jpg`);
    await page.screenshot({ path: out, type: "jpeg", quality: 86 });
    console.log(`✓ ${out}`);
  }

  const svg = readFileSync(join(ROOT, "src/app/icon.svg"), "utf8");
  const render = async (size: number) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
    return Buffer.from(await page.screenshot({ type: "png", omitBackground: true }));
  };
  // apple-icon: sin transparencia ni esquinas (iOS aplica su propia máscara).
  await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">${svg.replace(/rx="96"/, 'rx="0"').replace("<svg ", '<svg width="180" height="180" ')}</body></html>`);
  writeFileSync(join(ROOT, "src/app/apple-icon.png"), Buffer.from(await page.screenshot({ type: "png" })));
  console.log("✓ src/app/apple-icon.png");
  writeFileSync(join(ROOT, "src/app/favicon.ico"), ico([{ size: 16, data: await render(16) }, { size: 32, data: await render(32) }]));
  console.log("✓ src/app/favicon.ico");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
