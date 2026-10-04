# 06 · Plan de implementación

Tareas en orden, para ejecutarlas **una por una con Claude Code**. Al terminar cada una:

1. Verifica su criterio de **Terminado**.
2. `npm run lint && npm run build` sin errores.
3. Marca `[x]` aquí y haz un commit (`feat(T03): …`).

Si una tarea requiere decidir algo que no está en `docs/`, para y consulta con Pablo.

**Referencia visual:** `docs/mockups/maqueta-v1.html` (aprobada el 4 oct 2026). Las tareas T05–T18 deben parecerse a ella; los detalles de comportamiento están en `03`.

Prompt sugerido para cada sesión de Claude Code:

> Lee `CLAUDE.md` y `docs/06-plan-de-implementacion.md`. Implementa la siguiente tarea pendiente (Txx) siguiendo los docs referenciados. Antes de escribir código, resume el enfoque en 3–5 líneas y espera mi OK.

---

## Bloque 0 · Datos del negocio (en paralelo con el desarrollo)

- [ ] **T00 · Cuestionario al dueño**
  Enviar `docs/07-cuestionario-dueno.md` (traducido si hace falta) junto con la lista de archivos. Al recibir respuestas, volcarlas según las "Notas para Pablo" del propio documento y actualizar su tabla de seguimiento.
  **Terminado:** todas las preguntas ★ respondidas o marcadas explícitamente como "no aplica".

## Bloque A · Fundaciones

- [x] **T01 · Crear el proyecto**
  `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`. Configurar `next.config.ts` según `02` (export estático, `trailingSlash`, `images.unoptimized`). Añadir `.nvmrc` con la versión LTS de Node. `git init`, `.gitignore` (incluye `/out`, `.env*.local`) y primer commit.
  ⚠️ La carpeta no está vacía y create-next-app 16+ genera su propio `CLAUDE.md`/`AGENTS.md`. Crea el proyecto en una carpeta temporal y mueve los archivos aquí, **conservando nuestro `CLAUDE.md`** y añadiéndole al final la línea `@AGENTS.md`.
  **Terminado:** `npm run build` genera `/out` sin errores y el repo tiene su primer commit.

- [x] **T02 · Estructura y route groups**
  Crear `(root)` y `(site)/[lang]` con sus layouts, `generateStaticParams` (`en`, `es`), `dynamicParams = false` y la estructura de carpetas de `02`. Borrar el contenido de ejemplo de create-next-app.
  **Terminado:** `/out/en/index.html` y `/out/es/index.html` existen, con `<html lang="en-US">` y `<html lang="es-US">` respectivamente.

- [x] **T03 · i18n y contenido**
  `lib/i18n.ts` (locales, `getDictionary`, `htmlLang`, `fill()`), `content/site.ts` (datos confirmados más `// TODO(confirmar) <código>` en el resto, `demoMode: true`, `phones.en` y `phones.es` con `display` y `e164`), y `content/en.ts` + `content/es.ts` con **todos** los textos de `04`. `en.ts` sin `as const` y `export type Dictionary = typeof en`; `es.ts` tipado como `Dictionary`. Los diccionarios usan marcadores (`{phone}`…) en lugar de datos del negocio.
  **Terminado:** si se borra una clave en `es.ts`, falla `tsc`. `fill()` falla en build si falta un valor. Ningún teléfono, correo ni año aparece escrito en los diccionarios.

- [x] **T04 · Redirección de `/`**
  `(root)/page.tsx` con detección de idioma en el cliente, enlaces de respaldo sin JS (textos `root.*`) y `noindex, follow`. Crear `deploy/caddy/dhc.caddy` con la redirección por `Accept-Language` de `02`.
  **Terminado:** con `npx serve out`, abrir `/` con el navegador en español lleva a `/es/`, y en cualquier otro idioma a `/en/`. La config pasa `caddy validate` (en local con `brew install caddy`, o en la VPS).

## Bloque B · Sistema de diseño

