import type { NextConfig } from "next";

// Fase 1: sitio 100 % estático en /out (ver docs/02-arquitectura.md).
// Fase 2: quitar `output` e `images.unoptimized` y servir con `next start`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
