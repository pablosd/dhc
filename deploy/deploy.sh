#!/usr/bin/env bash
# Despliega el sitio estático en la VPS (docs/02 → Hosting → Despliegue).
#   ./deploy/deploy.sh            build + subida + activación
#   ./deploy/deploy.sh --rollback vuelve a la release anterior
# Requisitos: acceso SSH sin contraseña al host (alias `ttrack` en ~/.ssh/config)
# y /var/www/dhc perteneciente a tu usuario en la VPS. No usa sudo.
set -euo pipefail

HOST="${DEPLOY_HOST:-ttrack}"
BASE="/var/www/dhc"
KEEP=5
cd "$(dirname "$0")/.."

if [ "${1:-}" = "--rollback" ]; then
  ssh "$HOST" "set -e; cd $BASE/releases; prev=\$(ls -1 | sort | tail -n 2 | head -n 1); \
    [ -n \"\$prev\" ] || { echo 'No hay release anterior'; exit 1; }; \
    ln -sfn $BASE/releases/\$prev $BASE/current.tmp && mv -T $BASE/current.tmp $BASE/current; \
    echo \"✓ current → \$prev\""
  exit 0
fi

if [ ! -f .env.local ] || ! grep -q '^NEXT_PUBLIC_FORM_ACCESS_KEY=.\+' .env.local; then
  echo "⚠ Falta NEXT_PUBLIC_FORM_ACCESS_KEY en .env.local: el formulario mostrará el error con el teléfono."
fi

echo "→ Lint y build"
npm run lint
npm run build

RELEASE="$(date +%Y%m%d-%H%M%S)"
echo "→ Subiendo release $RELEASE a $HOST:$BASE/releases/"
ssh "$HOST" "mkdir -p $BASE/releases"
rsync -az --delete out/ "$HOST:$BASE/releases/$RELEASE/"

echo "→ Activando (cambio atómico del symlink) y limpiando releases antiguas"
ssh "$HOST" "set -e; ln -sfn $BASE/releases/$RELEASE $BASE/current.tmp && mv -T $BASE/current.tmp $BASE/current; \
  cd $BASE/releases && ls -1 | sort | head -n -$KEEP | xargs -r rm -rf"

echo "✓ Publicado: https://dhc.psalazar.dev/  (release $RELEASE)"
