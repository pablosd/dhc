# 05 · SEO

Meta: aparecer en las búsquedas **locales** de carpintería en Austin, en inglés y en español. Para un negocio local, el SEO tiene dos patas: el **sitio** (este proyecto) y el **perfil de Google Business**, que se trabaja fuera del código y pesa mucho en el "map pack".

## 1. Palabras clave objetivo

### Inglés (`/en/`)

| Prioridad | Palabras clave |
|---|---|
| Principal | carpenter Austin TX · custom cabinets Austin · finish carpentry Austin |
| Servicios | kitchen remodeling Austin · cabinet installation Austin · wood ceiling / tongue and groove ceiling Austin · wood beams installation Austin · crown molding / trim carpenter Austin · door installation Austin · deck builder Austin · patio cover / pergola Austin · framing contractor Austin |
| Locales | carpenter near me · carpenter Round Rock / Cedar Park / Georgetown / Pflugerville… |
| Marca | DHC Woodcraft · DHC Woodcraft & Installation Austin |

### Español (`/es/`)

| Prioridad | Palabras clave |
|---|---|
| Principal | carpintero en Austin TX · carpintería en Austin · gabinetes a medida Austin |
| Servicios | remodelación de cocinas Austin · instalación de gabinetes · techos de madera / vigas de madera Austin · molduras y acabados · instalación de puertas · construcción de decks · terrazas y pérgolas · framing Austin |
| Diferenciador | carpintero que hable español en Austin · contratista hispano Austin |

Reglas: cada palabra clave principal aparece de forma natural en el H1/H2, en el texto y en el `title` o la `description`. Nada de relleno de palabras clave ni texto oculto.

En la landing compiten todas las palabras de "Servicios" a la vez; en la **fase 1.5** cada una tiene su propia página (ver §8).

## 2. Metadatos por idioma (`generateMetadata` en `(site)/[lang]/layout.tsx` o `page.tsx`)

Los textos viven en el diccionario (`meta.title`, `meta.description`) y los teléfonos se rellenan con `fill()`.

| Campo | EN | ES |
|---|---|---|
| `title` (≤ 60 car.) | Custom Carpentry & Cabinets in Austin, TX \| DHC Woodcraft (57) | Carpintería y Gabinetes a Medida, Austin TX \| DHC Woodcraft (59) |
| `description` (≤ 155 car.) | Custom cabinets, kitchen remodels, wood ceilings & beams, trim, doors, decks and framing in Austin, TX. Free estimates. Call {phone}. **[TODO D1]** | Gabinetes a medida, cocinas, techos y vigas de madera, molduras, puertas, decks y framing en Austin, TX. Estimados gratis. Llama al {phone}. **[TODO D1]** |
| `alternates.canonical` | `https://dhc.psalazar.dev/en/` | `https://dhc.psalazar.dev/es/` |
| `alternates.languages` | `{ "en-US": "/en/", "es-US": "/es/", "x-default": "/en/" }` | ídem |
| `openGraph` | type `website`, locale `en_US`, `alternateLocale: es_US`, imagen `/og/og-en.jpg` (1200×630) | locale `es_US`, imagen `/og/og-es.jpg` |
| `twitter` | `summary_large_image` | ídem |
| `metadataBase` | `new URL(site.url)` | |
| `robots` | index, follow (salvo `/`, `page-not-found` y `styleguide`, que son noindex) | |

Con el teléfono ya rellenado, las descripciones miden 140 (EN) y 147 (ES) caracteres.

Además:

- `<html lang="en-US">` / `<html lang="es-US">` desde el layout de `[lang]`.
- `themeColor: "#141210"` en **`export const viewport`** (o `generateViewport`), no en `metadata`: en Next 14+ `themeColor` dentro de `metadata` está obsoleto.
- Iconos en `src/app/`: `icon.svg`, `apple-icon.png` y `favicon.ico` (Next genera las etiquetas solo).

## 3. Datos estructurados (JSON-LD)

Se insertan como `<script type="application/ld+json">` en el layout de `[lang]` (ver `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`). Los ejemplos usan `dhc.psalazar.dev`; en el código todo sale de `site.url`. Se generan en `lib/schema.ts` a partir de `site.ts` y del diccionario del idioma. **Un campo sin dato confirmado se omite**, nunca se rellena con un valor de ejemplo.

