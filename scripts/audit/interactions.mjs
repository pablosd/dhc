// Comportamiento: menú móvil (foco atrapado), barra móvil, antes/después, mapa y formulario (Web3Forms simulado).
import { launch, newPage, open, sleep, checker, web3formsMock, ANCHORS } from "./lib.mjs";

async function mobileMenu(browser, c) {
  const page = await newPage(browser, { width: 360, height: 740 });
  await open(page, "/en/");
  await page.keyboard.press("Tab");
  c.expect(/skip/i.test(await page.evaluate(() => document.activeElement.textContent)), "menú: el primer Tab no llega al enlace «saltar al contenido»");
  await page.click(".menu-button[aria-controls]");
  await sleep(200);
  const opened = await page.evaluate(() => ({
    expanded: document.querySelector(".menu-button[aria-controls]").getAttribute("aria-expanded"),
    hidden: document.getElementById("mobile-menu").hidden,
  }));
  c.expect(opened.expanded === "true" && !opened.hidden, "menú: no se abre");
  const count = await page.$$eval("#mobile-menu a[href], #mobile-menu button", (els) => els.length);
  const first = await page.evaluate(() => document.activeElement.outerHTML);
  for (let i = 0; i < count; i++) await page.keyboard.press("Tab");
  c.expect((await page.evaluate(() => document.activeElement.outerHTML)) === first, "menú: el foco se escapa (no vuelve al primero)");
  await page.keyboard.press("Escape");
  await sleep(100);
  const closed = await page.evaluate(() => ({
    hidden: document.getElementById("mobile-menu").hidden,
    focusOnButton: document.activeElement.matches(".menu-button[aria-controls]"),
  }));
  c.expect(closed.hidden, "menú: Escape no lo cierra");
  c.expect(closed.focusOnButton, "menú: el foco no vuelve al botón al cerrar");
  c.expect(!page.errors.length, `menú: errores ${JSON.stringify(page.errors)}`);
  await page.close();
}

async function mobileBar(browser, c) {
  const page = await newPage(browser, { width: 360, height: 740 });
  await open(page, "/en/");
  const bar = await page.$eval(".mobile-cta-bar", (b) => ({ display: getComputedStyle(b).display, call: b.querySelector("a").getAttribute("href") }));
  c.expect(bar.display !== "none", "barra móvil: no se ve en móvil");
  c.expect(bar.call.startsWith("tel:+1"), `barra móvil: enlace de llamada raro (${bar.call})`);
  await page.setViewport({ width: 1280, height: 800 });
  c.expect((await page.$eval(".mobile-cta-bar", (b) => getComputedStyle(b).display)) === "none", "barra móvil: se ve en escritorio");
  await page.close();
}

async function flip(browser, c) {
  const page = await newPage(browser, { width: 1440 });
  await open(page, "/en/");
  await page.evaluate((id) => document.getElementById(id).scrollIntoView(), ANCHORS.en.work);
  await sleep(800);
  const box = await page.$("#flip-en-0");
  if (!box) return c.fails.push("antes/después: no existe #flip-en-0"), page.close();
  await page.click("#flip-en-0 + .flip-inner");
  await sleep(400);
  c.expect(await page.$eval("#flip-en-0", (e) => e.checked), "antes/después: el clic no voltea la tarjeta");
  await page.close();
}

async function areaMap(browser, c) {
  const page = await newPage(browser, { width: 1440 });
  await open(page, "/es/");
  await page.evaluate((id) => document.getElementById(id).scrollIntoView(), ANCHORS.es.areas);
  await sleep(1600);
  // una zona atendida (está en la lista) cuyo centro no quede bajo la tarjeta de vidrio
  const hit = await page.evaluate(() => {
    const listed = new Set([...document.querySelectorAll(".city-list li[data-city]")].map((li) => li.dataset.city));
    for (const g of document.querySelectorAll(".area-zone[data-city]")) {
      if (!listed.has(g.dataset.city)) continue;
      const r = g.getBoundingClientRect();
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      if (g.contains(document.elementFromPoint(x, y))) return { city: g.dataset.city, x, y };
    }
    return null;
  });
  if (!hit) return c.fails.push("mapa: ninguna zona es accesible con el ratón"), page.close();
  const { city, ...box } = hit;
  const item = await page.$(`.city-list li[data-city="${city}"]`);
  if (!item) return c.fails.push(`mapa: ${city} no está en la lista`), page.close();
  await page.mouse.move(box.x, box.y);
  await sleep(300);
  c.expect(await item.evaluate((li) => li.classList.contains("is-on")), `mapa: pasar sobre la zona de ${city} no resalta la lista`);
  await page.close();
}

async function form(browser, c) {
  const id = ANCHORS.es.estimate;
  const fill = async (page) => {
    await page.type("[name=name]", "Prueba automática");
    await page.type("[name=phone]", "(737) 400-1540");
    await page.type("[name=city]", "Austin");
    await page.select("[name=project_type]", await page.$eval("[name=project_type] option:nth-child(2)", (o) => o.value));
  };
  const start = async (sent, ok) => {
    const page = await newPage(browser, { intercept: web3formsMock(sent, ok) });
    await open(page, "/es/");
    await page.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
    return page;
  };

  // vacío → no envía
  let sent = [];
  let page = await start(sent, true);
  await page.click(".estimate-form button[type=submit]");
  await sleep(200);
  c.expect(sent.length === 0, "formulario: se envió vacío");
  // correcto → mensaje de éxito
  await fill(page);
  await page.click(".estimate-form button[type=submit]");
  await sleep(800);
  c.expect(sent.length === 1, "formulario: no se envió con datos válidos");
  c.expect(await page.$(`#${id} .form-success`), "formulario: no muestra el mensaje de éxito");
  await page.close();
  // error del servicio → mensaje con teléfono
  sent = [];
  page = await start(sent, false);
  await fill(page);
  await page.click(".estimate-form button[type=submit]");
  await sleep(800);
  const err = await page.$eval(".form-error a", (a) => a.getAttribute("href")).catch(() => null);
  c.expect(err?.startsWith("tel:"), "formulario: el error no ofrece llamar");
  await page.close();
  // honeypot → no envía
  sent = [];
  page = await start(sent, true);
  await fill(page);
  await page.$eval("[name=botcheck]", (e) => { e.checked = true; });
  await page.click(".estimate-form button[type=submit]");
  await sleep(600);
  c.expect(sent.length === 0, "formulario: el honeypot no frena el envío");
  await page.close();
}

export default async function interactions() {
  const c = checker("interacciones");
  const browser = await launch(["--lang=en-US"]);
  for (const t of [mobileMenu, mobileBar, flip, areaMap, form]) {
    try { await t(browser, c); } catch (e) { c.fails.push(`${t.name}: ${e.message}`); }
  }
  await browser.close();
  return c;
}
