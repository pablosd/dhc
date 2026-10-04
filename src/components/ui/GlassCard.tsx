import type { ElementType, ReactNode } from "react";

type Props = {
  /** dark: sobre fondos oscuros (hero, proceso). map: sobre el mapa claro. */
  variant?: "dark" | "map";
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

// Panel de vidrio esmerilado (docs/03 → Vidrio esmerilado).
export function GlassCard({ variant = "dark", as: Tag = "div", className = "", children }: Props) {
  return <Tag className={`glass glass-${variant} ${className}`}>{children}</Tag>;
}
