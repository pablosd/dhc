# 08 · Guía de tareas para Pablo

Pasos para publicar el sitio y cerrar lo pendiente. Cada paso dice **qué hacer**, **cómo comprobar que salió bien** y **qué hacer si algo falla**.

## Antes de empezar

### Quién hace qué

| | Tú | Claude (con tu OK) |
|---|---|---|
| Crear cuentas (Web3Forms, Google, Bing, Umami) | ✓ | — |
| Comandos con `sudo` en la VPS | ✓ (piden tu contraseña; Claude no escribe contraseñas) | — |
| Registros DNS con `cf_dns.py` | ✓ o | ✓ |
| Subir el sitio (`./deploy/deploy.sh`, sin sudo) | ✓ o | ✓ |
| Comprobar que todo responde bien | ✓ o | ✓ |

Si en algún paso quieres que lo haga yo, dímelo con el número del paso.

### Orden recomendado

| # | Tarea | Tiempo | Bloquea |
|---|---|---|---|
| 1 | Clave del formulario (Web3Forms) | 10 min | Que lleguen los pedidos |
| 2 | Registro DNS `dhc` | 5 min | Todo lo demás de la VPS |
| 3 | Preparar la VPS | 30 min | Publicar |
| 4 | Primer despliegue y comprobaciones | 15 min | — |
| 5 | Umami (analítica) | 30–40 min | Medir visitas y llamadas |
| 6 | Search Console y Bing | 15 min + esperar | SEO |
| 7 | Revisión del español | cuando puedas | Salir de "vista previa" |
| 8 | Cuestionario al dueño | cuando puedas | Salir de "vista previa", páginas por servicio |

Las tareas 1, 7 y 8 no dependen de la VPS: puedes empezarlas ya.

### Regla de oro con la VPS

La máquina es la de **TTrack**. Antes y después de tocar algo, comprueba que TTrack sigue bien:

```bash
ssh ttrack 'systemctl is-active ttrack-poller'
```

Debe decir `active`. (Si aún no mudaste el poller de TTrack a la VPS, dirá `inactive` o `unknown`: anótalo antes de empezar para saber que no lo cambió DHC.) Nunca uses `systemctl restart caddy` (siempre `reload`), no toques los registros DNS `ttrack` ni `tel`, ni el puerto 4443.

---

## Tarea 1 · Clave del formulario (Web3Forms)

El sitio es estático: cuando alguien pide un estimado, Web3Forms recibe el formulario y lo manda por correo.

1. Entra en <https://web3forms.com> y crea una cuenta (para las pruebas, con tu correo; cuando el sitio sea del cliente, se crea otro formulario con el correo del dueño, pregunta I2).
2. **Create Your First Form**:
   - **Form Name:** `DHC Woodcraft (pruebas)`.
   - **Website URL:** `localhost` para la prueba en tu Mac. **Al publicar**, cambia (o añade) `dhc.psalazar.dev` en la configuración del formulario: si Web3Forms filtra por sitio, los envíos desde el dominio real fallarían con `localhost`.
3. En el paso siguiente te da la **Access Key** (una cadena larga tipo `a1b2c3d4-…`). Es pública por diseño: no pasa nada porque vaya en el código del navegador. Los pedidos llegan al correo de la cuenta.
4. Revisa en su web los límites del plan gratuito (envíos al mes) por si acaso.
5. En tu Mac, dentro del proyecto, crea el archivo `.env.local` (no se sube a git):

   ```bash
   cd ~/Project/dhc && cp .env.example .env.local && open -e .env.local
   ```

   Pega la clave en la línea `NEXT_PUBLIC_FORM_ACCESS_KEY=` y guarda.

**Comprobar:**

```bash
npm run build && npx serve out -l 4173
```

Abre <http://localhost:4173/es/#estimado>, rellena el formulario con datos de prueba y envíalo. Debe aparecer "¡Gracias! Te contactaremos pronto." y llegarte un correo (mira también en spam). Para parar el servidor: `Ctrl+C`.

**Si falla:** aparece "Algo salió mal. Llámanos al…". Revisa que la clave esté bien copiada, sin espacios, que hiciste `npm run build` **después** de guardar `.env.local` y que la Website URL del formulario en Web3Forms coincide con donde pruebas (`localhost` en local, `dhc.psalazar.dev` publicado).