### `HomeAndConstructionBusiness` (uno por página, en el idioma de la página)

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://dhc.psalazar.dev/#business",
  "name": "DHC Woodcraft & Installation",
  "legalName": "TODO A2",
  "slogan": "Custom Build • Install • Remodel",
  "url": "https://dhc.psalazar.dev/en/",
  "logo": "https://dhc.psalazar.dev/logo.png",
  "image": ["https://dhc.psalazar.dev/og/og-en.jpg"],
  "telephone": "+1-737-267-9565",
  "email": "TODO B3",
  "address": { "@type": "PostalAddress", "addressLocality": "Austin", "addressRegion": "TX", "addressCountry": "US" },
  "areaServed": [{ "@type": "City", "name": "Austin" }, { "@type": "City", "name": "Round Rock" }],
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+1-737-267-9565", "contactType": "customer service", "availableLanguage": ["English"] },
    { "@type": "ContactPoint", "telephone": "+1-737-400-1540", "contactType": "customer service", "availableLanguage": ["Spanish"] }
  ],
  "knowsLanguage": ["en", "es"],
  "openingHoursSpecification": "TODO B5",
  "sameAs": ["TODO G1, G2"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Carpentry services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Cabinets & Built-ins" } }
    ]
  }
}
```

- `telephone` de nivel superior: la línea del idioma de la página.
- `hasOfferCatalog` lista los servicios confirmados (`C1`) en el idioma de la página. En la fase 1.5, cada `Service` lleva `url` a su página.
- `address`: si hay dirección pública (`B4`), se añade `streetAddress` y `postalCode`. Si es un negocio que trabaja a domicilio, solo ciudad/estado + `areaServed` (`F1`). Debe coincidir con la configuración del perfil de Google Business.
- `logo`: se publica en `public/logo.png` cuando exista el logo definitivo (`H3`).
- **Omitidos hasta tener dato real:**
  - `geo`: unas coordenadas del centro de Austin serían falsas para un negocio que trabaja a domicilio. Solo con dirección pública.
  - `priceRange`: solo si `F3` lo confirma.
  - `aggregateRating` y `review`: solo con reseñas reales y verificables.

### Otros

- `WebSite` con `name`, `url` e `inLanguage`.
- `FAQPage` con las preguntas visibles de la sección (solo las publicadas). Google ya casi no muestra los resultados enriquecidos de FAQ para este tipo de sitios, pero el marcado sigue siendo válido y ayuda a que se entienda el contenido. Su texto debe coincidir exactamente con el visible (con los teléfonos ya rellenados).
- Fase 1.5: `Service` + `BreadcrumbList` en cada página de servicio.

Validación: Rich Results Test y validator.schema.org sin errores.

## 4. Sitemap y robots

```ts
// app/sitemap.ts
export const dynamic = "force-static";
// Entradas /en/ y /es/ (y en fase 1.5, cada página de servicio),
// cada una con alternates.languages { en-US, es-US, x-default }.
// Excluidas: "/", page-not-found, styleguide.
```

```ts
// app/robots.ts
export const dynamic = "force-static";
// allow: "/", sitemap: `${site.url}/sitemap.xml`
```

## 5. SEO on-page (checklist)

- [ ] Un único H1 por página, que incluya servicio + "Austin, TX".
- [ ] Jerarquía H2/H3 correcta (una H2 por sección).
- [ ] Texto real indexable para cada servicio: que no esté solo en imágenes ni se cargue con JS.
- [ ] Enlaces de anclas con texto descriptivo.
- [ ] `alt` descriptivo en cada imagen y en su idioma ("Custom walnut kitchen cabinets installed in Austin, TX").
- [ ] Teléfonos como enlaces `tel:` y en texto (NAP visible en el footer).
- [ ] NAP **idéntico** en el sitio, Google Business y los directorios.
- [ ] Enlaces `hreflang` recíprocos entre `/en/` y `/es/` (en `<head>` y en el sitemap).
- [ ] Nombres de archivo de imagen descriptivos (`custom-kitchen-cabinets-austin.avif`).
- [ ] Página 404 propia por idioma, servida con estado HTTP 404 (Caddy, ver `02`).
- [ ] Un único host canónico (`dhc.psalazar.dev`) y HTTPS; HTTP redirige con 301 (Caddy lo hace solo).

## 6. Rendimiento (también es SEO)

Presupuesto por página:

| Métrica | Objetivo |
|---|---|
| JS propio (sin el runtime de Next) | ≤ 15 KB gzip |
| JS de terceros | Solo Umami (~2 KB), con `defer` |
| CSS | ≤ 30 KB gzip |
| Fuentes | 3 archivos woff2 (ver `03`), precarga solo de Barlow Condensed 700 y Barlow 400 |
| Imagen LCP | ≤ 200 KB, con `priority` |
| Lighthouse móvil | Perf ≥ 90 · SEO 100 · A11y ≥ 95 · BP ≥ 95 |
| CWV | LCP < 2.5 s · CLS < 0.1 · INP < 200 ms |

Sin iframes de terceros en la carga inicial (mapas, redes, chat).

Notas de la maqueta aprobada:

- **Imagen LCP:** la foto de fondo del hero (cuando exista) lleva `priority`; mientras sea ilustración, es SVG inline ligero.
- **Mapa:** SVG inline de ~16 KB generado en el servidor; los nombres de las ciudades también van como lista HTML en la tarjeta (texto indexable).
- **Carruseles:** todas las diapositivas están en el HTML; el JS solo controla el desplazamiento.
- **Cocina del Proceso:** SVG inline; el estado final está en el HTML (sin JS se ve completa).
- `backdrop-filter` solo en tarjetas (coste de pintado en móviles).

## 7. SEO fuera del sitio (tareas del negocio, no de código)

En orden de impacto:

1. **Google Business Profile**: crearlo o verificarlo, con la categoría principal *Carpenter* y secundarias (*Cabinet maker*, *Deck builder*, *Remodeler*…), los servicios, el área de servicio, el horario, fotos reales y el enlace al sitio.
2. **Reseñas reales**: pedir a cada cliente satisfecho una reseña en Google (enlace directo corto y código QR en la tarjeta).
3. **Directorios con NAP consistente**: Bing Places, Apple Business Connect, Yelp, Nextdoor, Houzz, Angi, BBB y Facebook.
4. **Search Console y Bing Webmaster Tools**: enviar el sitemap y revisar hreflang y la cobertura. Con el subdominio se usa una propiedad de tipo **prefijo de URL** (`https://dhc.psalazar.dev/`) verificada con el archivo HTML que da Google, en `public/`. No se usa la propiedad de dominio `psalazar.dev` (por DNS): daría acceso a los datos de todos los subdominios de Pablo y complicaría entregar la propiedad al dueño. Bing permite importar la propiedad desde Search Console.
5. Publicar fotos de proyectos con regularidad (en GBP e Instagram).

