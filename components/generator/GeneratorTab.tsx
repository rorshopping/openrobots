"use client";

import { useMemo, useState } from "react";
import OutputPanel from "@/components/generator/OutputPanel";
import { AI_AGENTS } from "@/lib/agents-data";
import { BMC_SLUG, bmcLink } from "@/lib/config";
import { applyPreset, PRESETS, type PresetId } from "@/lib/presets";
import { generateRobots } from "@/lib/robots";
import type { AgentCategory, AgentEntry } from "@/lib/types";

interface GeneratorTabProps {
  blocked: string[];
  onChangeBlocked: (blocked: string[]) => void;
}

const CATEGORY_ORDER: AgentCategory[] = [
  "training",
  "assistant",
  "search",
  "scraper",
  "multimodal",
  "other",
];

const CATEGORY_LABELS: Record<AgentCategory, string> = {
  training: "Training data",
  assistant: "Assistants",
  search: "Search",
  scraper: "Scrapers",
  multimodal: "Multimodal",
  other: "Other",
};

function RobotsBadge({ agent }: { agent: AgentEntry }) {
  if (agent.respectsRobots === false) {
    return (
      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
        ⚠ ignores robots.txt
      </span>
    );
  }
  if (agent.respectsRobots === "partial") {
    return (
      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
        ⚠ partially respects robots.txt
      </span>
    );
  }
  return null;
}

