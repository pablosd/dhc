type Props = {
  className?: string;
};

// Veta de madera decorativa (opacidad baja). Se coloca dentro de un elemento
// con `position: relative`; ocupa todo su espacio.
export function WoodGrain({ className = "" }: Props) {
  return <span aria-hidden="true" className={`wood-grain ${className}`} />;
}
