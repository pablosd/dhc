// Iconos de línea propios (docs/03 → Detalles de oficio): trazo 1.75 px,
// esquinas redondeadas, viewBox 24. Decorativos por defecto (aria-hidden);
// si un icono es el único contenido de un botón, el botón lleva aria-label.

const paths = {
  // Servicios
  cabinet: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="10" y1="10" x2="10" y2="13" />
      <line x1="14" y1="10" x2="14" y2="13" />
    </>
  ),
  kitchen: (
    <>
      <rect x="3" y="11" width="18" height="9" rx="1" />
      <rect x="6" y="3" width="12" height="5" rx="1" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </>
  ),
  beam: (
    <>
      <polyline points="3 12 12 4 21 12" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="12" y1="4" x2="12" y2="12" />
      <line x1="8" y1="8.5" x2="8" y2="12" />
      <line x1="16" y1="8.5" x2="16" y2="12" />
    </>
  ),
  molding: (
    <>
      <path d="M5 4h10v4h-4v3H7v9H5z" />
      <path d="M15 8c3 0 4 2 4 4" />
    </>
  ),
  door: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <line x1="15" y1="12" x2="15" y2="13.5" />
    </>
  ),
  deck: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="3" y1="14" x2="21" y2="14" />
      <line x1="5" y1="14" x2="5" y2="21" />
      <line x1="19" y1="14" x2="19" y2="21" />
    </>
  ),
  framing: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <line x1="10" y1="4" x2="10" y2="20" />
      <line x1="14" y1="4" x2="14" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </>
  ),
  hammer: (
    <>
      <path d="M14 4l6 6-3 3-6-6z" />
      <line x1="12" y1="9" x2="4" y2="19" />
    </>
  ),
  // Interfaz
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8.4 19z" />
      <path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.5-2-1-1 1a3.5 3.5 0 0 1-2-2l1-1-1-2z" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </>
  ),
  chevronLeft: <polyline points="15 5 8 12 15 19" />,
  chevronRight: <polyline points="9 5 16 12 9 19" />,
  check: <polyline points="5 12 10 17 19 7" />,
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  pause: (
    <>
      <line x1="9" y1="5" x2="9" y2="19" />
      <line x1="15" y1="5" x2="15" y2="19" />
    </>
  ),
  play: <path d="M7 4l13 8-13 8z" />,
  star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />,
} as const;

export type IconName = keyof typeof paths;

export const iconNames = Object.keys(paths) as IconName[];

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  /** Solo si el icono transmite información por sí mismo. */
  label?: string;
};

export function Icon({ name, size = 24, className, label }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
