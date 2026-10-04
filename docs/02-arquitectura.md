# 02 · Arquitectura

## Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | **Next.js (App Router)**, versión estable más reciente | Rutas por idioma, Metadata API, camino directo a la fase 2 (API, citas, chatbot) |
| Lenguaje | TypeScript (strict) | Los diccionarios EN/ES se validan por tipo: si falta una traducción, el build falla |
| Estilos | Tailwind CSS v4 + tokens CSS en `globals.css` (`@theme`) | Rápido de iterar, CSS final pequeño |
| Fuentes | `next/font/local` con 3 `.woff2` dentro del repo (familia Barlow, ver `03`) | Sin dependencia de Google Fonts en el build, sin saltos de diseño (CLS), precarga automática |
| Animación | CSS (keyframes y transiciones) + un único `IntersectionObserver` | Sin librerías pesadas. Ver `03-diseno.md` |
| Iconos | SVG inline propios (componente `Icon`) | Sin librería de iconos |
| Imágenes | Componente propio `Photo` (`<picture>` con AVIF/WebP y `srcset`) + script `scripts/optimize-images.mjs` (sharp) que genera los tamaños | Con `output: "export"`, `next/image` no optimiza ni genera `srcset`. Ver "Imágenes" abajo |
| Lint | ESLint (config de Next) | |
| Control de versiones | git (se inicializa en T01) | Un commit por tarea del plan |

> Next.js 16+: antes de usar routing, metadata, `sitemap`/`robots`, fuentes o páginas 404, revisa `node_modules/next/dist/docs/`. Hay cambios incompatibles con versiones anteriores (por ejemplo, `middleware` ahora se llama `proxy`, y `themeColor` va en `viewport`, no en `metadata`).

