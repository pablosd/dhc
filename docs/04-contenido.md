# 04 · Contenido

Estructura de la landing y textos en **inglés y español**. Estos textos se copian a `src/content/en.ts` y `src/content/es.ts`.

## Convenciones

- **`[TODO <código>]`**: el texto depende de una respuesta del cuestionario (`07`). Si al publicar no hay respuesta, ese texto se quita o se reformula: no se inventa.
- **`{phone}`, `{phoneEn}`, `{phoneEs}`, `{email}`, `{year}`**: marcadores que se rellenan con `fill()` desde `site.ts` (ver `02` → Internacionalización). `{phone}` es siempre la línea del idioma de la página. Los diccionarios nunca llevan estos datos escritos a mano.
- Tono: cercano, seguro y concreto. Frases cortas. Nada de superlativos vacíos ("the best in Texas!"). El español debe sonar natural para el público hispano de Texas y no ser una traducción literal. Se usa "tú".
- Los textos de esta página son **propuestas**: el dueño y un hablante nativo los revisan en T24.

## Orden de secciones

| # | Sección | `id` ancla (EN / ES) | Fondo |
|---|---|---|---|
| 0 | DemoBanner (solo mientras `demoMode`) | — | ink |
| 1 | Header | — | transparente → ink |
| 2 | Hero | `top` | foto (o ilustración) oscurecida + halo glow |
| 3 | Marquee de servicios | — | franja nogal |
| 4 | Servicios | `services` / `servicios` | cream |
| 5 | Por qué DHC (+ estadísticas si hay cifras reales) | `about` / `nosotros` | paper |
| 6 | Proceso (cocina que se arma) | `process` / `proceso` | ink |
| 7 | Proyectos: antes y después (carrusel) | `work` / `proyectos` | cream |
| 8 | Reseñas (carrusel) | `reviews` / `resenas` | paper |
| 9 | Zona de servicio (mapa + tarjeta con CTA) | `areas` / `zonas` | cream |
| 10 | Preguntas frecuentes | `faq` / `preguntas` | paper |
| 11 | Contacto / estimado | `estimate` / `estimado` | ink |
| 12 | Footer | — | ink-soft |
| — | Barra fija de CTA en móvil | — | ink |

Cada sección tiene un único H2. El H1 solo está en el hero. Referencia visual: `docs/mockups/maqueta-v1.html` (en español).

---

## Textos globales y de accesibilidad

| Clave | EN | ES |
|---|---|---|
| a11y.skipLink | Skip to content | Saltar al contenido |
| a11y.mainNav | Main | Principal |
| a11y.footerNav | Footer | Pie de página |
| a11y.menuOpen | Open menu | Abrir menú |
| a11y.menuClose | Close menu | Cerrar menú |
| a11y.languageSwitch | Ver esta página en español | View this page in English |
| a11y.callEn | Call DHC in English at {phoneEn} | Llamar a DHC en inglés al {phoneEn} |
| a11y.callEs | Call DHC in Spanish at {phoneEs} | Llamar a DHC en español al {phoneEs} |
| a11y.whatsapp **[TODO B2]** | Message us on WhatsApp | Escríbenos por WhatsApp |
| a11y.marqueePause | Pause animation | Pausar animación |
| a11y.logoHome | home | inicio |
| a11y.carousel | carousel | carrusel |
| a11y.slide | slide | diapositiva |
| a11y.slideOf | {n} of {total} | {n} de {total} |
| a11y.prev | Previous | Anterior |
| a11y.next | Next | Siguiente |
| a11y.pause | Pause carousel | Pausar carrusel |
| a11y.resume | Resume carousel | Reanudar carrusel |
| a11y.goTo | Go to slide {n} | Ir a la {n} |
| a11y.flip | See the after: {title} | Ver el después: {title} |
| a11y.serviceChips | Jump to a service | Ir a un servicio |
| a11y.cityList | Cities we serve | Ciudades que atendemos |
| sample.photo | Project photo | Foto del proyecto |
| sample.review | Sample review | Reseña de ejemplo |

El enlace del selector de idioma lleva `lang` y `hrefLang` del idioma de destino, por eso su `aria-label` está en ese idioma. `a11y.logoHome` es un sufijo solo para lectores de pantalla: el nombre del enlace del logo es su texto visible + " — inicio" (WCAG 2.5.3: el nombre accesible debe contener el texto visible).