- [x] **T05 · Tokens, fuentes y estilos base** — hecho; **pendiente:** Pablo elige Barlow o Inter para el texto en `/en/styleguide/` (por defecto Barlow, como la maqueta)
  Paleta de `03` como variables CSS y tema de Tailwind (`@theme`). Fuentes Barlow Condensed 700, Barlow 400 y Barlow 600 (`.woff2` latin + `OFL.txt`) con `next/font/local`, escala tipográfica fluida, foco visible, `SkipLink`, `scroll-margin-top` y el bloque `prefers-reduced-motion`.
  Página temporal **`/en/styleguide/`** (no `_styleguide`: las carpetas con `_` no generan ruta), con `noindex` y fuera del sitemap. Muestra colores, tipografías y botones, y una comparación del texto en Barlow 400/600 frente a Inter para que Pablo elija. Es la única página exenta de la regla de diccionarios.
  **Terminado:** la styleguide se ve en `/en/styleguide/` y Pablo confirma la fuente del texto (la maqueta usa Barlow 400/600).

- [x] **T06 · Componentes UI e imágenes**
  `Container`, `SectionHeading` (eyebrow + H2 + lead), `Button` (variantes de `03`), `Icon` (8 iconos de línea para los servicios más teléfono, flecha, check, menú, cerrar, WhatsApp, pausa/play, anterior/siguiente), `Photo`, `PhotoPlaceholder` (veta de madera e icono; acepta foto), el patrón SVG `WoodGrain` y `GlassCard` (variantes de `03` → Vidrio esmerilado). Script `scripts/optimize-images.mjs` (sharp como devDependency) según `02` → Imágenes.
  **Terminado:** todos visibles en la styleguide, accesibles por teclado y con AA. El script procesa una imagen de prueba y `Photo` la muestra con `srcset` sin CLS.

- [x] **T07 · Animaciones base**
  CSS de `[data-reveal]` (variantes `up`, `fade` y `scale`, con `--delay`), el componente cliente `RevealObserver` con un único `IntersectionObserver`, contadores `[data-count]`, la cinta *marquee* con interruptor de pausa sin JS (`03` → Marquee accesible) y el componente cliente `Carousel` (`03` → Carrusel), probado en la styleguide.
  **Terminado:** las animaciones se ven al hacer scroll. El marquee se pausa con el interruptor, con el teclado y con hover. Con `prefers-reduced-motion` todo aparece sin movimiento. El JS propio pesa ≤ 15 KB gzip.

## Bloque C · Secciones (cada una en su componente de `components/sections/`)

- [x] **T08 · Header, menú móvil, selector de idioma y DemoBanner**
  Header fijo que cambia al hacer scroll, menú en el orden de la página, teléfono del idioma, CTA, `MobileMenu` accesible (foco atrapado, Esc, `aria-expanded`) y `LanguageSwitch` con `hrefLang` y `lang`.
- [x] **T09 · Hero + marquee**
  Fondo (foto real si la hay; si no, ilustración de cocina) con degradado, entrada escalonada, acento del H1 en `--glow`, CTA de estimado y de llamada, `GlassCard` con las dos líneas y el CTA. Trust 3 solo si `site.ts` confirma seguro.
- [x] **T10 · Servicios** (`ServiceChips` + 8 tarjetas con hover y reveal escalonado; solo los servicios activos en `site.ts`)
- [x] **T11 · Por qué DHC** (dos bloques `ZigZag`; estadísticas solo si `site.stats` tiene cifras confirmadas)
- [x] **T12 · Proceso: la cocina que se arma**
  `KitchenSvg` (Server Component, con los `data-*` de `03` → Firma), escenario `sticky`, paneles `GlassCard`, indicador de paso y el componente cliente `ScrollStory`. Partir de la cocina de la maqueta.
  **Terminado (además del común):** las 4 etapas coinciden con sus paneles; con `prefers-reduced-motion` y sin JS se ve la cocina terminada; scroll fluido en un móvil de gama media (sin tirones visibles en el perfil de rendimiento).
