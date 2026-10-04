import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Export estático: se genera una vez en el build (docs/05 §4).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