## 0 · DemoBanner

- EN: *Preview — some business details, reviews and photos are placeholders.*
- ES: *Vista previa — algunos datos, reseñas y fotos son de ejemplo.*
- Etiqueta de la región (`demoBannerLabel`): *Preview notice* / *Aviso de vista previa*.

## 1 · Header

El orden del menú sigue el orden de la página.

| Clave | EN | ES |
|---|---|---|
| nav.services | Services | Servicios |
| nav.about | Why DHC | Nosotros |
| nav.process | Process | Proceso |
| nav.work | Our Work | Proyectos |
| nav.faq | FAQ | Preguntas |
| nav.cta | Free Estimate **[TODO D1]** | Estimado gratis **[TODO D1]** |
| nav.language | Español | English |
| teléfono visible | {phone} | {phone} |

Si `D1` dice que el estimado no siempre es gratis, `nav.cta` pasa a **Get an Estimate** / **Pide un estimado**, y lo mismo en todos los CTA que digan "free/gratis".

## 2 · Hero

| Clave | EN | ES |
|---|---|---|
| eyebrow | Custom Build • Install • Remodel | Fabricación a medida • Instalación • Remodelación |
| H1 | Custom carpentry & woodwork in Austin, TX — **built to last.** | Carpintería y trabajos en madera a medida en Austin, TX — **hechos para durar.** |
| lead | Cabinets, kitchen remodels, wood ceilings and beams, trim, doors, decks and framing — built and installed by a local crew that treats your home like our own. | Gabinetes, remodelación de cocinas, techos y vigas de madera, molduras, puertas, decks y framing — fabricado e instalado por un equipo local que cuida tu casa como si fuera la nuestra. |
| CTA primario | Get a free estimate **[TODO D1]** | Pide tu estimado gratis **[TODO D1]** |
| CTA secundario | Call {phone} | Llama al {phone} |
| trust 1 **[TODO D1]** | Free on-site estimates | Estimados gratis a domicilio |
| trust 2 | Se habla español | Atendemos en inglés y español |
| trust 3 **[TODO E1]** | Fully insured | Con seguro |

- El final del H1 ("built to last" / "hechos para durar") va en color `--glow`, no en cursiva (ver `03`).
- Trust 3: solo si `E1` confirma seguro. "Licensed" solo si hay un registro o licencia real.
- Visual: de fondo, la mejor foto real de un proyecto (`H1`), oscurecida con un degradado. Mientras no la haya, una ilustración de cocina (como en la maqueta).
- Tarjeta de vidrio a la derecha (debajo en móvil):

| Clave | EN | ES |
|---|---|---|
| heroCard.lineEs | Spanish line | Línea en español |
| heroCard.lineEn | English line | Línea en inglés |
| heroCard.cta | Request my free estimate **[TODO D1]** | Quiero mi estimado gratis **[TODO D1]** |

En la tarjeta, la línea del idioma de la página va primero.

## 3 · Marquee

EN: Cabinets • Kitchen Remodels • Wood Ceilings & Beams • Trim & Molding • Doors • Decks & Patios • Framing • General Carpentry
ES: Gabinetes • Remodelación de cocinas • Techos y vigas de madera • Molduras • Puertas • Decks y terrazas • Framing • Carpintería general

Interruptor de pausa: `a11y.marqueePause` (es un `role="switch"`: el lector anuncia "activado/desactivado", así que basta una etiqueta).

## 4 · Servicios **[TODO C1–C3]**

- eyebrow: **What we build** / **Lo que hacemos**
- H2: **Woodwork for every corner of your home** / **Trabajos en madera para cada rincón de tu casa**
- lead EN: *From custom cabinets to structural framing, we build, install and remodel — one team, one schedule, one point of contact.*
- lead ES: *Desde gabinetes a medida hasta la estructura de tu casa: fabricamos, instalamos y remodelamos. Un solo equipo, un solo calendario y una sola persona de contacto.*

