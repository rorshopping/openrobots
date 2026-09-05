// lib/config.ts
export const SITE_NAME = "OpenRobots";
export const SITE_TAGLINE = "Decide how AI sees your site.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://openrobots.vercel.app";
// Buy Me a Coffee username (slug). Empty string = not configured -> support UI renders nothing.
export const BMC_SLUG = process.env.NEXT_PUBLIC_BMC_SLUG ?? "";
// GitHub repo URL. Empty string = not configured -> GitHub links render nothing.
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? "";
export const bmcLink = (BMC_SLUG: string) => `https://www.buymeacoffee.com/${BMC_SLUG}`;
