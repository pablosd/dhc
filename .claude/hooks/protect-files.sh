#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): impide editar a mano secretos y archivos generados.
# Sale con 2 para bloquear; el mensaje de stderr le llega a Claude.
f="$(jq -r '.tool_input.file_path // empty')"
[ -z "$f" ] && exit 0
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
rel="${f#"$root"/}"
base="$(basename "$f")"

block() { echo "Bloqueado por .claude/hooks/protect-files.sh: $rel — $1" >&2; exit 2; }

case "$base" in
  *.example) ;;  # las plantillas (.env.example) sí se editan
  .env|.env.*) block "contiene secretos (Web3Forms, Umami). Pídele a Pablo que lo cambie él." ;;
esac
case "$rel" in
  out/*|.next/*) block "es salida del build. Cambia el código fuente y ejecuta npm run build." ;;
  node_modules/*) block "son dependencias instaladas. Usa npm install." ;;
  package-lock.json) block "lo genera npm. Usa npm install / npm uninstall." ;;
  src/content/area-map.ts) block "lo genera npm run geo (scripts/geo/). Cambia scripts/geo/cities.json o site.ts y regenera." ;;
esac
exit 0
