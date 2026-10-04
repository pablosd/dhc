import images from "@/content/images.json";

type ImageEntry = { width: number; height: number; widths: number[] };
const manifest: Record<string, ImageEntry> = images;

type Props = {
  /** Nombre de la foto en src/content/images.json (sin extensión). */
  name: string;
  alt: string;
  /** Atributo sizes, p. ej. "(min-width: 900px) 50vw, 100vw". */
  sizes: string;
  /** Imagen principal (LCP): sin lazy y con fetchpriority alto. */
  priority?: boolean;
  className?: string;
};

// <picture> con AVIF/WebP y srcset generados por scripts/optimize-images.mjs.
// width/height reservan el espacio (sin saltos de diseño). En la fase 2 se
// puede reimplementar con next/image sin cambiar a quien lo usa (docs/02).
export function Photo({ name, alt, sizes, priority = false, className = "" }: Props) {
  const entry = manifest[name];
  if (!entry) {
    throw new Error(`Photo: "${name}" no está en src/content/images.json (¿ejecutaste scripts/optimize-images.mjs?)`);
  }
  const srcSet = (format: string) =>
    entry.widths.map((w) => `/images/${name}-${w}.${format} ${w}w`).join(", ");
  const largest = entry.widths[entry.widths.length - 1];

  return (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/images/${name}-${largest}.webp`}
        alt={alt}
        width={entry.width}
        height={entry.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
