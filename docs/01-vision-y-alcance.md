# 01 · Visión y alcance

## El negocio

**DHC Woodcraft & Installation** es una empresa de carpintería en **Austin, Texas**.
Lema de marca: **Custom Build • Install • Remodel**.

Atiende en dos idiomas, con una línea telefónica para cada uno:

| Idioma | Teléfono | Enlace `tel:` |
|---|---|---|
| English | (737) 267-9565 | `tel:+17372679565` |
| Español | (737) 400-1540 | `tel:+17374001540` |

### Servicios

Hay dos fuentes: la tarjeta de presentación y lo que contó Pablo. Esta es la lista unificada propuesta, **pendiente de confirmar con el dueño** (cuestionario `C1`–`C3`).

| # | id | Servicio (EN) | Servicio (ES) | Origen |
|---|---|---|---|---|
| 1 | `kitchens` | Kitchen Remodeling | Remodelación de cocinas | Pablo |
| 2 | `cabinets` | Custom Cabinets & Built-ins | Gabinetes a medida y empotrados | Tarjeta + Pablo |
| 3 | `ceilings` | Beams & Wood Ceilings | Vigas y techos de madera | Tarjeta (+ "techos" de Pablo, ver `C2`) |
| 4 | `trim` | Trim & Molding | Molduras y acabados | Tarjeta |
| 5 | `doors` | Doors | Puertas (instalación) | Tarjeta |
| 6 | `decks` | Decks & Patios | Decks y terrazas | Pablo |
| 7 | `framing` | Framing | Framing (estructura) | Pablo |
| 8 | `general` | General Carpentry | Carpintería general | Tarjeta |

## Objetivos

1. **Generar contactos calificados.** Las conversiones son: llamadas (`tel:`), envíos del formulario de estimado y, si se confirma (`B2`), mensajes por WhatsApp.
2. **Posicionar en búsquedas locales** en inglés y en español: "carpenter Austin", "custom cabinets Austin", "wood ceiling beams Austin", "carpintero en Austin", etc. (ver `05-seo.md`).
3. **Transmitir oficio y confianza.** Estética cálida y artesanal, coherente con el logo (negro, madera, luz cálida).
4. **Atender al público hispano** con contenido nativo en español y su propia línea telefónica.

### Métricas de éxito (primeros 3 meses en producción)

- Lighthouse móvil: Performance ≥ 90, SEO = 100, Accesibilidad ≥ 95, Best Practices ≥ 95.
- Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Indexación de `/en/` y `/es/` en Google Search Console, sin errores de hreflang.
- Medición de conversiones activa (clics en teléfono, formulario y WhatsApp).

## Fases

### Fase 1 — Landing (alcance actual)

- Una página por idioma: `/en/` y `/es/`. La raíz `/` envía al idioma del navegador; si no se puede detectar, a inglés.
- Secciones definidas en `04-contenido.md`.
- Formulario de estimado enviado mediante un servicio externo, porque el sitio es estático (ver "Decisiones" abajo).
- Botones de llamada por idioma y barra fija de llamar/estimado en móvil.
- SEO técnico completo (`05-seo.md`).
- Despliegue estático en la VPS de Pablo, en `https://dhc.psalazar.dev/`.

### Fase 1.5 — Páginas por servicio (tras publicar la landing)

Sigue siendo 100 % estático (no necesita servidor):

- Una página por servicio y por idioma, con slugs traducidos: `/en/services/custom-cabinets/` ↔ `/es/servicios/gabinetes-a-medida/` (mapa completo en `05`).
- Cada página con contenido propio (no copiado de la landing), fotos reales del servicio, FAQ específica y schema `Service` + `BreadcrumbList`.
- Es la palanca de SEO más fuerte después del perfil de Google Business: una sola página por idioma difícilmente posiciona 8 servicios distintos.
- Depende de las respuestas del cuestionario (`C`, `D`, `H1`): sin fotos ni detalles reales, las páginas quedarían vacías.

### Fase 2 — Funcionalidades (futuro, sin fecha)

- API propia de contacto (reemplaza al servicio externo).
- Sistema de citas para estimados a domicilio (calendario y confirmaciones).
- Chatbot de atención bilingüe.
- Posibles páginas por ciudad para ampliar el SEO local.

La arquitectura de las fases 1 y 1.5 debe permitir la fase 2 **sin reescribir componentes** (ver `02-arquitectura.md`).