## Configuración base (fase 1)

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",          // fase 1: sitio 100 % estático en /out
  trailingSlash: true,       // /en/ → /en/index.html (compatible con cualquier servidor)
  images: { unoptimized: true },
  poweredByHeader: false,
};
```

### Limitaciones del export estático (tenerlas presentes)

- **No hay `proxy`/`middleware`.** La detección de idioma en `/` la hace Caddy en la VPS, con un respaldo en el cliente (ver abajo).
- Las rutas dinámicas requieren `generateStaticParams()` y `export const dynamicParams = false`.
- `sitemap.ts` y `robots.ts` necesitan `export const dynamic = "force-static"`.
- No hay Route Handlers con POST: el formulario usa un servicio externo hasta la fase 2.
- **404:** el servidor sirve archivos; las páginas 404 por idioma se generan como páginas normales y Caddy las asigna (ver "Páginas 404").
- **Carpetas privadas:** en el App Router, una carpeta que empieza por `_` no genera ruta. No usar `_` en carpetas que deban ser páginas.

## Estructura de carpetas

```
.
├── CLAUDE.md
├── docs/                             # esta especificación
│   └── mockups/                      # maqueta aprobada (referencia visual) e imagen del mapa
├── assets/
│   ├── brand/                        # originales de marca (no se sirven)
│   └── photos/                       # fotos originales del dueño (no se sirven)
├── deploy/
│   ├── caddy/dhc.caddy               # sitio en Caddy: idioma en "/", 404 por idioma, caché, cabeceras
│   └── deploy.sh                     # build + rsync a la VPS (release + symlink)
├── scripts/
│   ├── optimize-images.mjs           # sharp: assets/photos → public/images (AVIF/WebP, varios anchos)
│   └── geo/                          # genera las zonas del mapa desde datos del censo (ver su README)
├── public/
│   ├── images/                       # fotos optimizadas (generadas por el script)
│   └── og/                           # imágenes Open Graph por idioma
├── src/
│   ├── app/
│   │   ├── fonts/                    # 3 .woff2 + OFL.txt (licencia)
│   │   ├── globals.css               # Tailwind + tokens de diseño
│   │   ├── icon.svg, apple-icon.png, favicon.ico
│   │   ├── global-not-found.tsx      # 404 global bilingüe → /404.html (experimental: requiere experimental.globalNotFound)
│   │   ├── (root)/                   # layout raíz propio solo para "/"
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # respaldo: detecta idioma → /en/ o /es/ (noindex)
│   │   ├── (site)/[lang]/            # layout raíz del sitio (<html lang>)
│   │   │   ├── layout.tsx            # fuentes, header, footer, JSON-LD, metadata, viewport
│   │   │   ├── page.tsx              # la landing (compone las secciones)
│   │   │   ├── not-found.tsx         # para notFound() dentro de [lang]
│   │   │   ├── page-not-found/page.tsx   # 404 por idioma que sirve Caddy (noindex)
│   │   │   ├── styleguide/page.tsx   # TEMPORAL (T05–T24), noindex, fuera del sitemap
│   │   │   └── [section]/[service]/page.tsx  # fase 1.5: páginas por servicio
│   │   ├── sitemap.ts                # force-static, con alternates hreflang
│   │   └── robots.ts                 # force-static
│   ├── components/
│   │   ├── layout/                   # Header, Footer, LanguageSwitch, MobileCtaBar, DemoBanner, SkipLink
│   │   ├── sections/                 # Hero, Marquee, Services, About, Process, Work, Reviews, Areas, Faq, Contact
│   │   ├── ui/                       # Button, Container, SectionHeading, Icon, Photo, PhotoPlaceholder, WoodGrain,
│   │   │                             # GlassCard, ServiceChips, ZigZag, BeforeAfterCard, KitchenSvg, AreaMapSvg
│   │   └── client/                   # SOLO componentes "use client"
│   ├── content/
│   │   ├── site.ts                   # datos del negocio (única fuente de verdad)
│   │   ├── area-map.ts               # paths SVG de las zonas del mapa (generado por scripts/geo)
│   │   ├── en.ts                     # textos EN (define el tipo Dictionary)
│   │   └── es.ts                     # textos ES (tipado como Dictionary)
│   └── lib/
│       ├── i18n.ts                   # locales, hasLocale, getDictionary, htmlLang, fill(), mapa de slugs
│       ├── seo.ts                    # helpers de metadata y alternates
│       └── schema.ts                 # generadores de JSON-LD
└── next.config.ts
```

Se usan dos **route groups** con layouts raíz independientes (`(root)` y `(site)`). Así `/[lang]` puede emitir `<html lang="en-US">` o `<html lang="es-US">` correctamente, y `/` tiene su propio HTML mínimo. Como no hay un `app/layout.tsx` común, la 404 global usa `global-not-found.tsx`. En Next 16 es **experimental**: hay que activar `experimental: { globalNotFound: true }` en `next.config.ts`, y el archivo importa sus propios estilos y fuentes porque no pasa por ningún layout (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`).

## Internacionalización

- Locales: `en` (por defecto) y `es`. Atributo `lang`: `en-US` y `es-US`.
- Rutas: `/en/` y `/es/`. En la fase 1.5, los slugs se traducen (`/en/services/custom-cabinets/` ↔ `/es/servicios/gabinetes-a-medida/`) con un mapa de equivalencias en `lib/i18n.ts`.
- `generateStaticParams` devuelve `[{lang:"en"},{lang:"es"}]` y `dynamicParams = false`.
- Diccionarios en TypeScript (no JSON) para tener tipos:
  - `en.ts` exporta el objeto **sin `as const`** y `export type Dictionary = typeof en`. Con `as const`, el tipo exigiría que `es.ts` tuviera exactamente los mismos textos en inglés.
  - `es.ts` se declara `const es: Dictionary = { … }`. Una clave que falte o sobre rompe el build.
- **Datos del negocio dentro de los textos:** los diccionarios nunca contienen teléfonos, correos ni años escritos a mano. Usan marcadores que se rellenan con `fill()` desde `site.ts`:

  ```ts
  // en.ts
  hero: { ctaCall: "Call {phone}" }
  // componente
  fill(dict.hero.ctaCall, { phone: site.phones[lang].display })
  ```

  Marcadores permitidos: `{phone}` (línea del idioma de la página), `{phoneEn}`, `{phoneEs}`, `{email}`, `{year}`, `{city}`. `fill()` lanza un error en build si falta un valor.
