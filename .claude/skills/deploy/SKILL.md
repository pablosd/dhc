---
name: deploy
description: Publica el sitio de DHC en la VPS (dhc.psalazar.dev) con build, subida atómica, chequeo de humo de DHC y TTrack y auditoría en producción. Solo cuando Pablo lo pide con /deploy.
disable-model-invocation: true
---

# /deploy — publicar DHC en la VPS

La VPS es **la misma de TTrack**. Regla absoluta: nada de este flujo toca la configuración de la VPS (Caddy, systemd, ufw, DNS). Solo se suben archivos a `/var/www/dhc/releases/` y se cambia el symlink `current`. Si algo de TTrack falla, **para y avisa a Pablo**; no intentes arreglarlo.

## 1. Antes de subir

1. `git status --short` y `git branch --show-current`:
   - Debe ser `main` y el árbol debe estar limpio. Si hay cambios sin commit, pregunta a Pablo antes de seguir: lo publicado tiene que estar en git.
   - Si hay commits sin subir (`git status -sb` muestra `ahead`), haz `git push` (autorizado tras cada tarea).
2. Revisa `site.demoMode` en `src/content/site.ts`:
   - Si es `true`, recuérdalo en el informe final ("se publica en modo vista previa").
   - Si es `false`, comprueba que no queden `TODO(confirmar)` con datos que se muestran (`grep -n "TODO(confirmar)" src/content/site.ts`). Si quedan, avisa antes de publicar.
3. `npm run typecheck`. Si falla, para.

## 2. Subir

```bash
./deploy/deploy.sh
```

Hace lint, build, `rsync` a una release nueva y el cambio atómico del symlink, y conserva las 5 últimas. Si avisa de que falta `NEXT_PUBLIC_FORM_ACCESS_KEY`, para: el formulario no funcionaría. Anota el nombre de la release (`AAAAMMDD-HHMMSS`).

## 3. Comprobar

```bash
./deploy/smoke.sh       # DHC: HTTPS, redirecciones por idioma, 404, cabeceras, Umami · TTrack: clave de Tesla, puerto 4443, caddy
npm run qa:prod         # maquetación, axe, JSON-LD e interacciones contra producción (Umami bloqueado, formulario simulado)
```

`ttrack-poller` ya estaba `inactive` antes de DHC: el smoke solo lo informa, no es un fallo.

## 4. Si algo falla

- **Falla TTrack** (clave de Tesla, puerto 4443, caddy): para y avisa a Pablo enseguida, con la salida. No toques la VPS.
- **Falla DHC tras subir:** propón a Pablo volver a la release anterior con `./deploy/deploy.sh --rollback`. Ejecútalo solo si él lo aprueba, o si el sitio está caído del todo (5xx en `/en/` y `/es/`). Después vuelve a pasar `./deploy/smoke.sh`.
- **Falla `qa:prod` pero el smoke pasa:** el sitio está arriba. Informa del fallo concreto y propone el arreglo; no hagas rollback por eso.

## 5. Informe a Pablo (en español, breve)

- Release publicada y commit (`git log -1 --oneline`).
- Resultado del smoke (DHC y TTrack) y de `qa:prod`.
- Si sigue en modo demo, recuérdalo.
