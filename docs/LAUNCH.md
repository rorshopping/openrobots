# OpenRobots — Launch & Advertising Kit

Everything below is copy-paste ready. Live site: https://openrobots.vercel.app · Repo: https://github.com/rorshopping/openrobots

## Core talking points (use everywhere)

- Every site owner must now decide how AI crawlers treat them — Cloudflare flipped the default to "block AI" (1M+ sites opted in before it was even default).
- The leading tool (Dark Visitors) is a $29–$299/mo signup-walled SaaS. OpenRobots is free, no signup, open source, MIT.
- 82 known AI crawlers with plain-English explanations, grouped: training bots / assistant bots / search bots / scrapers — plus a "block training, keep assistants" middle path most people actually want.
- Audits your existing robots.txt: finds missing AI bots and typos, warns which bots ignore robots.txt anyway (Bytespider, DeepSeekBot…).
- Generates llms.txt too — the emerging standard for making sites LLM-readable.
- 100% in-browser: nothing is uploaded, no account, no tracking, data from the community ai.robots.txt project.
- Key misconception to correct in comments: blocking "AI" does NOT hurt Google SEO (Google-Extended ≠ Googlebot).

## 1. Show HN (highest-leverage single post)

- **When**: Tuesday–Thursday, 8:00–10:00 AM US Eastern. Avoid Mondays/Fridays.
- **Title** (exactly this style): `Show HN: OpenRobots – Free, open-source robots.txt generator for AI crawlers`
- **URL**: `https://openrobots.vercel.app` (submit the site, not the repo — the repo is linked on the page)
- **First comment** (post it yourself immediately after submitting):

> Hi HN! I built OpenRobots because every site owner now has to answer a new question — "do I let AI crawlers in?" — and the tools answering it are either Cloudflare-only or a $29+/mo signup-walled SaaS.
>
> It's a single-page client-side app: toggle through 82 known AI crawlers (GPTBot, ClaudeBot, Bytespider, Google-Extended…) grouped into training/assistant/search/scraper, hit a preset like "block training bots, keep assistants," and copy a correct robots.txt. It also audits your existing robots.txt for missing/misspelled AI bots and generates llms.txt.
>
> Everything runs in your browser — the crawler database is a bundled JSON snapshot of the community ai.robots.txt project, so there's no backend, no account, no tracking. MIT on GitHub: https://github.com/rorshopping/openrobots
>
> Happy to answer questions — particularly interested in feedback on the "block training, allow assistants" default debate and the llms.txt generator.

- **Reply strategy**: answer every comment in the first 3 hours; if someone says "just use Cloudflare," the answer is "not everyone is behind Cloudflare, and robots.txt is portable across any host."

## 2. X / Twitter

**Post 1 (standalone):**
> Every website now has to decide: do you let AI crawlers (GPTBot, ClaudeBot, Bytespider…) in?
>
> I built OpenRobots — a free, no-signup generator that turns that decision into two clicks. 82 AI bots explained in plain English, presets, robots.txt audit, llms.txt.
>
> 100% in-browser. Open source. https://openrobots.vercel.app

**Post 2 (the angle that gets shared):**
> Fun fact: Bytespider (ByteDance) is one of the most aggressive AI crawlers on the web — and it ignores robots.txt.
>
> I made a free tool that tells you which AI bots respect robots.txt and which don't, and generates the right rules either way: https://openrobots.vercel.app

## 3. Reddit (post as a maker, not an ad — each sub has self-promo rules)

- **r/SideProject** — full story post: "I built a free tool for the 'should I block AI crawlers' decision" + screenshot of the generator + link.
- **r/webdev** — frame as a resource: "I kept getting asked whether to block GPTBot — built a free robots.txt generator for AI crawlers (open source)".
- **r/SEO** — lead with the misconception: "Blocking AI crawlers does NOT hurt your Google ranking (Google-Extended ≠ Googlebot) — here's a free tool to set it up properly."
- **r/privacy / r/selfhosted** — privacy angle: "nothing leaves your browser, MIT, no account".
- Post 2–3 days apart, reply to every comment.

## 4. Product Hunt (when ready for a bigger push)

- **Tagline** (≤60 chars): `Decide how AI sees your site — free robots.txt studio`
- **Description**: OpenRobots turns the "should I block AI crawlers?" decision into two clicks. 82 AI bots explained, one-click presets, robots.txt audit, llms.txt generation. Free, open source, 100% in-browser — no signup, no tracking.
- **Topics**: Developer Tools, SEO, GitHub, Artificial Intelligence
- Launch Tue–Thu; have 2–3 friends comment early; make the first comment yourself (the Cloudflare-default story).

## 5. Directories & listings (each takes <10 minutes)

| Where | Angle |
|---|---|
| AlternativeTo | List as alternative to "Dark Visitors" and "Cloudflare AI Crawl Control" |
| Uneed.best / Peerlist / Betalist | Free-tool launch listings |
| SaaSHub, LibHunt, ToolFolio | OSS tool directories |
| GitHub AWESOME lists | PR to llms.txt / LLM-related awesome lists (e.g. the llms.txt spec repo's ecosystem section) |
| Hacker News "Show HN" | See above |

## 6. Content SEO (compounds over time — the real winner)

Write one tutorial and publish on dev.to/Medium + your own GitHub Pages: **"How to block AI crawlers from your website (2026 guide)"** — covering GPTBot/ClaudeBot/Bytespider specifics, the training-vs-assistant distinction, llms.txt, and embedding the tool. These are the exact surging search queries ("block GPTBot", "AI crawler list", "llms.txt generator"). One guide ≈ permanent top-of-funnel.

Also: Google Search Console + Bing Webmaster verification of https://openrobots.vercel.app (sitemap is already live at /sitemap.xml).

## 7. GitHub repo growth

- ✅ Topics set: robots-txt, ai-crawlers, llms-txt, seo, gptbot, claudebot, web-crawler, nextjs, typescript, privacy
- ✅ Homepage set to the live site
- Add a social-preview image (Settings → Social preview — use the generated OG image from /opengraph-image)
- Pin the repo on your GitHub profile

## What I can do for you (with your go-ahead)

- Log you into HN/Reddit/X in ZCode's browser and I'll drive the posting/PRs for you.
- Draft the dev.to article in full.
- The domain (openrobots.app / .dev) is deliberately NOT bought — revisit after first traction.
