import GeneratorTabs from "@/components/generator/GeneratorTabs";
import BuyMeACoffee from "@/components/BuyMeACoffee";
import { GITHUB_URL } from "@/lib/config";

const TRUST_ITEMS = [
  "100% in-browser — nothing is uploaded",
  "No account, no cookies, no tracking",
  "Data from the community ai.robots.txt list",
  "Free forever, MIT licensed",
];

const WHY_CARDS = [
  {
    title: "The AI crawl decision is new",
    body: "Cloudflare now blocks AI crawlers by default on new domains. Whether you opt in or out, every site owner has to make this decision — OpenRobots makes it a two-minute one.",
  },
  {
    title: "Incumbents want $29–$299/mo",
    body: "Existing crawler-management tools put their generator behind a signup wall and a subscription. OpenRobots is free and open source — no account, no upsell.",
  },
  {
    title: "Your rules, your server",
    body: "Copy-paste a plain robots.txt into your site root. No plugin, no proxy, no vendor lock-in — just a text file you fully control.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Should I block GPTBot and other AI crawlers?",
    a: "It depends on your goals. Blocking keeps your content out of AI training corpora and AI answers; allowing can mean broader reach when AI assistants cite and link to you. There is no universally right answer — but there should be a deliberate answer. OpenRobots lets you allow, block, or take a middle path (like allowing assistant bots while blocking training bots) in a few clicks.",
  },
  {
    q: "What's the difference between training bots, assistant bots and search bots?",
    a: "Training bots (like GPTBot and ClaudeBot) collect content to train AI models. Assistant bots fetch a page live when a user directly asks about it. Search bots index the web for AI-powered search results. A popular middle path is \"allow assistants, block training\": your pages stay reachable for real-time answers and citations, but don't feed future model training. The Generator's presets include exactly this option.",
  },
  {
    q: "Does blocking AI crawlers hurt my Google SEO?",
    a: "No. Blocking Google-Extended only stops your content from being used to train Gemini and power AI answers — it does not affect Google Search indexing or ranking. Googlebot is a separate crawler, and OpenRobots never touches it unless you explicitly say so.",
  },
  {
    q: "What is llms.txt?",
    a: "llms.txt is an emerging standard: a markdown file at your site root that gives AI models a clean, curated overview of your site — its name, description, and links to your most important pages. It helps LLMs understand and cite your content accurately. OpenRobots includes a simple llms.txt generator alongside the robots.txt tools.",
  },
  {
    q: "Do bots actually respect robots.txt?",
    a: "Most large, established AI crawlers do — and our crawler list shows which ones are known to respect it and which don't. But robots.txt is a request, not a firewall: some smaller or poorly-behaved bots ignore it. For most sites, robots.txt is the right, standards-based tool; if you need hard guarantees, combine it with server-level or firewall-level rules.",
  },
  {
    q: "Is my data sent anywhere?",
    a: "No. OpenRobots is a static site with no backend. Everything — the crawler list, the generator, the audit, the llms.txt builder — runs entirely in your browser. Nothing you toggle or paste ever leaves your device, and there are no accounts, cookies, or tracking.",
  },
];

export default function Home() {
  return (
    <>
      {/* 1 — Hero */}
      <section className="bg-white pt-16 pb-12 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Open source · MIT · No signup
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Decide how AI sees your site.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Generate a robots.txt that allows, blocks, or audits 50+ AI
            crawlers — plus a matching llms.txt. Free, open source, runs
            entirely in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#generator"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Generate my robots.txt →
            </a>
            <a
              href="#generator"
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              Audit my current robots.txt
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Covers 50+ AI crawlers incl. GPTBot, ClaudeBot, PerplexityBot,
            Google-Extended, CCBot, Bytespider.
          </p>
        </div>
      </section>

      {/* 2 — Trust strip */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-sm text-zinc-700">
          {TRUST_ITEMS.map((item) => (
            <span key={item}>
              <span aria-hidden="true" className="text-emerald-600">
                ✓
              </span>{" "}
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 3 — The tool */}
      <section id="generator" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <GeneratorTabs />
          <p className="mt-6 text-center text-sm text-zinc-500">
            OpenRobots is free — if it saved you time,{" "}
            <BuyMeACoffee variant="text" />
          </p>
        </div>
      </section>

      {/* 4 — Why OpenRobots */}
      <section id="why" className="bg-zinc-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            Why OpenRobots
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {WHY_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-zinc-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — FAQ */}
      <section id="faq" className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-zinc-900 hover:text-emerald-700 [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 inline-block text-emerald-600 transition-transform group-open:rotate-90">
                    ▸
                  </span>
                  {item.q}
                </summary>
                <p className="pb-5 pl-11 pr-5 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Support band */}
      <section className="bg-zinc-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">
              Keep OpenRobots free
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
              OpenRobots is free, open source, and shows no ads. If it saved
              you time wrangling AI crawlers, buying us a coffee keeps the
              crawler database updated and the project moving.
            </p>
            <div className="mt-6">
              <BuyMeACoffee />
            </div>
            {GITHUB_URL ? (
              <p className="mt-5 text-sm text-zinc-500">
                Open source —{" "}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-emerald-700 hover:text-emerald-800"
                >
                  star or fork it on GitHub
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