---

## Tarea 2 · Registro DNS `dhc`

Desde tu Mac (usa tu herramienta de TTrack y el token que ya tienes):

```bash
python3 ~/Project/TTrack/tools/cf_dns.py add dhc A 152.53.39.211 --no-proxy
```

**Comprobar** (puede tardar un par de minutos):

```bash
dig +short @1.1.1.1 dhc.psalazar.dev A
```

Debe responder `152.53.39.211`. Si no responde todavía, espera y repite contra `@1.1.1.1` (tu resolutor local puede tener una caché negativa unos minutos, como dice tu doc de DNS de TTrack).

**Si falla:** si dice que el registro ya existe, no lo toca (es el comportamiento del script). Si habla de permisos, el token necesita `Zone · DNS · Edit` sobre `psalazar.dev`.

---

## Tarea 3 · Preparar la VPS

Todo en la VPS. Conéctate con:

```bash
ssh ttrack
```

### 3.0 · Ver cómo está el servidor (no cambia nada)

```bash
systemctl is-active ttrack-poller
sudo ufw status verbose
command -v caddy && caddy version && systemctl is-active caddy
ls -la /etc/caddy/ 2>/dev/null && sudo cat /etc/caddy/Caddyfile 2>/dev/null
command -v docker && docker --version
```

**Mándame la salida** antes de seguir: según lo que haya (sobre todo si Caddy ya existe y qué tiene su `Caddyfile`), ajustamos 3.3.

### 3.1 · Carpeta del sitio

```bash
sudo mkdir -p /var/www/dhc/releases
sudo chown -R "$USER:$USER" /var/www/dhc
ls -ld /var/www/dhc /var/www/dhc/releases
```

Las dos líneas deben mostrar tu usuario como dueño. Así los despliegues no necesitan `sudo`.

### 3.2 · Cortafuegos: abrir 80 y 443

```bash
sudo ufw allow 80,443/tcp
sudo ufw status verbose
```

Deben aparecer `80,443/tcp ALLOW IN` (además de `OpenSSH`). El 80 hace falta para obtener el certificado y redirigir a HTTPS.

### 3.3 · Caddy

**Si `command -v caddy` no devolvió nada (no está instalado)**, instálalo desde su repositorio oficial (la versión de Debian se queda atrás):

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
caddy version
```

**Caddyfile principal.** Cada proyecto va en su propio archivo dentro de `/etc/caddy/sites/`:

```bash
sudo mkdir -p /etc/caddy/sites
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak-$(date +%Y%m%d)
```

- **Caso A, Caddy recién instalado** (el `Caddyfile` solo tiene el bloque de ejemplo `:80 { root * /usr/share/caddy … }`): reemplázalo entero por una sola línea:

  ```bash
  echo 'import sites/*.caddy' | sudo tee /etc/caddy/Caddyfile
  ```

- **Caso B, Caddy ya sirve algo de TTrack:** no borres nada; añade la línea al final:

  ```bash
  echo 'import sites/*.caddy' | sudo tee -a /etc/caddy/Caddyfile
  ```

  Si dudas en cuál estás, mándame el contenido del `Caddyfile` del paso 3.0.

### 3.4 · Config de DHC

Desde **tu Mac** (otra terminal, no la de la VPS):

```bash
scp ~/Project/dhc/deploy/caddy/dhc.caddy ttrack:/tmp/dhc.caddy
```

De vuelta en la **VPS**:

```bash
sudo install -m 644 /tmp/dhc.caddy /etc/caddy/sites/dhc.caddy && rm /tmp/dhc.caddy
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

Debe terminar en `Valid configuration`. **Solo entonces**, recarga (sin cortar conexiones):

```bash
sudo systemctl reload caddy
systemctl is-active caddy ttrack-poller
```

Las dos líneas deben decir `active`.

**Si falla:**

- Si `validate` da error, no recargues: vuelve a poner la copia (`sudo cp /etc/caddy/Caddyfile.bak-FECHA /etc/caddy/Caddyfile`) y mándame el mensaje.
- Si después de recargar algo va mal: `sudo rm /etc/caddy/sites/dhc.caddy && sudo systemctl reload caddy` deja Caddy como estaba.