- [x] **T13 · Proyectos: antes y después** (`BeforeAfterCard` sin JS dentro de `Carousel`; ilustraciones de ejemplo hasta tener fotos)
- [x] **T14 · Reseñas** (`Carousel` de `ReviewCard`; aviso y etiquetas "de ejemplo" visibles mientras no haya reseñas reales)
- [x] **T15 · Zona de servicio: mapa**
  Adaptar `scripts/geo/` para generar `src/content/area-map.ts` (+ `npm run geo`), `AreaMapSvg` (Server Component), `GlassCard` superpuesta con lista de ciudades, leyenda y CTA, `AreaMapHover` y entrada con `RevealObserver`. Las ciudades atendidas salen de `site.ts`.
  **Terminado (además del común):** sin huecos entre zonas; el hover funciona en escritorio (la tarjeta no bloquea el mapa) y la lista resalta la zona; en móvil el mapa va arriba y la tarjeta encima de su parte baja.
- [x] **T16 · FAQ** (`<details>` animado con foto al lado en escritorio; solo preguntas con respuesta confirmada)
- [x] **T17 · Contacto + `EstimateForm`** — hecho; **pendiente:** clave de Web3Forms con el correo de destino (I2) para la prueba de envío real (`.env.local`, ver `.env.example`)
  Campos y obligatoriedad de `02`, validación nativa con mensajes del diccionario vía `setCustomValidity`, honeypot, `fetch` a `NEXT_PUBLIC_FORM_ENDPOINT` (Web3Forms), estados de enviando/éxito/error, idioma como campo oculto, aviso de consentimiento y `umami.track` en éxito/error. Columna lateral con los dos teléfonos. Verificar los límites del plan gratuito del proveedor.
  **Terminado (además del común):** con el navegador en inglés, los mensajes de validación de `/es/` salen en español. Un envío de prueba llega al correo de destino.
- [x] **T18 · Footer + `MobileCtaBar`**

**Terminado (para cada T08–T18):** se ve bien entre 360 y 1440 px, se puede usar con teclado, todos los textos salen del diccionario en los dos idiomas, las anclas no quedan tapadas por el header y no hay errores en consola.

## Bloque D · SEO

- [x] **T19 · Metadata por idioma**
  `generateMetadata` con title, description, canonical, `alternates.languages` (incluido `x-default`), Open Graph y Twitter. `metadataBase` desde `site.url`. `themeColor` en `export const viewport`.
  **Terminado:** el `<head>` de `/out/en/index.html` y de `/out/es/index.html` contiene canonical y hreflang recíprocos, y `<meta name="theme-color">`. Sin avisos de deprecación en el build.
- [x] **T20 · JSON-LD** — validado contra el vocabulario de schema.org y FAQ = texto visible; **pendiente:** Rich Results Test con la URL publicada (T24/T25)
  `lib/schema.ts`: `HomeAndConstructionBusiness` (con los dos `contactPoint` por idioma; sin `geo`, `priceRange` ni campos sin confirmar), `WebSite` y `FAQPage`.
  **Terminado:** el Rich Results Test y validator.schema.org no dan errores.
- [x] **T21 · `sitemap.ts` + `robots.ts`** (force-static, con alternates; excluye `/`, `page-not-found` y `styleguide`)
- [x] **T22 · Iconos, imágenes OG y páginas 404**
  `icon.svg`, `apple-icon.png`, `favicon.ico`, OG 1200×630 por idioma (textos de `04`). Páginas 404 según `02` → Páginas 404: `[lang]/page-not-found/`, `[lang]/not-found.tsx` y la 404 global bilingüe (`global-not-found.tsx` con `experimental.globalNotFound`; ver `02`). Añadir el bloque `handle_errors` a `deploy/caddy/dhc.caddy`.
  **Terminado:** existen `/out/404.html`, `/out/en/page-not-found/index.html` y `/out/es/page-not-found/index.html`, todas con `noindex`.

## Bloque E · Calidad y despliegue

- [ ] **T23 · Analítica y eventos de conversión** — código hecho (`components/layout/Analytics.tsx`, variables en `.env.example`, `data-umami-event` en llamadas, CTA, idioma y WhatsApp; `umami.track` en el formulario); **pendiente:** instalar Umami en la VPS, crear el sitio y verificar Search Console/Bing
  Umami (Docker + Postgres) en la VPS, publicado solo en `127.0.0.1:3001` y con límite de memoria; `stats.psalazar.dev` en Caddy y en DNS (gris). Script con `next/script` y atributos `data-umami-event` de `02`. Search Console con propiedad de prefijo de URL (archivo HTML en `public/`) y Bing Webmaster importando desde Search Console.
  ⚠️ Requiere que la VPS esté montada (T25, requisitos previos); si aún no lo está, hacer T23 después de T25.
  **Terminado:** en el panel de Umami aparecen una visita y cada uno de los eventos de prueba.
