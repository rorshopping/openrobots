# Deploy runbook — OpenRobots on Vercel

Copy-paste-ready, verified against Vercel CLI 58.x (Sept 2026). Production URL
defaults to `https://openrobots.vercel.app` (see `lib/config.ts`; override with
`NEXT_PUBLIC_SITE_URL` if you attach a custom domain).

The site is 100% client-side with no backend — there is nothing to provision,
no database, no serverless functions to configure.

## 1. One-time setup

```bash
vercel login
```

Browser flow. This machine is already authenticated as `rorshopping`.

## 2. Link the project

From the repo root:

```bash
vercel link --yes
```

This creates/links a project named after the folder. (Skipping this is fine —
the first plain `vercel` run prompts for the same choices interactively.)

## 3. Deploy

```bash
vercel              # preview deployment
vercel --prod --yes # production deployment
```

Note: the **first** deploy of a brand-new project goes to production even
without `--prod`.

## 4. Environment variables

```bash
vercel env add NEXT_PUBLIC_BMC_SLUG production
vercel env add NEXT_PUBLIC_GITHUB_URL production   # optional
```

Both are **build-time** constants in Next.js (`NEXT_PUBLIC_*` is inlined at
build). After adding or changing them you **must redeploy** for the change to
appear. For local development, put them in `.env.local` (gitignored).

Both variables are optional by design: when unset, the Buy Me a Coffee button
and GitHub links simply don't render — no dead links.

## 5. Notes & limits (Hobby plan)

- **100 GB bandwidth/month.** Overage *pauses* the site, never charges.
- `.vercel/` holds the project link identity — it is gitignored; never commit it.
- **Custom domain:** `vercel domains add <domain>` (or the dashboard), then add
  the domain to the project (`vercel domains inspect <domain>` for DNS records).
  Candidate names to buy: `openrobots.app`, `openrobots.dev`. If you attach one,
  set `NEXT_PUBLIC_SITE_URL=https://<domain>` and redeploy so `robots.txt`,
  `sitemap.xml`, and canonical URLs follow.

## 6. GitHub repository

When the user is ready to make the repo public:

```bash
gh repo create openrobots --public --source=. --push
```

Do not run this casually — it publishes the code and creates the remote in one
step. CI (`.github/workflows/ci.yml`) runs on every push/PR: unit tests,
typecheck, and a production build.

## What CI checks

1. `npx vitest run --passWithNoTests` — unit tests (`lib/` pure functions)
2. `npx tsc --noEmit` — type check
3. `npm run build` — Next.js production build (also renders the OG image)

A green CI means the deploy will succeed; Vercel re-runs the build on its own
infrastructure on every push to the linked repo.
