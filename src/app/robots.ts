import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// GitHub Pages is a static host, so this route must be generated at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
