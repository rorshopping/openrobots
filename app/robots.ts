import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

// OpenRobots is pro-crawler: the site itself welcomes AI crawlers, so we set
// no Disallow rules. The tool we ship exists to help *you* decide how
// crawlers interact with *your* site — see https://openrobots.vercel.app.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