| id | icono | EN título / texto / puntos | ES título / texto / puntos |
|---|---|---|---|
| `cabinets` | cabinet | **Custom Cabinets & Built-ins** — Kitchen, bath and closet cabinets, vanities and built-ins made to measure and installed with precision. · Made to measure · Shaker, flat & inset · Refacing & installs | **Gabinetes a medida y empotrados** — Gabinetes de cocina, baño y clóset, muebles de baño y empotrados hechos a la medida e instalados con precisión. · Hechos a la medida · Estilo shaker, liso o inset · Renovación e instalación |
| `kitchens` | kitchen | **Kitchen Remodeling** — Layout changes, islands, pantries and cabinetry coordinated from demo to final trim. · Islands & pantries · Layout redesign · Full coordination | **Remodelación de cocinas** — Cambios de distribución, islas, despensas y gabinetes, coordinado desde la demolición hasta el último acabado. · Islas y despensas · Nueva distribución · Coordinación completa |
| `ceilings` | beam | **Beams & Wood Ceilings** — Tongue-and-groove ceilings, decorative and structural beams that add warmth and character to any room. · T&G ceilings · Decorative beams · Indoor & outdoor | **Vigas y techos de madera** — Techos machihembrados y vigas decorativas o estructurales que dan calidez y carácter a cualquier espacio. · Techos machihembrados · Vigas decorativas · Interior y exterior |
| `trim` | molding | **Trim & Molding** — Crown molding, baseboards, wainscoting, casings and accent walls with clean, tight joints. · Crown & baseboards · Wainscoting · Accent walls | **Molduras y acabados** — Molduras de techo, zócalos, wainscoting, marcos y muros decorativos con uniones limpias y precisas. · Molduras y zócalos · Wainscoting · Muros decorativos |
| `doors` | door | **Doors** — Interior and exterior door installation, pre-hung and slab, barn doors and hardware. · Interior & exterior · Barn doors · Hardware & adjustments | **Puertas** — Instalación de puertas interiores y exteriores, premontadas o solo hoja, puertas de granero y herrajes. · Interiores y exteriores · Puertas de granero · Herrajes y ajustes |
| `decks` | deck | **Decks & Patios** — Cedar, treated and composite decks, patio covers and pergolas built for the Texas sun. · Composite & cedar · Patio covers · Pergolas | **Decks y terrazas** — Decks de cedro, madera tratada o compuestos, techos de patio y pérgolas hechos para el sol de Texas. · Compuesto y cedro · Techos de patio · Pérgolas |
| `framing` | framing | **Framing** — Framing for additions, garage conversions, walls and remodels: square, plumb and ready for inspection. · Additions · Walls & openings · Garage conversions | **Framing (estructura)** — Estructura para ampliaciones, conversiones de garaje, muros y remodelaciones: a escuadra, a plomo y lista para inspección. · Ampliaciones · Muros y vanos · Conversión de garajes |
| `general` | hammer | **General Carpentry** — Repairs, custom pieces and the projects that don't fit a box. If it's wood, ask us. · Repairs · Custom pieces · Small jobs welcome **[TODO C9]** | **Carpintería general** — Reparaciones, piezas a medida y todos esos proyectos que no encajan en una categoría. Si es de madera, pregúntanos. · Reparaciones · Piezas a medida · Trabajos pequeños bienvenidos **[TODO C9]** |

- Bajo el encabezado, `ServiceChips` con los nombres cortos: EN *Cabinets · Kitchens · Ceilings & Beams · Trim · Doors · Decks · Framing · General Carpentry* / ES *Gabinetes · Cocinas · Techos y vigas · Molduras · Puertas · Decks · Framing · Carpintería general*.
- Enlace de cada tarjeta (fase 1.5): **Learn more →** / **Ver más →**. En la fase 1 no se muestra.

CTA al pie de la sección: **Not sure where to start? Call us.** / **¿No sabes por dónde empezar? Llámanos.** (enlace `tel:` a `{phone}`)

## 5 · Por qué DHC

- eyebrow: **Why DHC** / **Por qué DHC**
- H2: **Real craftsmanship. Straight answers.** / **Oficio de verdad. Respuestas claras.**
- lead EN **[TODO D3, D7]**: *We build it, we install it, we stand behind it. The same people who quote your project are the ones who do the work.*
- lead ES **[TODO D3, D7]**: *Lo fabricamos, lo instalamos y respondemos por ello. Las mismas personas que cotizan tu proyecto son las que hacen el trabajo.*