## 8. Fase 1.5 · Páginas por servicio

### Mapa de slugs (en `lib/i18n.ts`)

Ruta: `(site)/[lang]/[section]/[service]/page.tsx`. `generateStaticParams` devuelve solo las combinaciones válidas (`en` + `services` + slug EN, `es` + `servicios` + slug ES) y `dynamicParams = false`.

| id | EN | ES | Palabra clave principal (EN / ES) |
|---|---|---|---|
| `cabinets` | `/en/services/custom-cabinets/` | `/es/servicios/gabinetes-a-medida/` | custom cabinets Austin / gabinetes a medida Austin |
| `kitchens` | `/en/services/kitchen-remodeling/` | `/es/servicios/remodelacion-de-cocinas/` | kitchen remodeling Austin / remodelación de cocinas Austin |
| `ceilings` | `/en/services/wood-ceilings-beams/` | `/es/servicios/techos-y-vigas-de-madera/` | wood ceiling beams Austin / techos de madera Austin |
| `trim` | `/en/services/trim-molding/` | `/es/servicios/molduras-y-acabados/` | trim carpenter Austin / molduras Austin |
| `doors` | `/en/services/door-installation/` | `/es/servicios/instalacion-de-puertas/` | door installation Austin / instalación de puertas Austin |
| `decks` | `/en/services/decks-patios/` | `/es/servicios/decks-y-terrazas/` | deck builder Austin / construcción de decks Austin |
| `framing` | `/en/services/framing/` | `/es/servicios/framing/` | framing contractor Austin / framing Austin |
| `general` | `/en/services/general-carpentry/` | `/es/servicios/carpinteria-general/` | carpenter Austin / carpintero en Austin |

Solo se publican las páginas de los servicios confirmados en `C1`.

### Requisitos por página

- `title` y `description` propios; canonical propio; hreflang recíproco con su par en el otro idioma.
- Contenido según `04` → Fase 1.5 (500–900 palabras útiles, fotos reales del servicio, FAQ propia).
- Schema `Service` (con `provider` → `#business` y `areaServed`) + `BreadcrumbList` (Inicio → Servicios → Servicio).
- Enlaces internos: desde la tarjeta del servicio en la landing y desde el footer; cada página enlaza a 2–3 servicios relacionados y al formulario.
- Sin fotos reales ni contenido propio, la página no se publica: una página vacía o duplicada perjudica más de lo que ayuda.