---

## Tarea 4 · Primer despliegue y comprobaciones

### 4.1 · Subir el sitio

Desde **tu Mac**, en el proyecto:

```bash
cd ~/Project/dhc && ./deploy/deploy.sh
```

Hace lint, build, sube a `/var/www/dhc/releases/<fecha>/` y activa la versión nueva cambiando el enlace `current` (un cambio instantáneo). Guarda las últimas 5 versiones.

Si algo sale mal tras publicar, se vuelve a la anterior con:

```bash
./deploy/deploy.sh --rollback
```

### 4.2 · Comprobar

```bash
curl -sI -H 'Accept-Language: es-MX' https://dhc.psalazar.dev/ | grep -iE '^HTTP|location'
curl -sI -H 'Accept-Language: en-US' https://dhc.psalazar.dev/ | grep -iE '^HTTP|location'
curl -sI https://dhc.psalazar.dev/es/ | grep -iE '^HTTP|cache-control|strict-transport'
curl -s -o /dev/null -w '%{http_code}\n' https://dhc.psalazar.dev/en/no-existe
```

Lo esperado:

1. `302` con `location: /es/`.
2. `302` con `location: /en/`.
3. `200`, `cache-control: no-cache` y `strict-transport-security`.
4. `404`.

Abre en el navegador <https://dhc.psalazar.dev/es/> y <https://dhc.psalazar.dev/en/>: el candado debe salir correcto (Caddy obtiene el certificado solo; la primera vez puede tardar unos segundos).

Y la regla de oro, al final:

```bash
ssh ttrack 'systemctl is-active ttrack-poller caddy'
```

---

## Tarea 5 · Umami (analítica)

Cuenta visitas y, sobre todo, llamadas y pedidos de estimado. Sin cookies y sin banner. Se puede hacer más adelante: el sitio funciona sin ella.

### 5.1 · Docker (si `command -v docker` no devolvió nada en 3.0)

En la **VPS**, con las instrucciones oficiales de Docker para Debian:

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run --rm hello-world
```

La última línea debe imprimir "Hello from Docker!".

### 5.2 · Levantar Umami

Desde **tu Mac**:

```bash
scp ~/Project/dhc/deploy/umami/docker-compose.yml ttrack:/tmp/umami-compose.yml
```

En la **VPS**:

```bash
sudo mkdir -p /opt/umami
sudo install -m 644 /tmp/umami-compose.yml /opt/umami/docker-compose.yml && rm /tmp/umami-compose.yml
printf 'POSTGRES_PASSWORD=%s\nAPP_SECRET=%s\nTWO_FACTOR_ENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" | sudo tee /opt/umami/.env > /dev/null
sudo chmod 600 /opt/umami/.env
cd /opt/umami && sudo docker compose up -d
sudo docker compose ps
curl -s http://127.0.0.1:3001/api/heartbeat; echo
```

`docker compose ps` debe mostrar los dos servicios `running` (o `healthy`), y el `curl` responder algo como `{"ok":true}`.

**Importante:** Umami solo escucha en `127.0.0.1` (Docker se salta ufw; así no queda expuesto). Compruébalo:

```bash
sudo ss -ltnp | grep 3001
```

Debe salir `127.0.0.1:3001`, nunca `0.0.0.0:3001`.

### 5.3 · DNS y Caddy para `stats`

En **tu Mac**:

```bash
python3 ~/Project/TTrack/tools/cf_dns.py add stats A 152.53.39.211 --no-proxy
dig +short @1.1.1.1 stats.psalazar.dev A
```

En el repo, descomenta el bloque `stats.psalazar.dev { … }` al final de `deploy/caddy/dhc.caddy` (o pídemelo) y repite el paso 3.4 (copiar, `validate`, `reload`).

### 5.4 · Primer acceso y alta del sitio

1. Abre <https://stats.psalazar.dev>. Usuario inicial `admin`, contraseña `umami` (los de fábrica de Umami).
2. **Cambia la contraseña en ese mismo momento** (Settings → Profile), guárdala en tu gestor y, si quieres, activa el doble factor.
3. Settings → Websites → **Add website**: nombre `DHC Woodcraft`, dominio `dhc.psalazar.dev`.
4. Copia el **Website ID** (un UUID).
5. En tu Mac, en `.env.local`, pon `NEXT_PUBLIC_UMAMI_WEBSITE_ID=` con ese ID (las otras dos líneas de Umami ya vienen bien en `.env.example`).
6. Vuelve a desplegar: `./deploy/deploy.sh`.

**Comprobar:** abre <https://dhc.psalazar.dev/es/>, pulsa el botón de llamar (en el ordenador no pasa nada grave) y el de "Estimado gratis". En Umami → Realtime debe aparecer la visita y, en Events, `click_call_es` y `click_estimate_cta`.

---

## Tarea 6 · Search Console y Bing

### 6.1 · Google Search Console

1. Entra en <https://search.google.com/search-console> con la cuenta de Google que quieras usar (lo ideal, más adelante, la de la empresa: pregunta I3).
2. **Agregar propiedad → Prefijo de URL** → `https://dhc.psalazar.dev/`. No uses la opción "Dominio": daría acceso a todos tus subdominios de `psalazar.dev`.
3. Método de verificación: **Archivo HTML**. Descarga el archivo (`googleXXXXXXXX.html`).
4. Pásamelo, o cópialo tú en `~/Project/dhc/public/` y despliega con `./deploy/deploy.sh`.
5. Pulsa **Verificar** en Search Console.
6. Menú **Sitemaps** → escribe `sitemap.xml` → **Enviar**.

