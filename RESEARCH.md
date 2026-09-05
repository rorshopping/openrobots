# OpenRobots — Research & Decision Record (Sept 2026)

Three parallel research streams informed this project's choice: (A) open-source monetization landscape, (B) demand analysis for `Open*` tool ideas, (C) integration specifics (Buy Me a Coffee, Vercel CLI). Detailed build plans live in `docs/plans/`.

## Decision

**Build: OpenRobots** — a free, open-source, 100% client-side robots.txt + llms.txt studio for the AI-crawler era. Toggle 50+ known AI agents on/off with presets ("Block all AI", "Allow assistants, block training"), audit an existing robots.txt for gaps, generate a matching llms.txt. Modest monetization via a Buy Me a Coffee button.

## Why this one (evidence)

- **Mainstream, current problem.** Cloudflare made AI-crawler blocking default-on for new domains (July 2025) after 1M+ customers opted in ([Cloudflare PR](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/), [The Verge](https://www.theverge.com/news/695501/cloudflare-block-ai-crawlers-default)). AI crawlers fetch far more than they refer: OpenAI ~1500:1, Anthropic ~3000:1 crawl:refer ([Cloudflare Radar](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/)).
- **The best dataset has no good free tool.** The canonical list [ai-robots-txt/ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) (~4,100★) is raw data you must hand-assemble into robots.txt.
- **Incumbents pivoted to paywalls.** Dark Visitors (the leading tool) now requires signup and funnels to $29–$299/mo SaaS ([knownagents.com](https://knownagents.com/)); Cloudflare's generator only serves Cloudflare customers; scattered WordPress plugins elsewhere. A free, no-signup, open-source web tool is the visible gap.
- **Audience demonstrably pays for this problem** — the monetization precondition. Same audience pays $9/mo for llms.txt monitors.
- **SEO tailwind**: surging queries — "block GPTBot", "AI crawler list", "robots.txt generator for AI", "llms.txt generator".
- **Name is clean**: `openrobots` free on npm (verified 404); no GitHub project with traction owns the brand.
- **Perfectly client-side**: pure text transformation over a bundled JSON dataset — no backend, no scraping, nothing leaves the browser (also makes it un-DDoS-able and free to host — see trend 3 below).

## Runner-ups considered

- **OpenLLMsTxt** (llms.txt generator, 2,601★ spec repo, 161 HN threads) — real but the spec's adoption is contested and generation favors server-side crawling. Absorbed into OpenRobots as the third tab instead.
- **OpenDiff** — diffchecker.com paywalls features; privacy-first diff has HN traction, but weak moat vs local editors.
- Rejected: OpenRegex/OpenJSON (dominant free incumbents regex101/jsonlint), OpenCron (crontab.guru is perfect + npm name reserved), OpenJWT (jwt.io + 8 vendor clones), OpenHook (needs backend by definition), OpenCSV (name taken by famous Java lib), OpenQR (brutalist SEO niche).

## Monetization research (context for the coffee button)

- Platform fees: GitHub Sponsors **0%** from personal accounts; Ko-fi **0% platform** fee on tips; Buy Me a Coffee flat **5%** + processing, weekly payouts ([fees sources](https://help.buymeacoffee.com/en/articles/4539170-frequently-asked-questions)). We ship BMC as requested (best-known "coffee" brand, polished widget); the component is trivially duplicable for Ko-fi/Sponsors later — see `docs/BUY-ME-A-COFFEE-SETUP.md`.
- What earns donations: developer audiences, **recurring-use** tools, a visible in-product ask. Evidence: IT-Tools (40.5k★, sponsor link), Caleb Porzio $100k→$1M/yr via daily-use OSS, LocalSend's in-app donate buttons. Realistic hobby-scale expectation: coffee money ($10–300/mo), scaling with traffic — not salary replacement ([Tidelift: 60% of maintainers unpaid](https://www.sonarsource.com/the-2024-tidelift-maintainer-impact-report.pdf)).
- Ceiling reference: Photopea (solo dev, free hosted tool) ~$3M/yr via ads/premium — the model's upside if traffic hits ([Indie Hackers](https://www.indiehackers.com/post/tech/making-3m-per-year-with-a-free-product-axW4u1vB6C8f91Z3Lxu5)).

## Trends/problems that shaped the design

1. **AI crawlers hammering sites** (Anubis proof-of-work walls went viral) → pure client-side tools have no server to scrape or pay for.
2. **AI slop drowning maintainers** (curl's "death by a thousand slops") → designed as zero-contribution-needed: data ships as versioned JSON snapshots, not live crawls.
3. **AI collapses tool-building cost** (Octoverse 2025: a repo every 2.5s, TypeScript #1) → differentiation must come from UX, privacy guarantee, distribution — hence client-side-only, no-signup, MIT.
4. **License trust is marketing now** (Redis→AGPL whiplash) → boring, trustworthy MIT.
5. **Maintainer sustainability gap** → the coffee button + "keep the crawler database updated" framing is the honest, modest monetization story.

## Integration notes (verified Sept 2026)

- BMC button: official image API `img.buymeacoffee.com/button-api/?...&slug=<username>` in a plain anchor — zero JS, no hydration issues. Floating widget script exists (`cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js`) but skipped for MVP.
- Vercel CLI 58.9: `vercel --prod --yes` from repo root, zero-config Next.js detection, env via `vercel env add KEY production`. Hobby plan: 100 GB/mo transfer, overage pauses (never charges); formally non-commercial — donations-funded is commonly accepted, ads/paid tiers are not.