- **Teléfono por idioma:** `site.phones.en` y `site.phones.es` (cada uno con `display` y `e164`). En cada idioma, el CTA principal llama a la línea de ese idioma. El footer muestra las dos.
- Selector de idioma: enlace `<a hrefLang lang>` a la página equivalente (no un `<select>`), visible en el header y en el menú móvil.
- Anclas de sección traducidas (`#services` / `#servicios`), definidas en el diccionario.

### Redirección de `/`

Orden de preferencia:

1. **Caddy en la VPS** (principal). Lee la cabecera `Accept-Language` y responde con un 302:

   ```caddy
   @root_es {
       path /
       header_regexp Accept-Language ^\s*es
   }
   @root_other {
       path /
       not header_regexp Accept-Language ^\s*es
   }
   redir @root_es /es/ 302
   redir @root_other /en/ 302
   header / Vary Accept-Language
   ```

   Dos matchers con nombre que se excluyen entre sí: si se escribiera `redir / /en/`, Caddy lo ordenaría **antes** que el de español (prioriza los matchers de solo ruta) y todos acabarían en `/en/`.

2. **Respaldo en el cliente:** `(root)/page.tsx` con un script inline que lee `navigator.language` y hace `location.replace("/es/")` o `"/en/"`, con enlaces visibles a ambos idiomas para quien no tenga JS. Metadata `robots: { index: false, follow: true }`. Se usa en local (`npx serve out`) y si alguna vez se sirve sin Caddy.

`x-default` en hreflang apunta a `/en/`.

### Páginas 404

| Caso | Qué se sirve | Cómo |
|---|---|---|
| URL desconocida bajo `/en/` | `/en/page-not-found/index.html` con estado 404 | `handle_errors` en Caddy (ver Hosting) |
| URL desconocida bajo `/es/` | `/es/page-not-found/index.html` con estado 404 | Ídem |
| Cualquier otra URL | `/404.html` (bilingüe) | `global-not-found.tsx` + `handle_errors` |
| `notFound()` dentro de `[lang]` | `not-found.tsx` del idioma | Next |

Las páginas `page-not-found` llevan `noindex` y se excluyen del sitemap. Las tres comparten el mismo componente de contenido.

## Componentes cliente (lista cerrada)

Todo es Server Component salvo:

| Componente | Por qué necesita JS |
|---|---|
| `RevealObserver` | Un único `IntersectionObserver` que añade `.is-visible` a los `[data-reveal]` (incluida la entrada de las zonas del mapa), y anima contadores `[data-count]` |
| `ScrollStory` | Progreso de scroll de la sección Proceso → anima los grupos del SVG de la cocina (ver `03` → Firma). Un listener pasivo + `requestAnimationFrame` |
| `Carousel` | Avance automático, pausa (hover, foco, toque, tarjeta volteada, fuera de pantalla), controles y puntos (ver `03` → Carrusel). Una instancia por carrusel |
| `AreaMapHover` | Sincroniza el resaltado entre la lista de ciudades y las zonas del mapa. El mapa en sí es un Server Component |
| `HeaderScroll` | Cambia el estilo del header al hacer scroll (o se hace con CSS `animation-timeline` si el soporte es suficiente) |
| `MobileMenu` | Abrir/cerrar, bloqueo de scroll y foco atrapado |
| `EstimateForm` | Validación con mensajes en el idioma de la página, envío al servicio externo y estados de éxito/error |

Sin JS (a propósito):

- **Pausa del marquee:** `<input type="checkbox" role="switch">` con etiqueta, y CSS (`:has(:checked)`) que pausa la animación.
- **Volteo del antes/después:** checkbox oculto dentro del `<label>` + CSS.
- **Hover de una zona del mapa:** CSS `:hover` (la sincronización con la lista sí usa `AreaMapHover`).
- **Eventos de analítica:** atributos `data-umami-event` en enlaces y botones; el script de Umami los detecta solo.

Cualquier otro `"use client"` se discute antes de añadirlo.

## Imágenes