Presentación: dos bloques `ZigZag` (texto + foto alternados), con dos puntos cada uno. El primer bloque lleva como título el lead (EN *We build it, we install it, we stand behind it* / ES *Lo fabricamos, lo instalamos y respondemos por ello*); el segundo, EN *In-house craftsmanship. English & Spanish.* / ES *Fabricación propia. Inglés y español.* **[TODO C5]**

Puntos (4):

| EN | ES |
|---|---|
| **Clear, written quotes** — Itemized scope and pricing before we start. **[TODO D2]** | **Cotizaciones claras por escrito** — Alcance y precio detallados antes de empezar. **[TODO D2]** |
| **Clean, respectful job sites** — Dust control and daily clean-up. **[TODO D4]** | **Obra limpia y respetuosa** — Control de polvo y limpieza diaria. **[TODO D4]** |
| **Built and installed in-house** — We custom build, install and remodel with our own crew. **[TODO C5]** | **Fabricación e instalación propias** — Fabricamos, instalamos y remodelamos con nuestro propio equipo. **[TODO C5]** |
| **English & Spanish** — Talk to us in the language you prefer. | **Inglés y español** — Habla con nosotros en el idioma que prefieras. |

Estadísticas **[TODO A3, E3, G1, D7 — solo con cifras reales]**:

| Clave | EN | ES |
|---|---|---|
| stats.years | Years of experience | Años de experiencia |
| stats.projects | Projects completed | Proyectos terminados |
| stats.rating | Google rating | Calificación en Google |
| stats.warranty | Year warranty | Años de garantía |

## 6 · Proceso

- eyebrow: **How it works** / **Cómo trabajamos**
- H2: **From first call to final walkthrough** / **De la primera llamada a la entrega final**

- intro EN: *Scroll slowly: behind these panels, your kitchen comes together step by step.*
- intro ES: *Baja despacio: detrás de estos paneles, tu cocina se construye paso a paso.*

| # | EN | ES | Indicador (EN / ES) |
|---|---|---|---|
| 1 | **Free estimate** — We visit, listen and take precise measurements. **[TODO D1]** | **Estimado gratis** — Te visitamos, escuchamos lo que quieres y tomamos medidas precisas. **[TODO D1]** | Plan & measurements / Plano y medidas |
| 2 | **Design & quote** — A clear plan and an itemized quote, before we cut the first board. **[TODO C6, D2]** | **Diseño y cotización** — Un plan claro y una cotización detallada, antes de cortar la primera tabla. **[TODO C6, D2]** | Module layout / Diseño de módulos |
| 3 | **Build & install** — Built to measure and installed on schedule: cabinets, countertop and uppers. | **Fabricación e instalación** — Hecho a la medida e instalado a tiempo: gabinetes, cubierta y alacenas. | Cabinets, countertop & uppers / Gabinetes, cubierta y alacenas |
| 4 | **Final walkthrough** — Doors, hardware, wood and light. We review every detail together. | **Revisión final** — Puertas, herrajes, madera y luz. Revisamos cada detalle contigo. | Doors, wood & light / Puertas, madera y luz |

- Indicador: **Step {n} of 4** / **Paso {n} de 4**.
- Las cotas del plano usan pies y pulgadas (p. ej. `13' 4"`, `7' 1"`) y el rótulo **PLAN · KITCHEN** / **PLANO · COCINA**.

## 7 · Proyectos

- eyebrow: **Recent work** / **Trabajos recientes**
- H2: **Before & after** / **Antes y después**
- lead EN: *Hover over or tap each image to see the transformation.*
- lead ES: *Pasa el mouse o toca cada imagen para ver la transformación.*
- `Carousel` de `BeforeAfterCard`. Etiquetas: **Before** / **Antes**, **After** / **Después**.
- Mientras no haya fotos reales (`H1`): ilustraciones con la etiqueta **Sample illustration** / **Ilustración de ejemplo**.

| # | EN título · descripción | ES título · descripción |
|---|---|---|
| 1 | Full kitchen · Cabinets, countertop and wood ceiling | Cocina completa · Gabinetes, cubierta y techo de madera |
| 2 | Cabinets & uppers · Walnut shaker | Gabinetes y alacenas · Shaker en nogal |
| 3 | Ceiling & lighting · Tongue-and-groove and beams | Techo y luz · Machihembrado y vigas |
| 4 | Uppers & hood · Made-to-measure units | Alacenas y campana · Módulos a medida |
| 5 | Countertop & base cabinets · Drawers and new countertop | Cubierta y bases · Cajones y cubierta nueva |

