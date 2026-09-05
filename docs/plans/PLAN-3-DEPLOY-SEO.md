# Plan 3 — Deploy wiring, SEO surface, CI

Read `docs/plans/CONTRACT.md` first (ownership §3, config §5, metadata §7 are binding). You run **in parallel with Agent 2** — stay in your lane, and **do not run `npm run build`, `npm run dev`, or `git commit`** (orchestrator owns integration). Verify with `npx tsc --noEmit` and `npx next lint` only.

Context: Next.js 15 App Router site for OpenRobots (contract §1). Production URL will initially be `https://openrobots.vercel.app` (that's the `SITE_URL` default in `lib/config.ts` — import it, don't hardcode). App Router file conventions (`app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`) are the right mechanism — no `public/robots.txt`.

## Step 1 — `app/robots.ts`
Use the `MetadataRoute.Robots` convention. Sensible default: allow everything for normal crawlers, explicitly `Disallow` nothing; point `sitemap` to `` `${SITE_URL}/sitemap.xml` ``. Include a comment noting OpenRobots itself welcomes AI crawlers (on-brand).

## Step 2 — `app/sitemap.ts`
`MetadataRoute.Sitemap` with the single `/` route: `{ url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }`.

## Step 3 — `app/manifest.ts`
`MetadataRoute.Manifest`: name "OpenRobots", short_name "OpenRobots", description (contract §7 description), `start_url: "/"`, `display: "standalone"`, background/theme colors (`#ffffff` / `#059669`), an icon entry pointing at `/icon.svg` (next step).

## Step 4 — Icons + OG image
- `app/icon.svg`: simple, clean SVG robot/head glyph or "OR" monogram on `#059669` rounded square, readable at 32px. (App Router serves it as favicon automatically.)
- `public/icon.svg`: same asset (referenced by the manifest).
- `app/opengraph-image.tsx`: use `ImageResponse` from `next/og` (export `size = { width: 1200, height: 630 }`, `contentType = "image/png"`, `alt`). Design: `#059669`→ darker green gradient background, "🤖 OpenRobots" wordmark, tagline "Decide how AI sees your site.", subline "Free · Open source · 100% in-browser". Keep fonts default (no custom font loading — it breaks builds; system fallback is fine). Must render at build time without network access.

## Step 5 — `.gitignore`
Append `.vercel/` and `.env*.local` if not already present (never remove existing entries).

## Step 6 — CI: `.github/workflows/ci.yml`
GitHub Actions: on `push`/`pull_request` to any branch. Single `build` job, `ubuntu-latest`, Node 24 (`actions/setup-node@v4`, `node-version: 24`, npm cache). Steps: `npm ci`, `npm test` (Agent 1 adds vitest; if the script is missing at your runtime, use `npx vitest run --passWithNoTests` so CI doesn't fail on timing), `npx tsc --noEmit`, `npm run build`. Name the workflow "CI".

## Step 7 — `docs/DEPLOY.md`
Current, copy-paste-ready deploy runbook (verified against Vercel CLI 58.x, Sept 2026):
1. One-time: `vercel login` (browser flow; already authenticated on this machine as `rorshopping`).
2. From repo root: `vercel link --yes` (creates/links project named after the folder) — or skip, first `vercel` prompts.
3. Preview: `vercel` · Production: `vercel --prod --yes`.
4. Env vars: `vercel env add NEXT_PUBLIC_BMC_SLUG production` (+ same for `NEXT_PUBLIC_GITHUB_URL` if desired; these are build-time in Next.js — after changing them you must redeploy). Local: `.env.local`.
5. Notes: hobby plan limits (100 GB transfer/mo — overage pauses, never charges), first deploy of a new project goes to production even without `--prod`, `.vercel/` holds link identity (gitignored), custom domain: `vercel domains add ...` / dashboard → suggest `openrobots.app` / `openrobots.dev` as candidates to buy.
6. GitHub: `gh repo create openrobots --public --source=. --push` once the user wants it public (do NOT run this yourself).

## Verify
`npx tsc --noEmit && npx next lint` — both clean. NO build/dev/commit (see top).

## Report back
≤ 150 words: files shipped, tsc/lint status, deviations (with reason).
