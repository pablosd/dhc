#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): pasa ESLint al archivo editado si es src/**/*.ts(x).
# Si hay errores sale con 2 para que Claude los vea y los corrija.
f="$(jq -r '.tool_input.file_path // empty')"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
case "${f#"$root"/}" in
  src/*.ts|src/*.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$f" ] || exit 0
cd "$root" || exit 0
if ! out="$(./node_modules/.bin/eslint --quiet "$f" 2>&1)"; then
  echo "ESLint encontró errores en ${f#"$root"/}:" >&2
  echo "$out" >&2
  exit 2
fi
exit 0
