import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Allow, block, or audit 50+ AI crawlers — GPTBot, ClaudeBot, PerplexityBot & more. " +
      "Free, open source, 100% in-browser, no signup. Generate robots.txt and llms.txt in seconds.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