- [ ] **T24 · Auditoría**
  Lighthouse móvil en `/en/` y `/es/` (objetivos de `05`), axe sin violaciones serias, enlaces rotos, revisión del texto en español por un hablante nativo y **borrar la styleguide** (también `interFont` si no se eligió Inter, y la imagen de prueba `styleguide-test` de `public/images/` y de `src/content/images.json`).
- [ ] **T25 · Despliegue en la VPS**
  Seguir `02` → Hosting respetando las **reglas de convivencia con TTrack**. Comprobar los requisitos previos (runbook de TTrack, pasos 0–7). Instalar o reutilizar Caddy, añadir `sites/dhc.caddy` (validar y `reload`, nunca `restart`), `ufw allow 80,443/tcp`, crear `/var/www/dhc` (de `pablo`) y `deploy/deploy.sh`. DNS: `cf_dns.py add dhc A 152.53.39.211 --no-proxy` y `verify`. Enviar el sitemap a Search Console.
  **Terminado:** `https://dhc.psalazar.dev/` redirige según el idioma, `/en/xyz` devuelve 404 con la página en inglés, `curl -I` muestra las cabeceras de seguridad y caché, un despliegue nuevo se puede revertir cambiando el symlink y **TTrack sigue funcionando** (`systemctl status ttrack-poller` y las comprobaciones de `dns-y-credenciales.md` §5).
- [ ] **T26 · Salida de modo demo** (cuando estén los datos reales)
  Rellenar todos los `TODO(confirmar)`, quitar los textos `[TODO]` sin respuesta, poner fotos reales, quitar o reemplazar las reseñas de ejemplo, `demoMode: false` y volver a auditar.

## Bloque F · Fase 1.5 · Páginas por servicio (tras publicar)

- [ ] **T27 · Rutas de servicio**
  `(site)/[lang]/[section]/[service]/page.tsx`, mapa de slugs en `lib/i18n.ts` (`05` §8), `generateStaticParams` con solo las combinaciones válidas y `dynamicParams = false`. El selector de idioma enlaza al par traducido.
  **Terminado:** existen las 16 rutas (o las de los servicios confirmados) en `/out`, y `/en/servicios/…` no se genera.
- [ ] **T28 · Plantilla de página de servicio**
  Layout (H1, intro, qué incluye, materiales, proceso, galería, FAQ, CTA), metadata propia, schema `Service` + `BreadcrumbList`, entradas en el sitemap con alternates y enlaces internos desde la landing y el footer.
- [ ] **T29 · Contenido de los servicios**
  Redactar EN/ES con las respuestas del cuestionario (`C`, `D5`, `C10`, `K2`) y las fotos reales de cada servicio. Revisión por el dueño y por un hablante nativo.
  **Terminado:** solo se publican las páginas con contenido propio y fotos reales.
- [ ] **T30 · Auditoría de la fase 1.5** (Lighthouse, Rich Results, hreflang de cada par, enlaces rotos, envío del sitemap actualizado)

---

## Dependencias externas (bloquean la publicación, no el desarrollo)

| Necesitamos | Bloquea | Cuestionario / decisión |
|---|---|---|
| Logo vectorial / PNG transparente (o permiso para redibujarlo) | Header y favicon definitivos, OG | H3 |
| Dominio propio del negocio (opcional; de momento `dhc.psalazar.dev`) | Solo si se migra | I1 |
| Correo, dirección o zona y horario | NAP, schema, footer | B3–B5, F1 |
| Correo de destino del formulario | T17 en producción | I2 |
| VPS montada (runbook de TTrack, pasos 0–7) | T23, T25 | — |
| Fotos reales | Galería, hero, OG, fase 1.5 | H1 |
| Estimado gratis, cotización, garantía | Hero, CTAs, proceso, FAQ | D1, D2, D7 |
| Seguro / registro, cifras de confianza | Trust 3, estadísticas, FAQ | E1, A3, E3 |
| Reseñas reales / Google Business | Sección de reseñas, `sameAs` | G1–G3 |