- Con fotos reales: cada par antes/después del mismo proyecto, con título, ciudad real y `alt` descriptivo por idioma (p. ej. *Custom walnut kitchen cabinets installed in Round Rock, TX* / *Gabinetes de cocina en nogal instalados en Round Rock, TX*). Necesita permiso del cliente.
- Si solo hay fotos "después", se muestran como galería normal dentro del mismo carrusel, sin volteo.

## 8 · Reseñas

- eyebrow: **Reviews** / **Reseñas**
- H2: **What homeowners say** / **Lo que dicen nuestros clientes**
- Aviso de sección (visible): *Sample reviews — to be replaced with real Google reviews.* / *Reseñas de ejemplo — se reemplazarán por reseñas reales de Google.*
- Cada tarjeta lleva la etiqueta `sample.review` y el nombre *Sample client* / *Cliente de ejemplo*.

| # | Proyecto (EN / ES) | EN | ES |
|---|---|---|---|
| 1 | Custom cabinets / Gabinetes a medida | They built and installed our kitchen cabinets exactly as planned. Clean work and great communication. | Fabricaron e instalaron los gabinetes de nuestra cocina tal como lo planeamos. Trabajo limpio y muy buena comunicación. |
| 2 | Wood ceiling / Techo de madera | Our new tongue-and-groove ceiling completely changed the living room. On time and on budget. | El nuevo techo machihembrado cambió por completo la sala. A tiempo y dentro del presupuesto. |
| 3 | Deck / Deck | Quick estimate, fair price, and the deck looks amazing. I could talk to them in Spanish. | Estimado rápido, precio justo y el deck quedó increíble. Pude hablar con ellos en español. |
| 4 | Trim / Molduras | The crown molding and wainscoting came out perfect. Clean joints and very careful with our home. | Las molduras y el wainscoting quedaron perfectos. Uniones limpias y muy cuidadosos con la casa. |
| 5 | Doors / Puertas | They installed all our interior doors in one day and adjusted the ones we already had. | Instalaron todas las puertas interiores en un día y ajustaron las que ya teníamos. |

Zona de todas: *Austin area* / *Zona de Austin*. Presentación: `Carousel` de `ReviewCard`.

- **En producción:** solo reseñas reales con permiso del cliente (`G3`), o un enlace **Read our reviews on Google** / **Lee nuestras reseñas en Google** (`G1`). Sin `AggregateRating` en el schema mientras no sean reales. Si no hay ninguna de las dos cosas, la sección no se muestra.

## 9 · Zona de servicio **[TODO F1]**

- eyebrow: **Service area** / **Zona de servicio**
- H2: **Serving Austin & Central Texas** / **Atendemos Austin y Texas central**
- lead EN: *Based in Austin and working across Central Texas. Don't see your city? Call us — we'll tell you right away if we can help.*
- lead ES: *Estamos en Austin y trabajamos en todo Texas central. ¿No ves tu ciudad? Llámanos y te decimos enseguida si podemos ayudarte.*
- Propuesta de lista (zonas en color): Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Lakeway, Bee Cave, West Lake Hills, Dripping Springs, Buda, Kyle, Manor, Hutto.
- Zonas "consúltanos" (en gris): Jarrell, Liberty Hill, Lago Vista, Wimberley, San Marcos, Taylor.
- Presentación: `AreaMap` (ver `03` → Mapa) con la tarjeta de vidrio encima. La tarjeta lleva eyebrow, H2, lead, la lista de ciudades atendidas como texto (aporta SEO), la leyenda y los dos CTA. Esta sección sustituye al bloque de CTA separado.

| Clave | EN | ES |
|---|---|---|
| areas.legendServed | We serve | Atendemos |
| areas.legendAsk | Ask us | Consúltanos |
| areas.legendBase | Base: Austin | Base: Austin |
| areas.ctaEstimate | Get a free estimate **[TODO D1]** | Pide tu estimado gratis **[TODO D1]** |
| areas.ctaCall | Call {phone} | Llama al {phone} |
| areas.mapLabel | Map of Travis, Williamson and Hays counties showing the areas DHC serves | Mapa de los condados de Travis, Williamson y Hays con las zonas que atiende DHC |
| areas.scale | 10 miles | 10 millas |

