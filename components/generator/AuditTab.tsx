"use client";

import { useMemo, useState } from "react";
import { auditRobotsText } from "@/lib/audit";
import { AI_AGENTS } from "@/lib/agents-data";

interface AuditTabProps {
  /** Adds the given agent names to the shared blocked set and jumps to the Generator tab. */
  onBlockAgents: (names: string[]) => void;
}

const EXAMPLE_ROBOTS = [
  "# robots.txt for example.com",
  "User-agent: Googlebot",
  "Disallow:",
  "",
  "User-agent: GPTBot",
  "Disallow: /",
  "",
  "User-agent: Bytespider",
  "Disallow: /",
  "",
  "User-agent: MadeUpBot",
  "Disallow: /",
  "",
  "Sitemap: https://example.com/sitemap.xml",
].join("\n");

type Verdict = "empty" | "green" | "yellow" | "red";

const VERDICT_STYLES: Record<Exclude<Verdict, "empty">, { box: string; title: string }> = {
  green: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-900",
    title: "🟢 Blocks all known AI crawlers",
  },
  yellow: {
    box: "border-amber-200 bg-amber-50 text-amber-900",
    title: "🟡 Partial protection",
  },
  red: {
    box: "border-red-200 bg-red-50 text-red-900",
    title: "🔴 Allows AI crawlers",
  },
};

function Chip({ children, mono = true }: { children: string; mono?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-700 ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </span>
  );
}

export default function AuditTab({ onBlockAgents }: AuditTabProps) {
  const [text, setText] = useState("");
  const result = useMemo(() => auditRobotsText(text, AI_AGENTS), [text]);

  const addressesAi =
    result.knownAgentsFound.length > 0 || result.unknownUserAgents.length > 0;
  const verdict: Verdict =
    text.trim().length === 0
      ? "empty"
      : result.blocksAllKnownAi
        ? "green"
        : addressesAi
          ? "yellow"
          : "red";

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="robots-input" className="text-sm font-medium text-zinc-700">
            Paste your robots.txt
          </label>
          <button
            type="button"
            onClick={() => setText(EXAMPLE_ROBOTS)}
            className="text-xs font-medium text-emerald-700 underline hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Try an example
          </button>
        </div>
        <textarea
          id="robots-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={"User-agent: GPTBot\nDisallow: /\n\nSitemap: https://example.com/sitemap.xml"}
          className="w-full rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Audited locally in your browser — nothing is uploaded. Updated live as you type.
        </p>
      </div>

      {verdict === "empty" ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
          Paste your robots.txt above (or try the example) to see which AI crawlers it blocks.
        </div>
      ) : (
        <>
          <div
            role="status"
            className={`rounded-xl border px-4 py-4 shadow-sm ${VERDICT_STYLES[verdict].box}`}
          >
            <p className="text-base font-semibold">{VERDICT_STYLES[verdict].title}</p>
            <p className="mt-1 text-sm">
              {result.blocksAllKnownAi
                ? "Every AI crawler in our dataset is disallowed from your whole site."
                : verdict === "red"
                  ? "No known AI crawlers are blocked by this file."
                  : "Some AI crawlers can still reach your site. Details below."}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">Known AI agents found</h3>
              {result.knownAgentsFound.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">
                  No known AI agents are explicitly listed in this file.
                </p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {result.knownAgentsFound.map((name) => (
                    <li key={name}>
                      <Chip>{name}</Chip>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">
                Notable AI crawlers not blocked
              </h3>
              {result.missingNotable.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">
                  All notable AI crawlers are covered. 🎉
                </p>
              ) : (
                <>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {result.missingNotable.map((name) => (
                      <li key={name}>
                        <Chip>{name}</Chip>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onBlockAgents(result.missingNotable)}
                    className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    Block these → Generator
                  </button>
                </>
              )}
            </section>

            {result.unknownUserAgents.length > 0 && (
              <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900">Unknown user-agents</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Not known AI agents — may be legit search bots or typos.
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {result.unknownUserAgents.map((name) => (
                    <li key={name}>
                      <Chip>{name}</Chip>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.warnings.length > 0 && (
              <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900">Advice</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
