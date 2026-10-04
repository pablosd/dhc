#!/usr/bin/env node
// Optimiza las fotos para la web (docs/02-arquitectura.md → Imágenes).
//
//   node scripts/optimize-images.mjs [carpeta-origen]
//
// Lee assets/photos/*.{jpg,jpeg,png,webp} (o la carpeta indicada) y escribe en
// public/images/ las versiones AVIF y WebP a 640, 960 y 1600 px de ancho
// (nunca más anchas que el original). Actualiza src/content/images.json con
// el ancho, alto y anchos disponibles de cada foto; el componente <Photo> lo
// lee para generar srcset y reservar el espacio (sin CLS).
//
// El nombre del archivo es el nombre de la foto: usa nombres descriptivos
// (custom-kitchen-cabinets-austin.jpg), ayudan al SEO.

import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, basename, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const SRC_DIR = resolve(process.argv[2] ?? join(ROOT, "assets/photos"));
const OUT_DIR = join(ROOT, "public/images");
const MANIFEST = join(ROOT, "src/content/images.json");
const WIDTHS = [640, 960, 1600];
const FORMATS = {
  avif: { quality: 50, effort: 6 },
  webp: { quality: 72, effort: 5 },
};

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  let files;
  try {
    files = (await readdir(SRC_DIR)).filter((f) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(extname(f).toLowerCase()),
    );
  } catch {
    console.error(`No existe la carpeta de origen: ${SRC_DIR}`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.log(`Sin fotos en ${SRC_DIR}. Nada que hacer.`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const manifest = await readManifest();

  for (const file of files) {
    const name = basename(file, extname(file));
    const input = sharp(join(SRC_DIR, file)).rotate(); // respeta la orientación EXIF
    const { width, height } = await input.metadata();
    if (!width || !height) throw new Error(`No se pudo leer el tamaño de ${file}`);

    const widths = WIDTHS.filter((w) => w <= width);
    if (widths.length === 0) widths.push(width);

    for (const w of widths) {
      for (const [format, options] of Object.entries(FORMATS)) {
        await input
          .clone()
          .resize({ width: w, withoutEnlargement: true })
          [format](options)
          .toFile(join(OUT_DIR, `${name}-${w}.${format}`));
      }
    }

    manifest[name] = { width, height, widths };
    console.log(`✓ ${name}: ${widths.join(", ")} px (avif + webp)`);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Manifiesto actualizado: ${MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