Los nombres de las ciudades no se traducen.

## 10 · Preguntas frecuentes

- Presentación: preguntas a la derecha y, en escritorio, foto de un proyecto a la izquierda bajo el encabezado.
- eyebrow: **FAQ** / **Preguntas frecuentes**
- H2: **Questions we hear a lot** / **Lo que más nos preguntan**

| EN | ES |
|---|---|
| **Do you offer free estimates?** Yes — we visit your home, measure and send a written quote. **[TODO D1, D2]** | **¿Los estimados son gratis?** Sí. Te visitamos, tomamos medidas y te enviamos una cotización por escrito. **[TODO D1, D2]** |
| **Do you speak Spanish?** Yes. Call {phoneEs} for Spanish or {phoneEn} for English. | **¿Hablan español?** Sí. Llama al {phoneEs} para español o al {phoneEn} para inglés. |
| **Do you build custom cabinets or only install?** Both — we custom build, install and remodel. **[TODO C5]** | **¿Fabrican gabinetes o solo los instalan?** Las dos cosas: fabricamos a medida, instalamos y remodelamos. **[TODO C5]** |
| **What areas do you serve?** Austin and nearby cities — see the list above. If you're not sure, give us a call. **[TODO F1]** | **¿En qué zonas trabajan?** Austin y ciudades cercanas (mira la lista de arriba). Si tienes dudas, llámanos. **[TODO F1]** |
| **How long does a project take?** It depends on the scope; you'll get a timeline with your quote. | **¿Cuánto tarda un proyecto?** Depende del alcance; recibes un calendario junto con tu cotización. |
| **Are you insured?** **[TODO E1]** | **¿Tienen seguro?** **[TODO E1]** |
| **Do you offer a warranty?** **[TODO D7]** | **¿Ofrecen garantía?** **[TODO D7]** |

Se renderizan con `<details>` y se emite el schema `FAQPage` (ver `05`). Las preguntas sin respuesta confirmada no se publican. Las respuestas de `K2` pueden añadir preguntas nuevas.

## 11 · Contacto / estimado

- eyebrow: **Free estimate** / **Estimado gratis** **[TODO D1]**
- H2: **Let's build something you'll love** / **Construyamos algo que te encante**
- lead EN **[TODO B6]**: *Tell us about your project and we'll get back to you within one business day.*
- lead ES **[TODO B6]**: *Cuéntanos sobre tu proyecto y te respondemos en menos de un día hábil. Hablamos español.*

### Formulario

| Clave | EN | ES |
|---|---|---|
| form.name | Full name | Nombre completo |
| form.phone | Phone | Teléfono |
| form.email | Email | Correo |
| form.projectType | Project type | Tipo de proyecto |
| form.projectTypePlaceholder | Select one | Elige una opción |
| form.projectTypeOther | Other | Otro |
| form.city | City or ZIP code | Ciudad o código postal |
| form.message | Tell us about your project | Cuéntanos sobre tu proyecto |
| form.messagePlaceholder | What would you like to build, install or remodel? Measurements and timing help. | ¿Qué te gustaría fabricar, instalar o remodelar? Si tienes medidas o fechas, mejor. |
| form.optional | (optional) | (opcional) |
| form.submit | Request my free estimate **[TODO D1]** | Quiero mi estimado gratis **[TODO D1]** |
| form.sending | Sending… | Enviando… |
| form.success | Thanks! We'll contact you shortly. | ¡Gracias! Te contactaremos pronto. |
| form.error | Something went wrong. Please call us at {phone}. | Algo salió mal. Llámanos al {phone}. |
| form.consent **[TODO J4]** | By sending this form, you agree that DHC may contact you by phone, text message or email about your project. We never share your information. | Al enviar este formulario aceptas que DHC te contacte por teléfono, mensaje de texto o correo sobre tu proyecto. Nunca compartimos tu información. |

| form.consentNoText | By sending this form, you agree that DHC may contact you by phone or email about your project. We never share your information. | Al enviar este formulario aceptas que DHC te contacte por teléfono o correo sobre tu proyecto. Nunca compartimos tu información. |