- Originales en `assets/photos/` con nombre descriptivo (`custom-kitchen-cabinets-austin.jpg`).
- `node scripts/optimize-images.mjs` genera en `public/images/` las versiones AVIF y WebP a 640, 960 y 1600 px de ancho, y un JSON con ancho y alto de cada una.
- `Photo` recibe `name`, `alt`, `sizes` y `priority`, y renderiza `<picture>` con `srcset`, `width`/`height` (sin CLS), `loading="lazy"` salvo con `priority` (que usa `fetchpriority="high"`).
- `PhotoPlaceholder` usa `Photo` cuando recibe una foto; si no, muestra el marcador. Mismo `aspect-ratio` en los dos casos.
- En la fase 2, `Photo` puede reimplementarse con `next/image` optimizado sin cambiar quién lo usa.

## Formulario (fase 1)

**Qué problema resuelve:** el sitio es estático (solo archivos HTML, CSS y JS; no hay programa corriendo en el servidor). Cuando alguien envía el formulario, algo tiene que recibir esos datos y mandarlos por correo al dueño. En la fase 1 eso lo hace un servicio externo; en la fase 2, nuestra propia API.

**Decisión: Web3Forms** (confirmada por Pablo). Plan gratuito, sin servidor propio, envía cada solicitud al correo del dueño (`I2`). Los límites del plan gratuito se verifican en T17. Alternativa: Formspree.

**Antispam:** los bots llenan formularios automáticamente y llenarían el correo del dueño de basura. Defensa en capas:

1. Campo *honeypot*: un campo oculto que las personas no ven y los bots sí rellenan. Si viene relleno, se descarta. Gratis e invisible.
2. El filtro de spam del propio proveedor.
3. Solo si aun así llega spam: un captcha invisible compatible con el proveedor.

**Campos:**

| Campo | Obligatorio | Notas |
|---|---|---|
| Nombre completo | Sí | |
| Teléfono | Sí | `type="tel"`, `autocomplete="tel"` |
| Correo | No | `type="email"` |
| Tipo de proyecto | Sí | Los 8 servicios + "Otro" |
| Ciudad o código postal | Sí | Para saber si está en la zona |
| Mensaje | No | |
| Idioma | — | Oculto, según la ruta |
| Honeypot | — | Oculto |

**Comportamiento:**

- Validación con los atributos nativos (`required`, `type`, `pattern`), pero los **mensajes salen del diccionario** vía `setCustomValidity`. Los mensajes nativos aparecen en el idioma del navegador, no en el de la página.
- Variables de entorno: `NEXT_PUBLIC_FORM_ENDPOINT` y `NEXT_PUBLIC_FORM_ACCESS_KEY`. La clave de Web3Forms es pública por diseño. En la fase 2, el endpoint pasa a `/api/estimate` sin tocar el componente.
- Aviso de consentimiento bajo el botón (texto en `04`).
- Si el envío falla: mensaje de error y CTA para llamar a la línea del idioma.

> Otra razón para usar un servicio externo: la VPS **no puede enviar correo** (netcup bloquea SMTP con la política "Mail Block", y no se quita).
>
> Con la VPS se podría adelantar la API propia de la fase 2. No se recomienda ahora: añade un proceso que mantener y vigilar, a cambio de poco beneficio.

## Analítica y conversiones

**Qué problema resuelve:** saber cuánta gente visita el sitio, de dónde viene, en qué idioma, y sobre todo **cuántos llaman o piden estimado** (las conversiones). Sin eso no se puede saber si el sitio funciona ni qué mejorar.

**Decisión (confirmada por Pablo):**

| Herramienta | Para qué | Coste |
|---|---|---|
| **Umami** autoalojado en la VPS (`stats.psalazar.dev`, Docker + Postgres) | Visitas, fuentes, idioma y eventos de conversión | Gratis. Script de ~2 KB. **Sin cookies → sin banner de cookies** |
| **Google Search Console** | Qué búsquedas muestran el sitio, posición, errores de indexación y hreflang | Gratis. Propiedad de tipo *prefijo de URL* (`https://dhc.psalazar.dev/`) verificada con un archivo HTML en `public/` (ver `05` §7) |
| Bing Webmaster Tools | Lo mismo para Bing (y otros buscadores que usan su índice) | Gratis |

Por qué no GA4: pesa mucho más (afecta al rendimiento, que es parte del SEO), usa cookies y para este sitio sobra.