### Fuera de alcance (fase 1)

- Blog / CMS.
- Panel de administración.
- Pagos en línea.
- Página de política de privacidad completa. En fase 1 basta con el aviso junto al formulario (ver `04`); si más adelante se usan Google Ads u otras herramientas con cookies, habrá que añadirla.

## Decisiones

### Tomadas

| Tema | Decisión | Detalle |
|---|---|---|
| Stack | Next.js (App Router) + TypeScript + Tailwind v4, export estático | `02` |
| Hosting | **VPS de Pablo** (la misma de TTrack), sirviendo `/out` con **Caddy** | `02` → Hosting |
| Dominio | **`dhc.psalazar.dev`** (subdominio de Pablo) como decisión inicial. DNS en Cloudflare, registro en gris | `02` → Hosting. Si DHC tiene dominio propio más adelante: `02` → Migración |
| Formulario | **Web3Forms** + *honeypot* antispam | `02` → Formulario |
| Analítica | **Umami** autoalojado en `stats.psalazar.dev` + Google Search Console | `02` → Analítica |
| Tipografía | Familia **Barlow**: Barlow Condensed 700 (títulos) + Barlow 400/600 (texto y etiquetas). 3 archivos. Sin serif | `03`. Se puede comparar con Inter en la styleguide (T05) |
| Páginas por servicio | Fase 1.5, estáticas | Arriba |
| Diseño visual | **Maqueta v1 aprobada** (4 oct 2026): cocina que se arma con el scroll, vidrio esmerilado, antes/después que se voltea en carrusel, reseñas en carrusel y mapa de zonas sin huecos | `03`, `docs/mockups/maqueta-v1.html` |

### A tener en cuenta

- **Subdominio:** sirve para empezar, pero el NAP y el enlace de Google Business apuntarán a un dominio de Pablo. Si el dueño quiere su propio dominio (`I1`), conviene migrar **antes** de dar de alta los directorios (`05` §7), para no tener que corregirlos todos.
- **Correo:** con un subdominio no hay correo `@dominio` del negocio. El formulario llega al correo del dueño (`I2`) y el correo público es el que él indique (`B3`).

## Datos pendientes y marcadores de posición

Todos los datos del negocio se piden en el **cuestionario** (`07-cuestionario-dueno.md`). Mientras no estén, se usan marcadores de posición **claramente identificables**:

- En `site.ts`, cada valor no confirmado lleva `// TODO(confirmar)` con el código de la pregunta (p. ej. `// TODO(confirmar) B3`).
- En `04-contenido.md`, los textos que dependen de una respuesta llevan `[TODO <código>]`. Si al publicar no hay respuesta, ese texto se quita o se reformula: no se inventa.
- `site.demoMode = true` muestra una franja discreta: "Vista previa — algunos datos son de ejemplo". Antes de publicar se cambia a `false`.
- Reseñas: solo de ejemplo y etiquetadas como tales. En producción se reemplazan por reseñas reales (Google Business Profile) o se oculta la sección.
- Fotos: marcadores con diseño (textura de madera e ícono del servicio). Nunca fotos de stock presentadas como trabajos de DHC.
- **Licencia:** en Texas no hay licencia estatal para carpintería ni contratistas generales. No se usa "licensed" salvo que el dueño tenga un registro real (`E1`).

### Lo imprescindible para publicar (★ del cuestionario)

| Dato | Preguntas | Afecta a |
|---|---|---|
| Nombre legal y significado de "DHC" | A1, A2 | Footer, schema, "Por qué DHC" |
| Teléfonos, WhatsApp, correo, dirección o zona, horario, tiempo de respuesta | B1–B6 | NAP, schema, contacto, FAQ |
| Servicios confirmados, "techos", fabricación propia | C1, C2, C5 | Servicios, SEO, textos de confianza |
| Estimado gratis, cotización por escrito, quién hace el trabajo, limpieza, garantía | D1–D4, D7 | Hero, "Por qué DHC", proceso, FAQ |
| Seguro / registro | E1 | Hero (trust 3), FAQ |
| Zonas de servicio | F1 | Zonas, schema `areaServed` |
| Google Business | G1 | Reseñas, `sameAs`, SEO local |
| Fotos reales y logo | H1, H3 | Galería, hero, header, favicon, OG |
| Dominio y correo de destino del formulario | I1, I2 | Despliegue, formulario |
| Cómo responde al formulario | J4 | Aviso de consentimiento |