export default function GeneratorTab({ blocked, onChangeBlocked }: GeneratorTabProps) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<AgentCategory>>(new Set(CATEGORY_ORDER));
  const [sitemapInput, setSitemapInput] = useState("");
  const [crawlDelays, setCrawlDelays] = useState<Record<string, number>>({});

  const blockedSet = useMemo(() => new Set(blocked), [blocked]);

  // The active preset is derived (not stored) so manual toggles always stay in sync.
  const activePreset = useMemo<PresetId | null>(() => {
    for (const preset of PRESETS) {
      const presetBlocked = applyPreset(preset.id, AI_AGENTS);
      if (
        presetBlocked.length === blocked.length &&
        presetBlocked.every((name) => blockedSet.has(name))
      ) {
        return preset.id;
      }
    }
    return null;
  }, [blocked, blockedSet]);

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return AI_AGENTS;
    return AI_AGENTS.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.operator.toLowerCase().includes(q) ||
        agent.purpose.toLowerCase().includes(q),
    );
  }, [query]);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        agents: filteredAgents.filter((agent) => agent.category === category),
      })).filter((group) => group.agents.length > 0),
    [filteredAgents],
  );

  const toggleAgent = (name: string) => {
    onChangeBlocked(
      blockedSet.has(name) ? blocked.filter((n) => n !== name) : [...blocked, name],
    );
  };

  const applyPresetById = (id: PresetId) => onChangeBlocked(applyPreset(id, AI_AGENTS));

  const selectGroup = (agents: AgentEntry[], select: boolean) => {
    const names = agents.map((agent) => agent.name);
    onChangeBlocked(
      select
        ? [...new Set([...blocked, ...names])]
        : blocked.filter((name) => !names.includes(name)),
    );
  };

  const toggleGroup = (category: AgentCategory) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const sitemapUrls = useMemo(
    () => sitemapInput.split(",").map((url) => url.trim()).filter(Boolean),
    [sitemapInput],
  );

  const output = useMemo(
    () => generateRobots({ blockedAgents: blocked, sitemapUrls, crawlDelays }),
    [blocked, sitemapUrls, crawlDelays],
  );

  // Human-readable summary line.
  const summary = useMemo(() => {
    const total = AI_AGENTS.length;
    if (blocked.length === 0) {
      return "Nothing is blocked — every crawler can access your site.";
    }
    const base =
      blocked.length === total
        ? `Blocking all ${total} known AI crawlers.`
        : `Blocking ${blocked.length} of ${total} known AI crawlers.`;
    const unblockedFetchers = AI_AGENTS.filter(
      (agent) =>
        (agent.category === "search" || agent.category === "assistant") &&
        !blockedSet.has(agent.name),
    );
    if (unblockedFetchers.length > 0) {
      const showcase =
        unblockedFetchers.find((agent) => agent.name === "OAI-SearchBot") ?? unblockedFetchers[0];
      return `${base} Search assistants like ${showcase.name} will still index you.`;
    }
    return base;
  }, [blocked, blockedSet]);

  const delayedAgents = useMemo(
    () => AI_AGENTS.filter((agent) => blockedSet.has(agent.name)),
    [blockedSet],
  );

  return (
    <div className="space-y-8">
      {/* Presets */}
      <section aria-labelledby="presets-heading">
        <h3 id="presets-heading" className="mb-3 text-sm font-semibold text-zinc-900">
          Quick presets
        </h3>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {PRESETS.map((preset) => {
            const active = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => applyPresetById(preset.id)}
                className={`rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  active
                    ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                    : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <span className="block text-sm font-semibold text-zinc-900">{preset.label}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{preset.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Agent list */}
      <section aria-labelledby="agents-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 id="agents-heading" className="text-sm font-semibold text-zinc-900">
            AI crawlers ({AI_AGENTS.length})
          </h3>
          <div>
            <label htmlFor="agent-filter" className="sr-only">
              Filter agents
            </label>
            <input
              id="agent-filter"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by name, operator, purpose…"
              className="w-64 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {groups.map(({ category, agents }) => {
            const filtering = query.trim().length > 0;
            const isOpen = filtering || openGroups.has(category);
            const blockedInGroup = agents.filter((agent) => blockedSet.has(agent.name)).length;
            return (
              <div
                key={category}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleGroup(category)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-zinc-900">
                      {CATEGORY_LABELS[category]}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                      {blockedInGroup}/{agents.length} blocked
                    </span>
                  </button>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => selectGroup(agents, true)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => selectGroup(agents, false)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      None
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <ul className="grid gap-1.5 border-t border-zinc-100 p-2 sm:grid-cols-2">
                    {agents.map((agent) => {
                      const isBlocked = blockedSet.has(agent.name);
                      return (
                        <li key={agent.name}>
                          <button
                            type="button"
                            aria-pressed={isBlocked}
                            title={agent.purpose}
                            onClick={() => toggleAgent(agent.name)}
                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                              isBlocked
                                ? "border-emerald-600 bg-emerald-50"
                                : "border-zinc-200 bg-white hover:bg-zinc-50"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                isBlocked
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {isBlocked && (
                                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                                  <path
                                    d="M2.5 6.5 5 9l4.5-6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-mono text-sm font-medium text-zinc-900">
                                {agent.name}
                              </span>
                              <span className="block truncate text-xs text-zinc-500">
                                {agent.operator} · {agent.purpose}
                              </span>
                            </span>
                            <RobotsBadge agent={agent} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          {groups.length === 0 && (
            <p className="rounded-xl border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500 shadow-sm">
              No agents match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </section>

      {/* Options */}
      <section aria-labelledby="options-heading" className="space-y-4">
        <h3 id="options-heading" className="text-sm font-semibold text-zinc-900">
          Options
        </h3>
        <div>
          <label htmlFor="sitemap-urls" className="mb-1 block text-sm font-medium text-zinc-700">
            Sitemap URL(s) <span className="font-normal text-zinc-400">(optional, comma-separated)</span>
          </label>
          <input
            id="sitemap-urls"
            type="text"
            value={sitemapInput}
            onChange={(event) => setSitemapInput(event.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
        <details className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <summary className="cursor-pointer text-sm font-medium text-zinc-700 select-none">
            Advanced: per-agent crawl-delay
          </summary>
          {delayedAgents.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              Block some agents first, then set a crawl-delay (in seconds) for them here.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {delayedAgents.map((agent) => (
                <li key={agent.name} className="flex items-center gap-3">
                  <label
                    htmlFor={`crawl-delay-${agent.name}`}
                    className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-700"
                  >
                    {agent.name}
                  </label>
                  <input
                    id={`crawl-delay-${agent.name}`}
                    type="number"
                    min={0}
                    step={1}
                    value={crawlDelays[agent.name] ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCrawlDelays((prev) => {
                        const next = { ...prev };
                        if (value === "") delete next[agent.name];
                        else {
                          const parsed = Number(value);
                          if (Number.isFinite(parsed)) next[agent.name] = parsed;
                        }
                        return next;
                      });
                    }}
                    className="w-20 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-right text-sm text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="text-xs text-zinc-400">sec</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-zinc-400">
            Note: only some crawlers honor Crawl-delay. Malicious bots ignore it entirely.
          </p>
        </details>
      </section>

      {/* Output */}
      <section aria-labelledby="output-heading">
        <h3 id="output-heading" className="mb-3 text-sm font-semibold text-zinc-900">
          Your robots.txt
        </h3>
        <OutputPanel label="robots.txt — live preview" output={output} filename="robots.txt" />
        <p className="mt-3 text-sm text-zinc-700">{summary}</p>
        {blocked.length === 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            This permissive file lets all crawlers in. Pick agents above or choose a preset to
            start blocking.
          </p>
        )}
        {BMC_SLUG.length > 0 && (
          <p className="mt-2 text-sm text-zinc-500">
            Does this save you time?{" "}
            <a
              href={bmcLink(BMC_SLUG)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 underline hover:text-emerald-800"
            >
              ☕ Buy us a coffee
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