Las opciones de "Tipo de proyecto" son los títulos de los 8 servicios (sección 4) más `form.projectTypeOther`. Si `J4` dice que no se envían mensajes de texto (`site.claims.textMessages = false`), se usa `form.consentNoText`.

### Mensajes de validación

| Clave | EN | ES |
|---|---|---|
| validation.required | Please fill out this field. | Completa este campo. |
| validation.selectRequired | Please choose a project type. | Elige un tipo de proyecto. |
| validation.email | Please enter a valid email, like name@example.com. | Escribe un correo válido, como nombre@ejemplo.com. |
| validation.phone | Please enter a 10-digit phone number. | Escribe un teléfono de 10 dígitos. |

### Columna lateral

| Clave | EN | ES |
|---|---|---|
| contact.callTitle | Prefer to talk? | ¿Prefieres hablar? |
| contact.lineEn | English line | Línea en inglés |
| contact.lineEs | Spanish line | Línea en español |
| contact.email **[TODO B3]** | Email | Correo |
| contact.hours **[TODO B5]** | Hours | Horario |
| contact.whatsapp **[TODO B2]** | WhatsApp | WhatsApp |

Los teléfonos, el correo y el horario salen de `site.ts`.

## 12 · Footer

| Clave | EN | ES |
|---|---|---|
| footer.tagline | Custom carpentry & woodwork in Austin, TX. | Carpintería y trabajos en madera a medida en Austin, TX. |
| footer.colServices | Services | Servicios |
| footer.colCompany | Company | Empresa |
| footer.colContact | Contact | Contacto |
| footer.copyright | © {year} DHC Woodcraft & Installation. All rights reserved. | © {year} DHC Woodcraft & Installation. Todos los derechos reservados. |

- Columna Servicios: enlaces a la sección de servicios (en la fase 1.5, a cada página de servicio).
- Columna Empresa: Why DHC / Nosotros, Process / Proceso, Our Work / Proyectos, FAQ / Preguntas, Free Estimate / Estimado gratis.
- Columna Contacto (NAP): nombre del negocio, dirección o zona **[TODO B4]**, los dos teléfonos con su etiqueta de idioma, correo **[TODO B3]**.
- Selector de idioma.
- El nombre legal (`A2`) aparece en el copyright si es distinto del comercial.

## Barra móvil

| Clave | EN | ES |
|---|---|---|
| mobileBar.call | Call | Llamar |
| mobileBar.estimate | Free estimate **[TODO D1]** | Estimado gratis **[TODO D1]** |

Cada botón de llamada usa el número del idioma de la página.

## Página 404

| Clave | EN | ES |
|---|---|---|
| notFound.title | We couldn't find that page | No encontramos esa página |
| notFound.text | The link may be broken or the page may have moved. | Puede que el enlace esté roto o que la página haya cambiado de lugar. |
| notFound.home | Back to home | Volver al inicio |
| notFound.call | Call {phone} | Llama al {phone} |

La 404 global (`/404.html`) muestra los dos idiomas, uno debajo del otro.

## Página de `/` (respaldo sin JS)

| Clave | EN | ES |
|---|---|---|
| root.title | Choose your language | Elige tu idioma |
| root.link | English | Español |

Se muestran las dos claves de los dos diccionarios en la misma página.

## Imágenes Open Graph (1200×630)

| Elemento | EN | ES |
|---|---|---|
| Línea 1 | DHC Woodcraft & Installation | DHC Woodcraft & Installation |
| Línea 2 | Custom carpentry in Austin, TX | Carpintería a medida en Austin, TX |
| Línea 3 | {phoneEn} | {phoneEs} |
| `alt` | DHC Woodcraft & Installation — custom carpentry in Austin, TX | DHC Woodcraft & Installation — carpintería a medida en Austin, TX |

## Fase 1.5 · Páginas por servicio

Cada página necesita contenido propio, **no** el de la tarjeta de la landing:

- H1 con servicio + ciudad (p. ej. *Custom Cabinets in Austin, TX* / *Gabinetes a medida en Austin, TX*).
- Introducción, qué incluye, materiales y estilos (`C10`), proceso específico, plazos típicos (`D5`), 3–5 preguntas frecuentes del servicio, galería con fotos reales del servicio (`H1`) y CTA.
- Entre 500 y 900 palabras útiles por idioma.
- Los textos se redactan en T29, cuando haya respuestas del cuestionario.
