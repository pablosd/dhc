import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

// Contenedor de 1200 px con márgenes de 20 px (móvil) y 32 px (escritorio).
export function Container({ as: Tag = "div", className = "", children }: Props) {
  return <Tag className={`mx-auto w-full max-w-site px-5 md:px-8 ${className}`}>{children}</Tag>;
}
