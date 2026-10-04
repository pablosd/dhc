# 03 · Diseño

## Dirección: cálido, artesanal y premium

El diseño parte del logo de DHC: **negro carbón, madera nogal, luz cálida de atardecer y piedra**. La sensación buscada es "casa bien construida al anochecer, con las luces encendidas": sólida, de oficio y acogedora. No queremos el aspecto genérico de constructora ni el de plantilla SaaS.

Original de referencia: `assets/brand/dhc-business-card.png`.

### Referencia visual aprobada

**Maqueta v1** (aprobada por Pablo el 4 oct 2026): `docs/mockups/maqueta-v1.html` (abrir en el navegador; copia del artifact privado https://claude.ai/artifact/NkBFFtL6RTWMqoZLDoUQLh). Es la referencia de aspecto y comportamiento para las tareas T05–T18. El código de la maqueta **no** se copia tal cual: se reimplementa con los componentes, diccionarios y reglas de estos docs.

Ideas tomadas (adaptadas) de un sitio de referencia que gustó a Pablo (chooseaccent.com, página de remodelación de cocinas): caja translúcida sobre la foto del hero, barra de sub-servicios, bloques alternados texto/foto, antes/después que se voltea, CTA en panel de vidrio sobre imagen y FAQ con foto al lado.

## Paleta (tokens en `globals.css`)

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#141210` | Texto principal, fondos oscuros (hero, proceso, contacto) |
| `--ink-soft` | `#2A2622` | Superficies oscuras secundarias (footer) |
| `--walnut` | `#7A3E1D` | Color de marca: botones, enlaces, acentos |
| `--walnut-deep` | `#4E2512` | Hover/pressed de botones |
| `--oak` | `#B8692F` | Detalles decorativos, iconos, bordes destacados |
| `--glow` | `#F2B66D` | Luz cálida: halos, brillos y acentos sobre fondo oscuro |
| `--cream` | `#F7F1E8` | Fondo principal claro |
| `--paper` | `#FFFFFF` | Tarjetas |
| `--stone` | `#A39B91` | Texto secundario sobre oscuro (`ink` e `ink-soft`), separadores |
| `--line` | `#E4DACB` | Bordes y divisores sobre claro (decorativo, no para texto) |
| `--muted` | `#5E554C` | Texto secundario sobre claro |

### Contraste (calculado, WCAG AA)

| Combinación | Ratio | Uso permitido |
|---|---|---|
| `--walnut` sobre `--cream` | 7.4 | Texto y enlaces |
| Blanco sobre `--walnut` | 8.3 | Texto de botones |
| `--muted` sobre `--cream` | 6.5 | Texto secundario |
| `--cream` sobre `--ink-soft` | 13.4 | Texto principal en el footer |
| `--stone` sobre `--ink` / `--ink-soft` | 6.8 / 5.5 | Texto secundario sobre oscuro |
| `--glow` sobre `--ink` | 10.4 | Texto y acentos sobre oscuro, cualquier tamaño |
| `--oak` sobre `--ink` | 4.5 | Justo en el límite: solo texto grande (≥ 24 px) o decoración |
| `--oak` sobre `--cream` | 3.7 | Solo texto grande (≥ 24 px) o decoración |
| `--walnut` sobre `--ink` | 2.3 | **Nunca** para texto |

> `--stone` era `#8E877E`, pero sobre `--ink-soft` daba 4.2 (no pasaba AA). Se aclaró a `#A39B91`.

Solo tema claro con secciones oscuras alternadas. Por ahora no hay modo oscuro automático.

## Tipografía

**Decisión:** una sola familia, **Barlow**, coherente con el "WOODCRAFT & INSTALLATION" del logo. Sin serif. Tres archivos en total.

| Rol | Fuente | Archivo |
|---|---|---|
| Display / títulos (H1–H3), números de estadísticas | **Barlow Condensed 700** | `barlow-condensed-700.woff2` |
| Texto | **Barlow 400** | `barlow-400.woff2` |
| Eyebrows, botones, etiquetas, negritas | **Barlow 600** (eyebrows en MAYÚSCULAS, `letter-spacing: .18em`, como "CUSTOM BUILD • INSTALL • REMODEL") | `barlow-600.woff2` |

- Origen: Google Fonts / Fontsource (licencia SIL OFL; se incluye `OFL.txt` junto a los archivos). Subconjunto **latin**, que incluye á, é, í, ó, ú, ñ, ü, ¿ y ¡.
- Carga con `next/font/local`. Precarga solo de Barlow Condensed 700 (la del H1) y Barlow 400.
- **Sin cursivas:** no se carga ninguna itálica y el navegador las falsearía. El acento emotivo del H1 ("*built to last*") se hace con **color `--glow`**, no con cursiva.
- Escala fluida con `clamp()`: H1 `clamp(2.6rem, 6vw, 5rem)`, H2 `clamp(2rem, 4vw, 3.2rem)`, H3 `1.5rem`, texto `1.0625rem` con `line-height: 1.6`.
- **Alternativa a comparar en T05:** Inter (variable) para el texto en lugar de Barlow 400/600. La styleguide muestra las dos para decidir viendo algo real. Si se elige Inter, el total sigue siendo 3 archivos (Barlow Condensed 700 + Barlow 600 + Inter variable).

## Logo

- Header: emblema "DHC" + "Woodcraft & Installation". **Requiere logo en vector o PNG transparente** (`H3`). El de la tarjeta es una imagen muy detallada (casa, madera, cocina) que no escala bien a tamaño de header ni de favicon. Lo más probable es que haya que **redibujar una versión simplificada en vector**.
- Mientras tanto, un *wordmark* temporal en texto: "DHC" en Barlow Condensed 700 y debajo "WOODCRAFT & INSTALLATION" en Barlow 600 pequeño.
- Favicon / `icon.svg`: monograma "DHC" sobre fondo `--ink`.
- **No** usar la tarjeta completa (con teléfonos) como logo en la web.

## Layout y ritmo

- Contenedor máximo 1200 px, márgenes laterales de 20 px en móvil y 32 px en escritorio.
- Secciones con mucho aire (`py` de 80 a 128 px), alternando fondos según `04`.
- Mobile-first: todo funciona desde 360 px de ancho, sin scroll horizontal.
- Retícula de 12 columnas en escritorio.
- **Anclas y header fijo:** cada sección lleva `scroll-margin-top` igual a la altura del header (más la del DemoBanner mientras exista), para que el título no quede tapado al navegar por anclas.

### Detalles de oficio (lo que distingue el diseño)

- **Veta de madera sutil:** patrón SVG ligero (líneas curvas finas) como textura de fondo en algunas tarjetas o separadores, con opacidad ≤ 6 %.
- **"Tabla" de madera para el lema:** franja con gradiente nogal inclinado, como la barra "CUSTOM BUILD • INSTALL • REMODEL" de la tarjeta, usada en el hero o como separador.
- **Luz cálida:** halos radiales `--glow` muy difusos en las secciones oscuras, como las luces empotradas del alero del logo.
- **Iconos de línea propios** para cada servicio (gabinete, puerta, moldura, cercha/viga, deck, cocina, framing, martillo), con trazo de 1.75 px y esquinas redondeadas. Se toman como referencia los iconos de la tarjeta, pero en versión de línea.

## Accesibilidad (obligatorio en todos los componentes)

- HTML semántico: `header`, `nav`, `main`, `section` con `aria-labelledby` al H2, `footer`.
- **Skip link** "Saltar al contenido" como primer elemento enfocable, visible al recibir foco, que lleva a `<main id="main">`.
- Foco visible en todo elemento interactivo: contorno de 2 px `--glow` sobre oscuro y `--walnut` sobre claro, con `outline-offset: 3px`.
- Objetivos táctiles de al menos 48 × 48 px.
- `prefers-reduced-motion: reduce` desactiva todas las animaciones (ver abajo).
- Contrastes según la tabla de arriba.
- Iconos decorativos con `aria-hidden="true"`; iconos que son el único contenido de un botón llevan `aria-label` del diccionario.

## Componentes clave

| Componente | Descripción |
|---|---|
| `SkipLink` | Enlace "Saltar al contenido", oculto hasta recibir foco |
| `GlassCard` | Panel de vidrio esmerilado (ver "Vidrio esmerilado") |
| `Header` | Fijo. Transparente sobre el hero y con fondo sólido (`--ink` al 90 % + blur) tras hacer scroll. Logo, navegación, selector EN/ES, teléfono del idioma y botón "Free Estimate" |
| `Button` | Variantes: `primary` (nogal), `light` (crema sobre oscuro), `ghost`, `call` (con icono de teléfono). Altura mínima de 48 px |
| `ServiceChips` | Fila de "chips" con los servicios bajo el encabezado de Servicios (idea de la barra de sub-servicios). En la fase 1.5 enlazan a cada página de servicio |
| `ServiceCard` | Icono, título, texto, 3 viñetas y enlace "Ver más →" (fase 1.5). Hover: elevación suave, borde `--oak` y el icono "se dibuja" |
| `ZigZag` | Bloques texto + foto alternados (sección "Por qué DHC") |
| `ScrollStory` | Cocina que se arma con el scroll en la sección Proceso (ver "Firma") |
| `BeforeAfterCard` | Tarjeta que se voltea al pasar el mouse (ver "Antes y después") |
| `Carousel` | Carrusel con avance automático (ver "Carrusel") |
| `AreaMap` | Mapa de zonas de servicio con la tarjeta de vidrio encima (ver "Mapa") |
| `Photo` | `<picture>` con AVIF/WebP y `srcset` (ver `02` → Imágenes) |
| `PhotoPlaceholder` | Marcador honesto: textura de veta, icono del servicio y etiqueta "Foto del proyecto". Acepta una foto real (vía `Photo`) sin cambiar el layout (`aspect-ratio` fijo) |
| `StatCounter` | Número grande en Barlow Condensed con contador animado. **Solo con cifras reales** (`A3`, `E3`). Si no las hay, la sección no se muestra |
| `ReviewCard` | Cita, estrellas, nombre, zona y tipo de proyecto. Si son de ejemplo, lleva una etiqueta visible "Reseña de ejemplo" |
| `FaqItem` | `<details>/<summary>` nativo con animación de altura. La sección lleva una foto al lado de las preguntas en escritorio |
| `Marquee` | Cinta de servicios con interruptor de pausa (ver Animaciones) |
| `MobileCtaBar` | Barra fija inferior solo en móvil: [Llamar] [Estimado gratis] |
| `DemoBanner` | Franja superior mientras `site.demoMode === true` |

## Animaciones

Principios: **sutiles, rápidas y con propósito**. Solo se animan `transform` y `opacity`. Todo se desactiva con `prefers-reduced-motion: reduce`.

| Dónde | Animación | Duración |
|---|---|---|
| Hero (carga) | Entrada escalonada: eyebrow → título → texto → CTAs → tarjeta de vidrio (fade + translateY 16 px) | 600 ms, *stagger* de 80 ms |
| Marquee de servicios | Cinta horizontal infinita bajo el hero ("Cabinets • Doors • Trim & Molding • …") | 40 s/vuelta |
| Secciones | *Reveal* al entrar en el viewport (`[data-reveal]`), con variantes `up`, `fade` y `scale` | 500–700 ms |
| Estadísticas | Contador de 0 a la cifra al entrar en pantalla | 1.2 s, *ease-out* |
| Tarjetas | Hover: `translateY(-4px)` + sombra + trazo del icono | 200 ms |
| Proceso | **Cocina que se arma** detrás de paneles de vidrio (ver "Firma") | según scroll |
| Antes y después | Giro 3D de la tarjeta al pasar el mouse, tocar o pulsar Enter | 800 ms |
| Carruseles | Avance automático con barra de tiempo; desplazamiento suave | 5–6 s por diapositiva |
| Mapa | Las zonas aparecen una a una al entrar en pantalla; hover ilumina la zona en `--glow` | 600 ms, *stagger* de 60 ms |
| Header | Transición de transparente a sólido | 250 ms |

### Marquee accesible

WCAG 2.2.2 exige poder pausar cualquier movimiento continuo de más de 5 s, y el hover no sirve en táctil ni con teclado:

- Interruptor visible "Pausar animación / Reanudar animación": `<input type="checkbox" role="switch">` con etiqueta. CSS con `:has(:checked)` pone `animation-play-state: paused`. Sin JS.
- También se pausa con `:hover` y `:focus-within`.
- La lista se duplica para el bucle continuo; la copia lleva `aria-hidden="true"` para que los lectores de pantalla no la lean dos veces.
- Con `prefers-reduced-motion`, la cinta queda estática (y con ajuste de línea si no cabe).

Curva estándar: `cubic-bezier(.2,.7,.2,1)`. Nada de *parallax* con fotos ni librerías de animación: todo es CSS + JS propio pequeño.

## Firma: la cocina que se arma (sección Proceso)

El elemento más distintivo del sitio. El fondo de la sección queda fijo (`position: sticky`, alto de la pantalla) y muestra una cocina en **ilustración SVG de línea** que se construye según el scroll, mientras los paneles de los pasos pasan por encima.

| Paso (panel) | Lo que ocurre al fondo | Progreso |
|---|---|---|
| Intro | Rejilla de plano | 0 |
| 1 · Estimado gratis | Se dibuja el contorno de pared y piso; aparecen las cotas en pies y pulgadas | 0–0.2 |
| 2 · Diseño y cotización | Módulos en línea punteada (diseño) | 0.2–0.4 |
| 3 · Fabricación e instalación | Suben los gabinetes bajos, cae la cubierta, aparece el azulejo, bajan las alacenas y la campana | 0.4–0.75 |
| 4 · Revisión final | Puertas y herrajes, el relleno de madera sustituye a las líneas, techo machihembrado con vigas y lámparas que se encienden (halo `--glow`) | 0.75–1 |

- Indicador fijo arriba a la izquierda: "Paso X de 4", barra de progreso y qué se está construyendo.
- **Implementación:** el SVG se genera en el servidor (Server Component). Cada grupo lleva `data-s`/`data-e` (ventana de progreso) y opcionalmente `data-dy` (desplazamiento), `data-draw` (trazo) o `data-out` (desvanecer). El componente cliente `ScrollStory` (~2 KB) calcula el progreso con **un único** listener de scroll pasivo + `requestAnimationFrame` y solo toca `transform`, `opacity` y `stroke-dashoffset`.
- **`prefers-reduced-motion`:** se muestra la cocina terminada, sin animación; los paneles se desplazan con el scroll normal.
- Sin JS: se ve la cocina terminada (estado final en el HTML).
- Los paneles de los pasos son `GlassCard`. Alternan derecha/izquierda en escritorio; en móvil van en la mitad inferior de la pantalla para no tapar la cocina.
- `aria-hidden="true"` en el escenario: el contenido real son los paneles.

## Vidrio esmerilado (glassmorphism)

| Variante | Fondo | Desenfoque | Dónde |
|---|---|---|---|
| Sobre oscuro | `rgba(20,18,16,.42)` + borde `rgba(242,182,109,.22)` | `blur(14px) saturate(140%)` | Tarjeta del hero, paneles del Proceso |
| Sobre el mapa (escritorio) | `rgba(20,18,16,.62)` + sombra de texto suave | `blur(5px) saturate(130%)` | Tarjeta de la zona de servicio |
| Sobre el mapa (móvil) | `rgba(20,18,16,.8)` | ídem | Ídem |

- `backdrop-filter` es caro en móviles modestos: solo en tarjetas, nunca en áreas a pantalla completa.
- Contraste: texto `--cream` sobre la variante más transparente, en la zona más clara del mapa, ≈ 5:1 (pasa AA). Comprobar en T24.
- Respaldo sin `backdrop-filter`: el fondo semitransparente sigue siendo legible.

## Antes y después

- Tarjeta 4:3 con la foto "antes" delante y la "después" detrás. Se voltea (giro 3D en Y) con `:hover`, al tocarla o con Enter/Espacio.
- **Sin JS:** un `<input type="checkbox">` visualmente oculto dentro del `<label>` guarda el estado; CSS gira la tarjeta con `:checked`. El checkbox lleva `aria-label` "Ver el después: …".
- Etiquetas "Antes" (fondo claro) y "Después" (nogal) arriba a la izquierda; pie con título y descripción.
- `prefers-reduced-motion`: fundido entre las dos caras en lugar del giro.
- Mientras no haya fotos reales: ilustraciones o marcadores claramente etiquetados como ejemplo.

## Carrusel

Para "Antes y después" y "Reseñas".

- Pista con `scroll-snap` (se desliza con el dedo en móvil, sin librerías). Diapositivas visibles: 3 en escritorio, 2 en tablet y 1,12 en móvil (asoma la siguiente).
- **Avance automático** cada 5 s (antes/después) o 6 s (reseñas), con una barra de tiempo fina.
- **Se detiene** con hover, con foco de teclado dentro, al tocar en móvil, si hay una tarjeta volteada, fuera de pantalla y con la pestaña oculta.
- Controles: anterior, **pausa/reanudar visible** (obligatorio por WCAG 2.2.2), siguiente, puntos y flechas del teclado en la pista.
- `aria-roledescription="carrusel"` en el contenedor y "diapositiva" en cada elemento, con `aria-label` "1 de 5".
- `prefers-reduced-motion`: sin avance automático (arranca en pausa) y sin desplazamiento suave.
- Todas las diapositivas están en el HTML (contenido indexable).
- Componente cliente `Carousel` (~2 KB).

## Mapa de la zona de servicio

Referencia: `docs/mockups/mapa-zonas.png`. Generación de datos: `scripts/geo/README.md`.

- **Forma:** el contorno real de los condados de Travis, Williamson y Hays. Por dentro, zonas continuas sin huecos: cada sector censal se asigna a la ciudad más cercana (con pesos) y se fusionan. Bordes orgánicos (siguen calles y ríos). Alrededor, los condados vecinos en tono muy suave como contexto.
- **Son zonas ilustrativas**, no límites legales; no se presentan como tales.
- **Colores:** zonas atendidas en tonos de madera (`#7A3E1D`, `#8a4a22`, `#9c5a2c`, `#B8692F`, `#C98B4F`, `#D49A5E`, `#6b361a`), sin repetir tono entre vecinas; zonas "consúltanos" en `#DCD0BE` con etiqueta `#8a7f72`; bordes entre zonas `--cream` 2 px; contorno exterior nogal al 50 % con sombra suave. Austin lleva una estrella `--glow` ("Base").
- **Etiquetas:** nombre de la zona en Barlow Condensed 700, mayúsculas, color crema dentro de cada zona.
- **Interacción:** hover en una zona la ilumina en `--glow` y marca su ciudad en la lista de la tarjeta; hover/foco en la lista ilumina la zona.
- **Entrada:** las zonas aparecen una a una (`RevealObserver`). Con `prefers-reduced-motion`, aparecen sin animación.
- **Layout:** fondo de sección `--cream`; el mapa ocupa el lado derecho y la `GlassCard` (título, texto, lista de ciudades como botones, leyenda y los dos CTA) se superpone a la izquierda. En móvil, el mapa va arriba y la tarjeta se monta sobre su parte inferior.
- El contenedor de la tarjeta no debe interceptar el puntero sobre el mapa (`pointer-events: none` en el contenedor, `auto` en la tarjeta).
- SVG inline (~16 KB), sin Google Maps ni peticiones externas. Rosa de los vientos y escala en millas.

## Imágenes

- Fotos reales de DHC cuando las haya (`H1`): originales en `assets/photos/`, procesadas con `scripts/optimize-images.mjs` a AVIF y WebP (640, 960 y 1600 px de ancho), con `alt` descriptivo en cada idioma.
- Hero LCP: si es una foto, se carga con `priority` y la versión servida en móvil debe pesar menos de 200 KB.
- Imagen Open Graph de 1200×630 por idioma (logo + lema + teléfono del idioma; textos en `04`).
