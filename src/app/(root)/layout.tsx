import "../globals.css";

// Layout raíz mínimo, solo para "/": redirige al idioma (T04).
export default function RootRedirectLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
