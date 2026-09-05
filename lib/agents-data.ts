import agentsJson from "@/data/agents.json";
import type { AgentCategory, AgentEntry } from "@/lib/types";

const VALID_CATEGORIES: readonly AgentCategory[] = [
  "training",
  "assistant",
  "search",
  "scraper",
  "multimodal",
  "other",
];

/**
 * Validates/normalizes the raw JSON snapshot into AgentEntry[].
 * Drops malformed rows and duplicate names so the rest of the app can
 * assume a clean dataset.
 */
function normalizeAgents(raw: unknown): AgentEntry[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: AgentEntry[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const candidate = item as Partial<AgentEntry>;
    if (typeof candidate.name !== "string" || candidate.name.length === 0) continue;
    if (typeof candidate.operator !== "string" || candidate.operator.length === 0) continue;
    if (typeof candidate.purpose !== "string" || candidate.purpose.length === 0) continue;
    if (
      typeof candidate.category !== "string" ||
      !VALID_CATEGORIES.includes(candidate.category as AgentCategory)
    ) {
      continue;
    }
    if (seen.has(candidate.name)) continue;
    seen.add(candidate.name);
    out.push({
      name: candidate.name,
      operator: candidate.operator,
      category: candidate.category as AgentCategory,
      purpose: candidate.purpose,
      ...(candidate.respectsRobots !== undefined && candidate.respectsRobots !== null
        ? { respectsRobots: candidate.respectsRobots as AgentEntry["respectsRobots"] }
        : {}),
      ...(typeof candidate.website === "string" && candidate.website.length > 0
        ? { website: candidate.website }
        : {}),
    });
  }
  return out;
}

/** The full curated snapshot of known AI crawler agents (from the community-maintained ai.robots.txt list). */
export const AI_AGENTS: AgentEntry[] = normalizeAgents(agentsJson);

/** Names of the most prominent AI agents, used by the audit to flag notable gaps. */
export const NOTABLE_AGENTS: string[] = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
  "PerplexityBot",
  "Bytespider",
  "Amazonbot",
  "FacebookBot",
  "meta-externalagent",
  "Applebot-Extended",
  "OAI-SearchBot",
];
