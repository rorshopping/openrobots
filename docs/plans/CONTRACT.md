# OpenRobots — Shared Build Contract

This document is the single source of truth for all builder agents. If a plan file and this contract disagree, this contract wins. Do not renegotiate the contract; if something is genuinely impossible, note it in your final report.

## 1. What we are building

**OpenRobots** — a free, open-source, 100% client-side web tool that lets anyone decide how AI crawlers interact with their site:

- **Generator**: toggle-based robots.txt generator covering 50+ known AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider…), grouped by category, with one-click presets.
- **Audit**: paste an existing robots.txt → see which AI agents it blocks, which notable ones are missing, and which user-agents are unknown/misspelled.
- **llms.txt**: simple generator for the emerging `llms.txt` standard (site info + structured link sections → ready-to-paste markdown).

One-page site: landing/hero + the tool embedded directly below it + FAQ + support section. No backend. No tracking. No signup. MIT license.

Pitch line (use verbatim in copy): **"Decide how AI sees your site."**
Sub-pitch: "Generate a robots.txt that allows, blocks, or audits 50+ AI crawlers — plus a matching llms.txt. Free, open source, runs entirely in your browser."

## 2. Stack (fixed)

- Next.js **15** (App Router), TypeScript strict, Tailwind CSS **v4** — already scaffolded via `create-next-app@15` (npm, no src-dir, alias `@/*`, Turbopack).
- Node ≥ 20 (CI and this machine have Node 24). Package manager: **npm only**.
- Tests: **Vitest** (node environment, unit tests of `lib/` pure functions only — no React/jsdom testing in MVP).
- No backend, no API routes, no analytics, no cookies, no external fonts beyond the scaffold's Geist.

## 3. File ownership (STRICT — never touch another agent's files)

