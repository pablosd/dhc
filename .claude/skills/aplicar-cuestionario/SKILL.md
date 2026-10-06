---
name: aplicar-cuestionario
description: Vuelca las respuestas del cuestionario del dueño (docs/07, códigos A1…K) en site.ts, los diccionarios, las páginas de servicio y los docs, sin inventar nada. Solo cuando Pablo lo pide con /aplicar-cuestionario y pega o adjunta las respuestas.
disable-model-invocation: true
argument-hint: "[archivo o texto con las respuestas]"
---

# /aplicar-cuestionario — aplicar las respuestas del dueño

Entrada: lo que Pablo pegue o adjunte ($ARGUMENTS). Suele ser el texto copiado o el `.doc` descargado de https://dhc.psalazar.dev/cuestionario-dhc/, con las preguntas por código (`A1`, `D7`…). También puede llegar a mano (notas, WhatsApp).

## Reglas (no negociables)

- **Si no hay respuesta, no se inventa.** Un texto que depende de una respuesta vacía o dudosa se quita o se reformula, nunca se rellena (`CLAUDE.md` regla 5).
- **"Licensed" nunca**, salvo que `E1` traiga un registro real y verificable.
- Los datos del negocio van **solo** en `src/content/site.ts`. Los diccionarios usan marcadores (`{phone}`…) y `fill()`, sin repetir los datos.
- Si una respuesta es ambigua o contradice otra, **no decidas tú**: apúntala y pregúntale a Pablo al final.
- Una tanda de cambios por bloque y un commit al final (`content: aplicar cuestionario (bloques …)`).

## 1. Ordenar las respuestas

Haz una tabla `código → respuesta → destino` con tres estados:

- **aplicable**;
- **vacía**, se quita o reformula el texto que depende de ella;
- **dudosa**, se pregunta a Pablo.

Enséñasela a Pablo **antes** de editar si hay dudosas o si cambian servicios o zonas. Cambian la estructura del sitio.

## 2. Dónde va cada respuesta

| Código | Destino |
|---|---|
| A2 | `site.legalName` |
| A3, E3, G1 (nota), D7 (años) | `site.stats` (`years`, `projects`, `googleRating`, `warrantyYears`). Solo cifras dadas por el dueño |
| B2 | `site.whatsapp` (y `claims`/textos `// TODO B2`) |
| B3 | `site.email` |
| B4 | `site.address` (¿se publica la calle? Si no, solo ciudad y código postal) |
| B5 | `site.hours` |
| B6 | `claims.oneBusinessDayReply` y el lead del formulario |
| C1–C3 | `site.services` (orden e inclusión), tabla de `docs/01`, palabras clave de `docs/05` |
| C5 | `claims.inHouseFabrication` |
| C9 | `claims.smallJobs` |
| C6, C*, D* detallados | contenido de `src/content/service-pages.ts` (T29) y `site.servicePages` cuando una página esté lista |
| D1 | `claims.freeEstimate` (afecta a muchos textos `// TODO D1`) |
| D2 | `claims.writtenQuotes` |
| D3 | `claims.sameCrew` |
| D4 | `claims.cleanJobSites` |
| D7 | `claims.warranty` + respuesta de la FAQ |
| E1 | `claims.insured` + respuesta de la FAQ. Nada de "licensed" |
| F1 | `site.areas.served` / `askUs` → `scripts/geo/cities.json` si hay ciudades nuevas → `npm run geo` (regenera `src/content/area-map.ts`, que no se edita a mano) |
| G1 | `site.social.googleBusiness`, `stats.googleRating`; reseñas reales solo con permiso y copiadas tal cual |
| G2 | `site.social.facebook` / `instagram` |
| H1 | fotos a `assets/photos/` con nombres descriptivos → `node scripts/optimize-images.mjs` (actualiza `src/content/images.json`) |
| H3 | logo → `assets/brand/` → `npm run brand` |
| I1 | dominio propio: es una migración (`docs/02` → Migración). No la hagas aquí; avisa a Pablo |
| I2 | correo destino del formulario: **lo cambia Pablo en Web3Forms** (no está en el repo). Recuérdaselo |
| J4 | `claims.textMessages` y el aviso de consentimiento del formulario |

En `en.ts` y `es.ts`, busca `// TODO <código>` (`grep -n "TODO" src/content/en.ts src/content/es.ts`). Para cada uno:

- Si la respuesta confirma el texto, quita el comentario.
- Si lo cambia, reescribe el texto en los dos idiomas con el mismo sentido. Español natural, no traducción literal.
- Si la respuesta es vacía o negativa, quita el texto o reformúlalo. Las respuestas de la FAQ vacías (`answer: ""`) hacen que la pregunta no se publique.

Mantén `docs/04-contenido.md` alineado con lo que cambies en los diccionarios.

## 3. Cerrar

1. Quita cada `// TODO(confirmar) <código>` resuelto en `site.ts`.
2. Marca los bloques respondidos en la tabla **Seguimiento** de `docs/07` (Respondido, Parcial…) con una nota breve.
3. Si están todos los imprescindibles (★, tabla de `docs/01` → "Lo imprescindible para publicar"), díselo a Pablo: se puede hacer **T26** (salida del modo demo, `site.demoMode = false`). No lo cambies sin su visto bueno.
4. Verifica:
   - `npm run lint && npm run typecheck && npm run build`;
   - `npm run qa` (detecta marcadores sin rellenar, FAQ JSON-LD ≠ visible y errores de a11y);
   - pide un repaso al subagente `guardian-contenido`.
5. Commit y push. Informe a Pablo con:
   - qué se aplicó;
   - qué se quitó por falta de respuesta;
   - las preguntas dudosas;
   - lo que le toca a él (Web3Forms I2, dominio I1, fotos que falten).
