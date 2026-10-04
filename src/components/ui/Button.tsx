import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "light" | "ghost";

type Common = {
  variant?: Variant;
  icon?: IconName;
  children: ReactNode;
  className?: string;
};

type LinkProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type NativeButtonProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

// Enlace si recibe `href`, <button> si no. Altura mínima 48 px (docs/03).
// Ej. de botón de llamada: <Button href="tel:+1737..." variant="light" icon="phone">.
export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = "primary", icon, children, className = "", ...rest } = props;
  const classes = `btn btn-${variant} ${className}`;
  const content = (
    <>
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
