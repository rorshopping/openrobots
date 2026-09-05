# Plan 2 — Landing page, Buy Me a Coffee, docs

Read `docs/plans/CONTRACT.md` first (design tokens §4, config §5, metadata §7, ownership §3 are all binding). You run **in parallel with Agent 3** — stay inside your file ownership, and **do not run `npm run build`, `npm run dev`, or `git commit`** (orchestrator owns integration; concurrent builds collide). Verify with `npx tsc --noEmit` and `npx next lint` only.

Context: Agent 1 is simultaneously delivering `components/generator/GeneratorTabs.tsx` (default export, no props — the whole tool: Generator / Audit / llms.txt tabs) and `lib/config.ts` (contract §5, verbatim). Assume both exist exactly as specified; if a named import fails `tsc`, trust the contract, do not "fix" their files.

## Step 1 — `lib/config.ts` guard
If `lib/config.ts` doesn't exist yet (Agent 1 timing), create it exactly per contract §5 — if it does exist, leave it alone.

## Step 2 — `components/BuyMeACoffee.tsx`
Server component per contract §5: official button image via `img.buymeacoffee.com/button-api` (params: `text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=$BMC_SLUG&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff`), wrapped in `<a href={bmcLink(BMC_SLUG)} target="_blank" rel="noopener">`, `alt="Buy us a coffee"`. **Render `null` when `BMC_SLUG` is empty** — never a dead link. Optional `variant?: "button" | "text"` prop: `"text"` renders a small inline "☕ Buy us a coffee" text link for in-flow placements.

## Step 3 — `components/Header.tsx` + `components/Footer.tsx`
- Header (sticky, `backdrop-blur`, border-b): left "🤖 OpenRobots" linking to `/`; right: "Generator" (anchor `#generator`), "FAQ" (`#faq`), GitHub icon link — render the GitHub link ONLY if `GITHUB_URL` is non-empty.
- Footer (`bg-zinc-950 text-zinc-300`): three columns — (1) brand + one-liner "Decide how AI sees your site. Free, open source, 100% in-browser."; (2) Links: Generator, FAQ, GitHub (conditional), "robots data by ai.robots.txt" (https://github.com/ai-robots-txt/ai.robots.txt); (3) **Support**: 2–3 warm sentences ("OpenRobots is free and runs entirely in your browser. If it saved you time, a coffee keeps the crawler database updated.") + `<BuyMeACoffee />`. Bottom bar: `© 2026 OpenRobots · MIT License · No tracking · Crawler data updated Sept 2026`.

## Step 4 — `app/layout.tsx`
Import Header/Footer around `{children}`; add the exact `metadata` object from contract §7 (import `SITE_URL` from `@/lib/config` for `metadataBase`). Keep the scaffold's Geist font setup and `globals.css` import. Do not set `openGraph.images` (Agent 3's `opengraph-image.tsx` handles it).

## Step 5 — `app/page.tsx` (the landing + tool, single page)
Structure top-to-bottom (all server components except the imported tool):
1. **Hero** (`pt-16 pb-12 text-center`): badge pill "Open source · MIT · No signup"; H1 "Decide how AI sees your site."; subhead (contract §1 sub-pitch, verbatim is fine); two CTAs: primary "Generate my robots.txt →" (`<a href="#generator">` styled `bg-emerald-600 hover:bg-emerald-700 text-white`), secondary "Audit my current robots.txt" (`#audit` anchor into the tool or `#generator`). Under CTAs: muted line "Covers 50+ AI crawlers incl. GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider."
2. **Trust strip** (thin, `border-y bg-zinc-50`): 4 inline stats/claims with ✓: "100% in-browser — nothing is uploaded", "No account, no cookies, no tracking", "Data from the community ai.robots.txt list", "Free forever, MIT licensed".
3. **Tool mount**: `<section id="generator" className="..."><GeneratorTabs /></section>` (default import from `@/components/generator/GeneratorTabs`).
4. **Why OpenRobots** (`id="why"`, 3 cards): "The AI crawl decision is new" (Cloudflare made AI-blocking default-on for new domains; every site owner now faces this); "Incumbents want $29–$299/mo" (existing tools signup-wall this; we're free + open source); "Your rules, your server" (copy-paste a plain robots.txt — no plugin, no proxy, no vendor lock-in).
5. **FAQ** (`id="faq"`, use `<details>`/`<summary>` accordions, 6 Q&As, SEO-natural): Should I block GPTBot and other AI crawlers? · What's the difference between training bots, assistant bots and search bots (and why "Allow assistants, block training" is a popular middle path)? · Does blocking AI crawlers hurt my Google SEO? (no — Google-Extended ≠ Googlebot) · What is llms.txt? · Do bots respect robots.txt? (most large AI crawlers do; some don't — badges in our list show this; robots.txt is a request, not a firewall) · Is my data sent anywhere? (no — everything runs in your browser).
6. **Support band** (`bg-zinc-50 rounded-2xl`): heading "Keep OpenRobots free", 1–2 sentences, `<BuyMeACoffee />`, plus muted "Open source — star or fork it on GitHub" (conditional on `GITHUB_URL`).

## Step 6 — `app/globals.css` (minimal)
Only if needed: small additions (e.g. `scroll-behavior: smooth`, `scroll-margin-top` for anchored sections). Do not restructure the Tailwind theme.

## Step 7 — Repo docs
- `README.md` (full rewrite): what/why, screenshot placeholder comment, feature list (3 tabs), "100% client-side" privacy note, quickstart (`npm install && npm run dev`), env vars table (`NEXT_PUBLIC_BMC_SLUG`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_SITE_URL`), credits (ai.robots.txt dataset, llms.txt spec), MIT license badge line.
- `LICENSE`: MIT, "Copyright (c) 2026 OpenRobots contributors".
- `docs/BUY-ME-A-COFFEE-SETUP.md`: 2-minute activation guide — (1) create account at buymeacoffee.com, note username; (2) local: put `NEXT_PUBLIC_BMC_SLUG=<username>` in `.env.local`; (3) production: `vercel env add NEXT_PUBLIC_BMC_SLUG production` then `vercel --prod --yes`; (4) where the button appears (footer + after tool output). Also one paragraph comparing BMC (5% fee) vs Ko-fi (0% platform fee) vs GitHub Sponsors (0% from personal accounts) with a note that the component is easy to duplicate for those later.

## Verify
`npx tsc --noEmit && npx next lint` — both clean. NO build/dev/commit (see top).

## Report back
≤ 200 words: sections shipped, tsc/lint status, any deviations from contract (with reason).
