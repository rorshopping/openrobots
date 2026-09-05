# Plan 1 — Core App (data, logic, generator UI)

Read `docs/plans/CONTRACT.md` first — it defines stack, design system, ownership, and the exact interfaces you must export. This plan runs **alone** (no other agents working concurrently). Work inside `C:\Users\Richard\Documents\Projects\opensource_software`. The Next.js 15 + TS + Tailwind v4 scaffold already exists and `npm install` has been run. You may `git commit` (checkpoints encouraged).

## Step 0 — Orient
- `ls` the repo root; read `package.json`, `app/layout.tsx`, `app/page.tsx` (you will NOT modify these), `tsconfig.json`.
- Confirm `npx tsc --noEmit` passes on the pristine scaffold before changing anything.

## Step 1 — Dataset: `data/agents.json` (commit after this step)
1. Fetch the community-maintained AI crawler dataset: `curl -s https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/main/robots.json` (it maps user-agent → {operator, description, ...}). If unreachable, fall back to the seed list below.
2. Curate to **≥ 50 agents** relevant to AI crawling. For each produce an `AgentEntry` (see contract §5/§6): exact `name` token, `operator`, `category` (`training` | `assistant` | `search` | `scraper` | `multimodal` | `other`), one-line human `purpose`, optional `respectsRobots` and `website`. Write concise original `purpose` strings — do NOT copy descriptions verbatim; summarize.
3. Must include at minimum: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-Search, Google-Extended, GoogleOther, Google-Extended? (verify exact tokens), Applebot-Extended, CCBot, Bytespider, PerplexityBot, Perplexity-User, Amazonbot, FacebookBot, meta-externalagent, meta-externalagent? (verify), Imagesift, Diffbot, YouBot, cohere-ai, Anthropic-ai, MistralAI-User, DeepSeekBot? — verify every token against the fetched dataset; exact casing matters.
4. Also create `lib/agents-data.ts`: imports the JSON, validates/normalizes it, exports `AI_AGENTS: AgentEntry[]` plus `NOTABLE_AGENTS` (top ~10 by prominence for the audit "missing" feature: GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot, Bytespider, Amazonbot, FacebookBot/meta-externalagent, Applebot-Extended, OAI-SearchBot).

Fallback seed if the fetch fails (expand to 50 with well-known entries from memory, marking uncertain ones `category: "other"`): GPTBot (OpenAI, training), ChatGPT-User (OpenAI, assistant), OAI-SearchBot (OpenAI, search), ClaudeBot (Anthropic, training), Claude-User (Anthropic, assistant), Claude-Search (Anthropic, search), Google-Extended (Google, training), GoogleOther (Google, training), Applebot-Extended (Apple, training), CCBbot→CCBot (Common Crawl, training), Bytespider (ByteDance, training), PerplexityBot (Perplexity, training), Perplexity-User (Perplexity, assistant), Amazonbot (Amazon, scraper), FacebookBot (Meta, training), meta-externalagent (Meta, training), Imagesift (Hive, scraper), Diffbot (Diffbot, scraper), YouBot (You.com, assistant), cohere-ai (Cohere, training).

## Step 2 — Pure logic in `lib/` with Vitest (commit after this step)
Implement exactly the functions/signatures from contract §6: `lib/types.ts`, `lib/robots.ts`, `lib/presets.ts`, `lib/audit.ts`, `lib/llms.ts`, `lib/config.ts` (contract §5 — copy it verbatim).
- Install vitest: `npm i -D vitest`. Create `vitest.config.ts` with `resolve.alias { "@": path.resolve(__dirname) }` and `test: { environment: "node" }`. Add scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.
- Tests in `lib/__tests__/` (robots.test.ts, presets.test.ts, audit.test.ts, llms.test.ts, agents-data.test.ts). Cover: empty-blocklist permissive output; multi-agent block formatting exactly as contract §6 shows; sitemap lines; crawl-delay lines; each preset; audit of a sample robots.txt (known agents found, unknown UA flagged, missing notable listed, `blocksAllKnownAi` true/false); llms.txt golden-format test; agents-data sanity (≥ 50 entries, unique names, valid categories).
- Run `npm test` until green.

## Step 3 — Generator UI in `components/generator/` (commit)
Build `GeneratorTabs.tsx` ("use client", default export, no props) with three tabs, following contract §4 design tokens. Use only Tailwind default palette classes; do NOT edit `globals.css`.

**Tab 1 — Generator (default):**
- Preset bar: the 4 presets from `lib/presets.ts` as selectable cards/chips; clicking sets the blocked set.
- Agent list: grouped by category (collapsible group headers with counts), each agent a toggle row: name (mono), operator, purpose (truncated, `title` attr for full), `respectsRobots` badge if false/"partial" ("⚠ ignores robots.txt"). Search/filter input on top. "Select all / none" per group.
- Options row: optional sitemap URL input (comma-separated), optional per-agent crawl-delay (advanced `<details>`).
- Output panel (dark, mono): live `generateRobots()` output; Copy button (navigator.clipboard + "Copied!" feedback); Download `robots.txt` button (Blob + a[download]); char/line count. Under the panel: one-line human summary, e.g. "Blocking 12 of 53 known AI crawlers. Search assistants like OAI-SearchBot will still index you." plus a subtle support line: if `BMC_SLUG` is set, "Does this save you time? <a>☕ Buy us a coffee</a>" using `lib/config.ts`.
- Empty state: `allow-all` → permissive output with explanation text.

**Tab 2 — Audit:** textarea "Paste your robots.txt"; client-side `auditRobotsText()` on change (debounced or on button click — your call, prefer live). Show: verdict card (🟢 blocks all known AI / 🟡 partial / 🔴 allows AI) + `knownAgentsFound`, `missingNotable` (with one-click "Block these" → jumps to Generator tab with them selected), `unknownUserAgents` (labeled "not known AI agents — may be legit search bots or typos"), `warnings` list. A "Try an example" link fills a sample robots.txt.

**Tab 3 — llms.txt:** small form (site name, description, URL, dynamic add/remove sections each with dynamic links: title, URL, optional summary) → live `generateLlmsTxt()` in a dark output panel with Copy/Download `llms.txt`.

- Keep each tab in its own file under `components/generator/` (e.g. `GeneratorTab.tsx`, `AuditTab.tsx`, `LlmsTab.tsx`); `GeneratorTabs.tsx` owns tab state and is the only file Agent 2 will import.
- Accessibility: real `<button>`s, `aria-pressed` on toggles, labels on inputs, focus-visible rings.

## Step 4 — Verify (all must pass before you report)
```bash
npm test && npx tsc --noEmit && npx next lint && npm run build
```
Then `git add -A && git commit -m "feat: core OpenRobots generator (data, logic, UI)"` if not already committed.

## Boundaries
- Do NOT touch: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, anything in Agent 2/3 ownership (contract §3).
- No new npm deps beyond `vitest`. No network calls at runtime — the tool is 100% client-side over bundled JSON.

## Report back
Final message ≤ 250 words: agent count in dataset, test count/pass, any deviations from contract (with reason), and confirm the four verification commands passed.
