#!/usr/bin/env bash
# Genera src/content/area-map.ts (ver README.md). Uso: npm run geo
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p data
MS="npx -y mapshaper@0.6.102"
BASE=https://www2.census.gov/geo/tiger/GENZ2023/shp

for f in cb_2023_48_tract_500k cb_2023_us_county_500k; do
  if [ ! -f "data/$f.shp" ]; then
    echo "Descargando $f…"
    curl -sSfL -o "data/$f.zip" "$BASE/$f.zip"
    (cd data && unzip -oq "$f.zip")
  fi
done

# 1. Sectores de Travis (453), Williamson (491) y Hays (209) con un punto interior.
$MS data/cb_2023_48_tract_500k.shp \
  -filter '["453","491","209"].indexOf(COUNTYFP)>-1' \
  -each 'cx=this.innerX, cy=this.innerY' -filter-fields cx,cy \
  -o format=geojson precision=0.0001 data/tracts.json force

# 2. Asignar cada sector a la ciudad más cercana.
node assign-zones.mjs

# 3. Fusionar por zona, simplificar y calcular la posición de las etiquetas.
$MS data/tracts-z.json -dissolve zone -simplify 8% keep-shapes \
  -each 'lx=this.innerX, ly=this.innerY' -filter-fields zone,lx,ly \
  -o format=geojson precision=0.0001 data/zones.json force
$MS data/zones.json -dissolve -o format=geojson precision=0.0001 data/outline.json force
$MS data/cb_2023_us_county_500k.shp -filter 'STATEFP=="48"' \
  -clip bbox=-98.40,29.65,-97.00,31.00 -filter-fields NAME -simplify 8% keep-shapes \
  -o format=geojson precision=0.0001 data/counties.json force

# Comprobación: ninguna zona partida en varias piezas.
DUP=$($MS data/tracts-z.json -dissolve zone -explode -o format=csv - 2>/dev/null | tail -n +2 | sort | uniq -d)
if [ -n "$DUP" ]; then echo "✗ Zonas partidas en varias piezas: $DUP (añade un override en cities.json)"; exit 1; fi

# 4. Proyectar a SVG.
node build-svg.mjs
