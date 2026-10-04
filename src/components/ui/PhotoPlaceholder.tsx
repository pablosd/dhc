import { Icon, type IconName } from "./Icon";
import { Photo } from "./Photo";
import { WoodGrain } from "./WoodGrain";

type Props = {
  /** Icono del servicio que se muestra en el marcador. */
  icon: IconName;
  /** Etiqueta visible del marcador (dict.sample.photo). */
  label: string;
  /** Foto real: si se pasa, sustituye al marcador sin cambiar el layout. */
  photo?: { name: string; alt: string; sizes: string };
  aspect?: "4/3" | "3/2" | "1/1" | "16/9";
  className?: string;
};

// Marcador honesto (docs/03): veta de madera + icono + "Foto del proyecto".
// Nunca se usa una foto de stock en su lugar.
export function PhotoPlaceholder({ icon, label, photo, aspect = "4/3", className = "" }: Props) {
  return (
    <div className={`photo-frame ${className}`} style={{ aspectRatio: aspect }}>
      {photo ? (
        <Photo name={photo.name} alt={photo.alt} sizes={photo.sizes} />
      ) : (
        <>
          <WoodGrain />
          <Icon name={icon} size={64} className="relative text-oak" />
          <span className="photo-tag">{label}</span>
        </>
      )}
    </div>
  );
}