En unos días verás qué búsquedas muestran el sitio. Revisa también **Indexación de páginas**: `/en/` y `/es/` deben aparecer como indexadas, sin errores de hreflang.

### 6.2 · Bing Webmaster Tools

1. Entra en <https://www.bing.com/webmasters>.
2. Elige **Importar desde Google Search Console**: copia la propiedad y el sitemap sin repetir la verificación.

### 6.3 · Rich Results Test

Con el sitio publicado, abre <https://search.google.com/test/rich-results>, pega `https://dhc.psalazar.dev/es/` y repite con `/en/`. Debe detectar las preguntas frecuentes (FAQ) y la empresa local sin errores. Mándame una captura si sale algo en rojo.

---

## Tarea 7 · Revisión del español

Hace falta que un hablante nativo, idealmente de Texas, lea los textos en español.

1. Mándale <https://dhc.psalazar.dev/es/> (o, antes de publicar, una captura de cada sección).
2. Pídele que marque lo que suene a traducción, demasiado formal o raro. Se usa "tú".
3. Las correcciones pueden llegar como lista ("donde dice X, mejor Y") o marcadas en `docs/04-contenido.md`, columna ES. Pásamelas y las aplico en `src/content/es.ts`.

---

## Tarea 8 · Cuestionario al dueño

1. Envía la parte "Cuestionario" de `docs/07-cuestionario-dueno.md` (desde el título "Cuestionario — Sitio web de DHC…" hasta el final). Puede contestar por escrito, con notas de voz o en una llamada contigo.
2. Pide también los archivos de la lista final: logo original, fotos con su descripción y reseñas con permiso.
3. Cuando tengas las respuestas, pásamelas tal cual. Yo las vuelco en `site.ts` y en los textos (tarea T26), quito el modo "vista previa" y preparo las páginas por servicio (fase 1.5).

Si prefieres mandarle algo más cómodo que un archivo Markdown (un documento para compartir o un formulario en línea), dímelo y lo preparo.

---

## Lista final

- [ ] 1 · Clave de Web3Forms en `.env.local` y envío de prueba recibido
- [ ] 2 · `dig +short @1.1.1.1 dhc.psalazar.dev` → `152.53.39.211`
- [ ] 3 · VPS: `/var/www/dhc` tuyo, ufw 80/443, Caddy con `sites/dhc.caddy`, TTrack `active`
- [ ] 4 · `https://dhc.psalazar.dev/` redirige por idioma, 404 por idioma, candado correcto
- [ ] 5 · Umami en `stats.psalazar.dev` con contraseña cambiada y eventos llegando
- [ ] 6 · Search Console verificado y sitemap enviado; Bing importado; Rich Results sin errores
- [ ] 7 · Español revisado
- [ ] 8 · Cuestionario enviado / respondido
