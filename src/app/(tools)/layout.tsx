import { bodyFont, displayFont } from "../fonts";
import "../globals.css";
import "./tools.css";

// Layout raíz de herramientas internas (no forman parte de la landing ni de
// los diccionarios): por ahora, el cuestionario para el dueño.
export default function ToolsLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-US" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
