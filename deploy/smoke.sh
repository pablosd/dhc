#!/usr/bin/env bash
# Chequeo de humo tras desplegar: DHC responde bien y TTrack sigue intacto.
# Solo lee (curl, openssl, ssh con comandos de consulta). No cambia nada en la VPS.
#   ./deploy/smoke.sh
set -uo pipefail

SITE="https://dhc.psalazar.dev"
HOST="${DEPLOY_HOST:-ttrack}"
fails=0
ok()   { printf '  ✓ %s\n' "$1"; }
bad()  { printf '  ✗ %s\n' "$1"; fails=$((fails + 1)); }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
expect_code() { # descripción, código esperado, args de curl…
  local desc="$1" want="$2"; shift 2
  local got; got="$(code "$@")"
  [ "$got" = "$want" ] && ok "$desc → $got" || bad "$desc → $got (esperado $want)"
}

echo "DHC ($SITE)"
cert="$(echo | openssl s_client -connect dhc.psalazar.dev:443 -servername dhc.psalazar.dev 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)"
[ -n "$cert" ] && ok "certificado válido hasta $cert" || bad "no se pudo leer el certificado"
expect_code "http → https" 308 http://dhc.psalazar.dev/
loc_es="$(curl -s -o /dev/null -w '%{redirect_url}' -H 'Accept-Language: es-MX,es;q=0.9' "$SITE/")"
[[ "$loc_es" == */es/ ]] && ok "/ en español → /es/" || bad "/ en español → $loc_es"
loc_en="$(curl -s -o /dev/null -w '%{redirect_url}' -H 'Accept-Language: en-US' "$SITE/")"
[[ "$loc_en" == */en/ ]] && ok "/ en inglés → /en/" || bad "/ en inglés → $loc_en"
for p in /en/ /es/ /sitemap.xml /robots.txt; do expect_code "$p" 200 "$SITE$p"; done
for p in /en/no-existe /es/no-existe /otra-cosa; do expect_code "$p" 404 "$SITE$p"; done
hdrs="$(curl -sI "$SITE/es/")"
grep -qi '^strict-transport-security:' <<<"$hdrs" && ok "cabecera HSTS" || bad "falta HSTS"
grep -qi '^cache-control:' <<<"$hdrs" && ok "cabecera cache-control" || bad "falta cache-control"
expect_code "Umami (stats.psalazar.dev)" 200 https://stats.psalazar.dev/script.js

echo "TTrack (no debe cambiar)"
expect_code "clave pública de Tesla" 200 https://ttrack.psalazar.dev/.well-known/appspecific/com.tesla.3p.public-key.pem
nc -z -G 5 152.53.39.211 4443 2>/dev/null && ok "puerto 4443 accesible" || bad "puerto 4443 no responde"
if out="$(ssh -o BatchMode=yes -o ConnectTimeout=8 "$HOST" 'systemctl is-active caddy; systemctl is-active ttrack-poller; true' 2>/dev/null)"; then
  caddy_state="$(sed -n 1p <<<"$out")"; poller="$(sed -n 2p <<<"$out")"
  [ "$caddy_state" = active ] && ok "caddy activo" || bad "caddy: $caddy_state"
  # ttrack-poller ya estaba inactive antes de DHC (estado de partida): solo se informa
  printf '  · ttrack-poller: %s (antes de DHC ya estaba inactive)\n' "$poller"
else
  bad "no se pudo consultar la VPS por SSH ($HOST)"
fi

echo
[ "$fails" -eq 0 ] && echo "Todo OK." || echo "$fails fallo(s)."
exit $((fails > 0))
