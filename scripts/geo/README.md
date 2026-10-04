# Mapa de la zona de servicio

Genera las formas del mapa de "Zona de servicio" (ver `docs/03-diseno.md` → Mapa). Se ejecuta **solo cuando cambian las ciudades** (respuesta `F1` del cuestionario), no en cada build. El resultado (paths SVG ya proyectados, ~16 KB) se guarda en el repo; los datos descargados no.

Estos scripts vienen de la maqueta (`docs/mockups/maqueta-v1.html`). En T15 se adaptan para escribir `src/content/area-map.ts` y se añade el script `npm run geo`.

## Datos (dominio público, censo de EE. UU.)

Descargar en `scripts/geo/data/` (en `.gitignore`):

```bash
curl -sSfLO https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_48_tract_500k.zip
curl -sSfLO https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip
unzip -o cb_2023_48_tract_500k.zip && unzip -o cb_2023_us_county_500k.zip
```

## Pasos

1. **Sectores censales de Travis (453), Williamson (491) y Hays (209)**, con un punto interior de cada uno:

   ```bash
   npx -y mapshaper@0.6.102 cb_2023_48_tract_500k.shp \
     -filter '["453","491","209"].indexOf(COUNTYFP)>-1' \
     -each 'cx=this.innerX, cy=this.innerY' -filter-fields COUNTYFP,cx,cy \
     -o format=geojson precision=0.0001 tracts.json
   ```

2. **Asignar cada sector a la ciudad más cercana** (`assign-zones.js`): lista de ciudades con peso (Austin pesa más para que su zona sea proporcional) y si se atiende o no. Corrige a mano islas sueltas (p. ej. un trozo de Kyle rodeado por San Marcos). Escribe `tracts-z.json` y `seeds.json`.

3. **Fusionar por zona, simplificar y calcular la posición de cada etiqueta**:

   ```bash
   npx -y mapshaper@0.6.102 tracts-z.json -dissolve zone -simplify 8% keep-shapes \
     -each 'lx=this.innerX, ly=this.innerY' -filter-fields zone,lx,ly \
     -o format=geojson precision=0.0001 zones-l.json
   npx -y mapshaper@0.6.102 zones-l.json -dissolve -o format=geojson precision=0.0001 outline.json
   npx -y mapshaper@0.6.102 cb_2023_us_county_500k.shp -filter 'STATEFP=="48"' \
     -clip bbox=-98.40,29.65,-97.00,31.00 -filter-fields NAME -simplify 8% keep-shapes \
     -o format=geojson precision=0.0001 counties2.json
   ```

   Comprobar que ninguna zona queda partida: `-dissolve zone -explode -o format=csv -` no debe repetir nombres.

4. **Proyectar a SVG** (`build-svg.js`): proyección equirectangular centrada en 30.3° N (bbox lon −98.32…−97.10, lat 29.72…30.93, viewBox 843 × 968).

`mapa-maqueta.js` es el código que dibuja el mapa en la maqueta (colores por zona, etiquetas, estrella de Austin, hover). En el sitio, el dibujo lo hace un Server Component; solo la sincronización del hover entre la lista y el mapa necesita JS.

Las zonas son **ilustrativas** (agrupación por cercanía), no límites legales de cada ciudad.
