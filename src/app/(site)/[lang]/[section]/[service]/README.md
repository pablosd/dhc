# Páginas por servicio (fase 1.5)

`page.dev.tsx` solo existe en desarrollo (`pageExtensions` en `next.config.ts`):
el export estático falla si una ruta dinámica no genera ninguna página, y aún
no hay ninguna publicada. En desarrollo se ven todas las que tienen contenido
(también los borradores): `npm run dev` → `/en/services/custom-cabinets/`.

## Publicar la primera página (T29)

1. Contenido final del servicio en los dos idiomas en
   `src/content/service-pages.ts`, **sin** `draft` y sin "[Pendiente T29…]",
   con fotos reales (`photos`) procesadas con `scripts/optimize-images.mjs`.
2. Añadir el id a `site.servicePages` en `src/content/site.ts`.
3. Renombrar `page.dev.tsx` → `page.tsx` (y tipar `params` con
   `PageProps<"/[lang]/[section]/[service]">` si se quiere).
4. `npm run build`: la página aparece en `/out`, en el sitemap con hreflang,
   con su JSON-LD, y la tarjeta de la landing y el footer enlazan a ella.
5. Auditar (T30) y desplegar.
