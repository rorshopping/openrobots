# 🤖 OpenRobots

**Decide how AI sees your site.**

[![Live site](https://img.shields.io/badge/live-openrobots.vercel.app-059669)](https://openrobots.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-35%20passing-16a34a)](#quickstart)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)

OpenRobots is a free, open-source, 100% client-side web tool that lets anyone decide how AI crawlers interact with their site. Generate a `robots.txt` that allows, blocks, or audits 80+ AI crawlers — plus a matching `llms.txt`. No backend, no tracking, no signup.

![OpenRobots — the robots.txt generator for AI crawlers](docs/screenshot.png)

## What it does

The site is a single page with three tools in one tabbed interface:

- **Generator** — toggle-based `robots.txt` generator covering 80+ known AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider…), grouped by category, with one-click presets like "Block all AI", "Block training only", and "Allow assistants, block training".
- **Audit** — paste your existing `robots.txt` and see which AI agents it blocks, which notable ones are missing, and which user-agents are unknown or possibly misspelled.
- **llms.txt** — a simple generator for the emerging [`llms.txt`](https://llmstxt.org) standard: site info plus structured link sections, output as ready-to-paste markdown.

## Privacy: 100% client-side

Everything runs in your browser. There is no backend, no API, no analytics, no cookies, and no account. Nothing you toggle or paste ever leaves your device — the tool works with networking disabled after the first load.

## Quickstart

Requires Node ≥ 20.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the test suite and checks:

```bash
npm test
npm run lint
```

## Environment variables

All optional — the site works with sensible defaults and hides optional integrations when unset.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://openrobots.vercel.app` | Canonical site URL used for metadata/SEO. |
| `NEXT_PUBLIC_BMC_SLUG` | _(unset)_ | Buy Me a Coffee username. Unset = support buttons don't render (never a dead link). See [docs/BUY-ME-A-COFFEE-SETUP.md](docs/BUY-ME-A-COFFEE-SETUP.md). |
| `NEXT_PUBLIC_GITHUB_URL` | _(unset)_ | GitHub repo URL. Unset = GitHub links don't render. |

Set them locally in `.env.local`, or in production via `vercel env add`.

## Support

OpenRobots is free and shows no ads. If it saved you time, [☕ buy us a coffee](https://www.buymeacoffee.com/richardor) — it keeps the crawler database updated.

## Credits

- Crawler data: the community-maintained [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) list.
- `llms.txt` format: the [llms.txt specification](https://llmstxt.org).

## License

[MIT](LICENSE) — © 2026 OpenRobots contributors.