| Area | Files | Owner |
|---|---|---|
| Data + logic | `data/agents.json`, `lib/config.ts`, `lib/robots.ts`, `lib/presets.ts`, `lib/audit.ts`, `lib/llms.ts`, `lib/types.ts`, `vitest.config.ts`, tests in `lib/__tests__/` | **Agent 1** |
| Generator UI | `components/generator/**` | **Agent 1** |
| Page shell | `app/page.tsx`, `app/layout.tsx`, `app/globals.css` (minimal edits only), `components/Header.tsx`, `components/Footer.tsx`, `components/BuyMeACoffee.tsx`, `README.md`, `LICENSE`, `docs/BUY-ME-A-COFFEE-SETUP.md` | **Agent 2** |
| Deploy + SEO | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`, `public/**` (new assets), `.github/workflows/ci.yml`, `.gitignore` (append `.vercel/`), `docs/DEPLOY.md` | **Agent 3** |

Hard rules:
- Agent 1 must NOT edit `app/page.tsx`, `app/layout.tsx`, or `app/globals.css`. It exposes the tool as a single component (see §6) that Agent 2 mounts.
- Agents 2 and 3 run **in parallel**: neither may edit the other's files; both must NOT run `git commit` (the orchestrator commits after integration).
- Only Agent 1 may add dependencies (vitest). Agents 2/3 must not add any npm packages.
- `app/layout.tsx` metadata is owned by Agent 2 using the exact strings in §7.

## 4. Design system (fixed — do not bikeshed)

- Light theme only. Background white; alternating sections `bg-zinc-50`; text `text-zinc-900`; borders `border-zinc-200`.
- Primary accent: `emerald-600` (hover `emerald-700`). Secondary buttons: `bg-zinc-900 text-white`.
- Fonts: scaffold defaults (Geist + Geist Mono). Code/output panels: `font-mono`, dark panel `bg-zinc-950 text-zinc-100 rounded-xl`.
- Cards: `rounded-xl border border-zinc-200 bg-white shadow-sm`. Max content width `max-w-6xl mx-auto px-4`.
- Brand mark: "🤖 OpenRobots" (emoji + wordmark is fine for MVP).
- Tone of copy: confident, friendly, no hype. Emphasize: free, open source, no signup, nothing leaves your browser, data from the community-maintained ai.robots.txt list.

## 5. Configuration contract — `lib/config.ts` (Agent 1 creates; Agents 2/3 import)

```ts
// lib/config.ts
export const SITE_NAME = "OpenRobots";
export const SITE_TAGLINE = "Decide how AI sees your site.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://openrobots.vercel.app";
// Buy Me a Coffee username (slug). Empty string = not configured -> support UI renders nothing.
export const BMC_SLUG = process.env.NEXT_PUBLIC_BMC_SLUG ?? "";
// GitHub repo URL. Empty string = not configured -> GitHub links render nothing.
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? "";
export const bmcLink = (BMC_SLUG: string) => `https://www.buymeacoffee.com/${BMC_SLUG}`;
```

**Buy Me a Coffee rules (Agent 2 implements):** server component `<BuyMeACoffee />` renders a styled anchor + official button image (`https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=...&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff`). If `BMC_SLUG` is empty, render `null` (never a dead link). Placement: footer "Support" section + one inline mention after the tool output. Do NOT load the floating widget script in MVP.

## 6. Component + logic interface contract

Agent 1 must export exactly this surface (Agents 2/3 may rely on it):

```tsx
// components/generator/GeneratorTabs.tsx  ("use client", default export)
// Tabbed UI: "Generator" | "Audit" | "llms.txt". Self-contained state. No props required.
export default function GeneratorTabs() { ... }
```

```ts
// lib/types.ts
export type AgentCategory = "training" | "assistant" | "search" | "scraper" | "multimodal" | "other";
export interface AgentEntry {
  name: string;        // exact User-agent token, e.g. "GPTBot"
  operator: string;    // e.g. "OpenAI"
  category: AgentCategory;
  purpose: string;     // one-line, human-readable
  respectsRobots?: boolean | "partial";
  website?: string;
}

// lib/robots.ts
export interface RobotsOptions {
  blockedAgents: string[];              // exact user-agent tokens
  sitemapUrls?: string[];
  crawlDelays?: Record<string, number>; // agent name -> seconds
}
export function generateRobots(opts: RobotsOptions): string;
// Output format:
//   # robots.txt generated by OpenRobots — https://openrobots.vercel.app
//   # Decide how AI sees your site.
//   User-agent: GPTBot
//   User-agent: ClaudeBot
//   Disallow: /
//   (blank line)
//   Sitemap: <url>
// If blockedAgents is empty: return a permissive robots.txt
//   (User-agent: * / Allow: /) with the header comments.

// lib/presets.ts
export type PresetId = "block-all" | "allow-all" | "block-training" | "block-except-search";
export const PRESETS: { id: PresetId; label: string; description: string }[];
export function applyPreset(id: PresetId, agents: AgentEntry[]): string[]; // returns blocked agent names
// block-all: every agent blocked. allow-all: []. block-training: block category "training".
// block-except-search: block everything except agents whose purpose/category is search-assistant
// (category "search" or "assistant" — assistant bots fetch pages for a user's direct request).

// lib/audit.ts
export interface AuditResult {
  knownAgentsFound: string[];      // AI agents explicitly listed in the pasted text
  unknownUserAgents: string[];     // user-agent tokens not in our dataset (may be typos)
  missingNotable: string[];        // notable AI agents (top ~10 by prominence) NOT covered
  blocksAllKnownAi: boolean;       // true if every known agent in dataset is disallowed
  warnings: string[];              // human-readable advice lines
}
export function auditRobotsText(text: string, agents: AgentEntry[]): AuditResult;
// Parsing rule (document in code): a group starts at "User-agent:" lines followed by a
// "Disallow:"/"Allow:" line; track the LAST directive group per agent; an agent is
// "blocked" iff its latest group contains "Disallow: /" (root disallow).

// lib/llms.ts
export interface LlmsSection { title: string; links: { title: string; url: string; summary?: string }[] }
export interface LlmsSite { name: string; description: string; url: string; sections: LlmsSection[] }
export function generateLlmsTxt(site: LlmsSite): string;
// Format per the llms.txt spec: "# Site name", "> description", then "## Section" with "- [title](url): summary" bullets.
```

`data/agents.json`: an array of `AgentEntry`. Agent 1 builds it from the community dataset (see Plan 1) and commits a curated snapshot of **≥ 50 agents**. `lib/` modules load it via a shared `lib/agents-data.ts` helper (`import agents from "@/data/agents.json"` + typed export) so JSON is imported once.

## 7. SEO metadata (exact strings — Agent 2 puts in `app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "OpenRobots — Free robots.txt & llms.txt generator for AI crawlers",
  description:
    "Allow, block, or audit 50+ AI crawlers — GPTBot, ClaudeBot, PerplexityBot & more. " +
    "Free, open source, 100% in-browser, no signup. Generate robots.txt and llms.txt in seconds.",
  keywords: ["robots.txt generator", "block GPTBot", "AI crawler list", "llms.txt generator",
    "block AI bots", "robots.txt ai crawlers", "OpenRobots"],
  openGraph: { type: "website", siteName: "OpenRobots", url: SITE_URL }, // images come from app/opengraph-image.tsx (Agent 3) — do NOT set images here
  twitter: { card: "summary_large_image" },
};
```

Do not add an OG image URL to metadata; the `app/opengraph-image.tsx` file convention (Agent 3) wires it automatically.

## 8. Verification rules

- Agent 1 (runs alone): must pass `npm test` (new vitest suite over `lib/`), `npx tsc --noEmit`, `npx next lint`, and `npm run build` before reporting done. Commit in small checkpoints.
- Agents 2 & 3 (parallel): verify with `npx tsc --noEmit` and `npx next lint` ONLY. **Do not run `npm run build`, `npm run dev`, or `git commit`** — concurrent builds collide on `.next/` and the orchestrator owns integration builds.
- Orchestrator (final): full `npm test`, `npm run build`, prod-server browser smoke test, then deploy.

## 9. Global definition of done

1. `npm run build` succeeds with zero errors/warnings that fail lint.
2. All three tool tabs work client-side with no console errors.
3. BMC button renders only when `NEXT_PUBLIC_BMC_SLUG` is set; never a dead link.
4. No backend calls anywhere; tool works with networking disabled after first load.
5. Honest copy: nothing claims endorsement by OpenAI/Anthropic/etc.
