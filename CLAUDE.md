# DHC Woodcraft & Installation — Landing page

Landing page bilingüe (EN/ES) para **DHC Woodcraft & Installation**, empresa de carpintería en Austin, TX.
Objetivo principal: **captar clientes** (llamadas, formularios de estimado) con muy buen **SEO local**.

## Lee esto primero

Toda la especificación vive en `docs/`. Antes de implementar cualquier cosa, lee el documento relevante:

| Doc | Para qué |
|---|---|
| `docs/01-vision-y-alcance.md` | Negocio, objetivos, fases, qué entra y qué no |
| `docs/02-arquitectura.md` | Stack, estructura de carpetas, i18n, export estático, ruta a fase 2 |
| `docs/03-diseno.md` | Marca, paleta, tipografía, componentes, animaciones |
| `docs/04-contenido.md` | Secciones de la página y textos EN/ES |
| `docs/05-seo.md` | Metadatos, hreflang, JSON-LD, sitemap, rendimiento |
| `docs/06-plan-de-implementacion.md` | Tareas ordenadas con criterio de "terminado" |
| `docs/08-guia-tareas-pablo.md` | Guía paso a paso de lo que hace Pablo: Web3Forms, DNS, VPS, despliegue, Umami, Search Console |
| `docs/07-cuestionario-dueno.md` | Cuestionario para el dueño: todos los datos pendientes del negocio, con códigos (`A1`, `D1`…) que usan los demás docs |

Recursos de marca: `assets/brand/` (tarjeta de presentación original con el logo).
**Referencia visual aprobada:** `docs/mockups/maqueta-v1.html` (se reimplementa con nuestros componentes; no se copia tal cual).

## Stack (decidido)

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**
- **Fase 1:** `output: "export"` → sitio 100 % estático, servido con **Caddy** en la VPS de Pablo (la misma de TTrack) en `https://dhc.psalazar.dev/`. Ver `docs/02` → Hosting, incluidas las **reglas de convivencia con TTrack**.
- **Fase 1.5:** páginas por servicio, también estáticas (`docs/05` §8).
- **Fase 2 (futuro, sin fecha):** API de contacto, sistema de citas para estimados, chatbot → se quita `output: "export"` y se ejecuta `next start` en la misma VPS detrás de Caddy.
- **Importante:** Next.js 16+ trae cambios respecto a versiones anteriores. Consulta `node_modules/next/dist/docs/` antes de usar APIs de routing, metadata o fuentes, y respeta los avisos de deprecación.

## Reglas de trabajo

1. **Pablo decide contigo, no tú solo.** Las propuestas se discuten antes de implementarse. Si una tarea obliga a tomar una decisión que no está en `docs/`, para y pregunta.
2. **Una tarea del plan a la vez** (`docs/06`). Al terminar, verifica su criterio de "terminado" y márcala en el plan.
3. **Todo el texto visible sale de los diccionarios** (`src/content/en.ts`, `src/content/es.ts`). Nada de strings hardcodeados en componentes (excepciones: la styleguide, que solo existe en desarrollo, y las herramientas internas en español de `src/app/(tools)/`, como el cuestionario del dueño).
4. **Datos del negocio en un solo archivo** (`src/content/site.ts`). Lo que aún no está confirmado lleva `// TODO(confirmar) <código del cuestionario>`. Los diccionarios no repiten esos datos: usan marcadores (`{phone}`, `{year}`…) que se rellenan con `fill()`.
5. **Nada de contenido falso en producción:** ni reseñas inventadas presentadas como reales, ni fotos de stock presentadas como trabajos de DHC. Los marcadores de posición deben verse como tales (ver `docs/04`).
6. **JS mínimo:** Server Components por defecto; `"use client"` solo donde haga falta interactividad. El rendimiento es parte del SEO.
7. **Accesibilidad:** HTML semántico, foco visible, contraste AA y `prefers-reduced-motion` respetado en todas las animaciones.
8. **Commits pequeños y descriptivos**, uno por tarea del plan.

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # genera /out (export estático)
npm run lint
npx serve out    # previsualizar el build estático
node scripts/optimize-images.mjs   # assets/photos → public/images (AVIF/WebP)
./deploy/deploy.sh                 # build + rsync a la VPS
```

## Datos clave del negocio

- Nombre: **DHC Woodcraft & Installation**. Lema: *Custom Build • Install • Remodel*
- Teléfono en inglés: **(737) 267-9565** · Teléfono en español: **(737) 400-1540**
- Ciudad: Austin, TX. Sitio: `dhc.psalazar.dev` (inicial). Formulario: Web3Forms. Analítica: Umami en `stats.psalazar.dev`.
- Correo, dirección, horario y el resto de datos: **pendientes** (cuestionario en `docs/07`; decisiones pendientes en `docs/01` → Decisiones).
- En Texas no hay licencia estatal para carpintería: nunca escribir "licensed" sin confirmación (`E1`).

@AGENTS.md
