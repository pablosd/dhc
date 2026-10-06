// Utilidades comunes de la auditoría (puppeteer-core + Chrome del sistema).
import puppeteer from "puppeteer-core";

export const BASE = (process.env.BASE_URL || "http://localhost:4173").replace(/\/$/, "");
export const IS_PROD = !/localhost|127\.0\.0\.1/.test(BASE);
export const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const launch = (args = []) =>
  puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-first-run", ...args] });

/**
 * Abre una página que:
 * - bloquea Umami (la auditoría no debe contar visitas en producción),
 * - deja que `intercept(req)` responda peticiones concretas (devuelve true si la atendió),
 * - acumula errores de consola y excepciones en `page.errors`.
 */
export async function newPage(browser, { width = 1280, height = 900, reduced = false, intercept } = {}) {
  const page = await browser.newPage();
  const mobile = width < 700;
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  page.on("console", (m) => {
    // el script de Umami lo bloqueamos nosotros: su fallo de carga no cuenta
    if (m.type() === "error" && !m.location()?.url?.includes("stats.psalazar.dev")) page.errors.push(m.text());
  });
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("stats.psalazar.dev")) return req.abort();
    if (intercept && intercept(req)) return;
    req.continue();
  });
  return page;
}

export async function open(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
}

/** Respuesta simulada de Web3Forms (nunca se envía nada real). */
export const web3formsMock = (sent, ok = true) => (req) => {
  if (!req.url().includes("web3forms.com")) return false;
  sent.push(req.postData() || "");
  req.respond({
    status: ok ? 200 : 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    contentType: "application/json",
    body: JSON.stringify({ success: ok }),
  });
  return true;
};

/** Registro de fallos de un chequeo. */
export function checker(name) {
  const fails = [];
  return {
    name,
    fails,
    expect(cond, msg) { if (!cond) fails.push(msg); },
  };
}

// Anclas por idioma (deben coincidir con `anchors` de los diccionarios).
export const ANCHORS = {
  en: { estimate: "estimate", work: "work", areas: "areas" },
  es: { estimate: "estimado", work: "proyectos", areas: "zonas" },
};
