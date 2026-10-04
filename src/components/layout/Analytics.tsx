import Script from "next/script";

// Umami autoalojado (docs/02 → Analítica): ~2 KB, sin cookies. Solo se carga
// si hay configuración; data-domains evita contar visitas de local/preview.
// Los clics se miden con atributos data-umami-event (sin JS propio).
const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS ?? "dhc.psalazar.dev";

export function Analytics() {
  if (!src || !websiteId) return null;
  return <Script src={src} data-website-id={websiteId} data-domains={domains} strategy="afterInteractive" />;
}