- Script de Umami con `next/script`, `strategy="afterInteractive"` y `defer`.
- Eventos: `click_call_en`, `click_call_es`, `click_whatsapp`, `click_estimate_cta`, `form_submit_success`, `form_submit_error`, `click_language_switch`.
  - Clics: atributo `data-umami-event="click_call_en"` en el enlace. Sin JS propio.
  - Formulario: `window.umami?.track("form_submit_success")` dentro de `EstimateForm`.

## Hosting (VPS de Pablo)

### Datos

| | |
|---|---|
| Servidor | netcup VPS 500 G12 (Debian 13), IPv4 `152.53.39.211`. Es **la misma máquina que TTrack** (runbook: `~/Project/TTrack/SETUP-SERVIDOR.md`) |
| Acceso | SSH como `pablo` con el alias `ttrack` de `~/.ssh/config` (llave dedicada, `IdentitiesOnly yes`) |
| Dominio del sitio | **`dhc.psalazar.dev`** (subdominio de Pablo, decisión inicial; ver "Migración a un dominio propio") |
| Analítica | **`stats.psalazar.dev`** (Umami; sirve también para otros proyectos de Pablo) |
| DNS | Zona `psalazar.dev` en Cloudflare. Se gestiona con `~/Project/TTrack/tools/cf_dns.py` y el token de alcance mínimo de `~/.config/ttrack/cloudflare.token` (referencia: `~/Project/TTrack/docs/dns-y-credenciales.md`) |
| Servidor web | **Caddy**, el mismo que el runbook de TTrack prevé para su panel. Un solo servidor web en la máquina; cada proyecto en su propio archivo |
| TLS | Automático con Let's Encrypt (Caddy lo gestiona y renueva) |

### Convivencia con TTrack (reglas)

TTrack es un sistema que no se puede caer. DHC se monta sin poner eso en riesgo:

1. **No tocar** los registros `ttrack` ni `tel`, el puerto 4443 ni nada bajo `/opt/ttrack`.
2. **Caddy:** la config de DHC vive en `/etc/caddy/sites/dhc.caddy`, importada desde el `Caddyfile` principal (`import sites/*.caddy`). Antes de aplicar cualquier cambio: `caddy validate --config /etc/caddy/Caddyfile`. Luego `systemctl reload caddy` (recarga sin cortar conexiones), **nunca** `restart`.
3. **Cortafuegos:** solo se abren 80 y 443 (`ufw allow 80,443/tcp`). El 80 hace falta para el certificado y la redirección a HTTPS.
4. **Docker (Umami) y ufw:** Docker publica puertos saltándose ufw. Por eso Umami se publica **solo en `127.0.0.1`** (`127.0.0.1:3001:3000` en el compose) y Caddy hace de proxy. Con límites de memoria en el compose (la máquina tiene 4 GB y TTrack va primero).
5. Sin reinicios: las actualizaciones automáticas siguen **sin reinicio automático**, igual que en TTrack.
6. Los despliegues de DHC no necesitan root: `/var/www/dhc` pertenece a `pablo` y Caddy solo lee.

### DNS

Registros en **gris (DNS only)**, igual que `tel`:

```bash
python3 ~/Project/TTrack/tools/cf_dns.py add dhc A 152.53.39.211 --no-proxy
python3 ~/Project/TTrack/tools/cf_dns.py add stats A 152.53.39.211 --no-proxy
python3 ~/Project/TTrack/tools/cf_dns.py verify dhc 152.53.39.211
```

Por qué gris y no naranja:

- Caddy obtiene el certificado él mismo; con el proxy de Cloudflare habría dos TLS y más piezas que fallen.
- La redirección por `Accept-Language` en `/` depende de que nadie cachee ese 302 entre medias.
- La IP de la VPS ya es pública (por `tel`), así que el proxy no la ocultaría.
- Por ahora no hay registro AAAA (igual que `tel`). Si se añade, comprobar antes que Caddy y ufw atienden por IPv6.

> Recordatorio del doc de DNS de TTrack: después de crear un registro, contrastar con `dig @1.1.1.1` antes de darlo por roto (caché negativa del resolutor local).

### Configuración de Caddy

Plantilla en `deploy/caddy/dhc.caddy` (se crea en T04 y se completa en T22/T25). Esqueleto:

```caddy
dhc.psalazar.dev {
    root * /var/www/dhc/current
    encode zstd gzip

    # Idioma en "/"
    @root_es {
        path /
        header_regexp Accept-Language ^\s*es
    }
    @root_other {
        path /
        not header_regexp Accept-Language ^\s*es
    }
    redir @root_es /es/ 302
    redir @root_other /en/ 302
    header / Vary Accept-Language

    # Caché
    header /_next/static/* Cache-Control "public, max-age=31536000, immutable"
    @media path /images/* /og/* /fonts/*
    header @media Cache-Control "public, max-age=2592000"
    @html path *.html */
    header @html Cache-Control "no-cache"

    # Seguridad
    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        X-Frame-Options "DENY"
        -Server
    }

    file_server

    # 404 por idioma (file_server dentro de handle_errors conserva el estado 404)
    handle_errors {
        @404_en expression `{err.status_code} == 404 && {path}.startsWith("/en/")`
        @404_es expression `{err.status_code} == 404 && {path}.startsWith("/es/")`
        handle @404_en {
            rewrite * /en/page-not-found/index.html
            file_server
        }
        handle @404_es {
            rewrite * /es/page-not-found/index.html
            file_server
        }
        handle {
            rewrite * /404.html
            file_server
        }
    }
}

stats.psalazar.dev {
    reverse_proxy 127.0.0.1:3001
}
```

- Validar siempre con `caddy validate` antes de recargar. Instalar Caddy desde su repositorio oficial de apt (la versión de Debian se queda atrás).
- `Strict-Transport-Security` **sin** `includeSubDomains` ni `preload`: el resto de subdominios de `psalazar.dev` no deben verse afectados.
- Sin CSP en fase 1: Next y el JSON-LD usan scripts inline; se revisará en la fase 2.

### Despliegue (`deploy/deploy.sh`)

1. `npm ci && npm run lint && npm run build`.
2. `rsync -az --delete out/ ttrack:/var/www/dhc/releases/<fecha-hora>/` (el host SSH se puede cambiar con `DEPLOY_HOST`).
3. `ssh ttrack 'ln -sfn /var/www/dhc/releases/<fecha-hora> /var/www/dhc/current'` (cambio atómico; Caddy no necesita recargarse).
4. Conservar las últimas 5 releases. Volver atrás = apuntar `current` a la anterior.

### Requisitos previos en la VPS (T25)

- Pasos 0–7 del runbook de TTrack hechos (usuario `pablo`, llave SSH, `sshd` endurecido, ufw, actualizaciones sin reinicio).
- Caddy instalado (lo compartirán TTrack y DHC). Si TTrack ya lo instaló, solo se añade `sites/dhc.caddy`.
- Docker + compose para Umami.

### Migración a un dominio propio (futuro)

El subdominio es la decisión inicial. Si DHC pasa a tener su propio dominio:

1. Nuevo sitio en Caddy con el dominio nuevo y `site.url` actualizado (canonicals, sitemap, JSON-LD, OG).
2. `dhc.psalazar.dev` redirige **con 301, ruta por ruta**, al dominio nuevo (`redir https://NUEVO{uri} 301`). Mantener la redirección al menos un año.
3. Search Console: verificar el dominio nuevo y usar la herramienta de cambio de dirección. Actualizar el enlace en Google Business y en los directorios.

Cuanto antes se haga, menos posicionamiento se pierde: lo ideal es antes de dar de alta los directorios (`05` §7).

## Camino a la fase 2 (sin reescritura)

1. Quitar `output: "export"` e `images.unoptimized` en `next.config.ts`.
2. En la misma VPS: `next start` como servicio systemd en `127.0.0.1:3000`, con Caddy como proxy inverso (`reverse_proxy`). Se mantienen HTTPS, cabeceras y caché de `/_next/static/`.
3. Mover la redirección de idioma de Caddy a `proxy.ts` (o dejarla en Caddy).
4. Crear `app/api/estimate/route.ts` y apuntar `NEXT_PUBLIC_FORM_ENDPOINT` ahí.
5. Añadir las nuevas rutas (citas, chatbot) dentro de `(site)/[lang]/` usando los mismos diccionarios y componentes.
6. Opcional: reimplementar `Photo` con `next/image` optimizado.
