import type { AgentEntry } from "@/lib/types";
import { NOTABLE_AGENTS } from "@/lib/agents-data";

export interface AuditResult {
  knownAgentsFound: string[]; // AI agents explicitly listed in the pasted text
  unknownUserAgents: string[]; // user-agent tokens not in our dataset (may be typos)
  missingNotable: string[]; // notable AI agents NOT covered by the file
  blocksAllKnownAi: boolean; // true if every known agent in dataset is disallowed
  warnings: string[]; // human-readable advice lines
}

interface ParsedGroup {
  userAgents: string[];
  /** True if the group contains a "Disallow: /" (root disallow). */
  rootDisallow: boolean;
}

/**
 * Parses a robots.txt and audits it against the known AI agent dataset.
 *
 * Parsing rule (per contract):
 * - A group starts at "User-agent:" lines followed by a "Disallow:"/"Allow:" line.
 *   Consecutive "User-agent:" lines share one group; a "User-agent:" line that
 *   appears after directives starts a new group.
 * - The LAST directive group per agent wins.
 * - An agent is "blocked" iff its latest group contains "Disallow: /" (root disallow).
 * - Standard robots.txt wildcard semantics also apply: an agent without any
 *   explicit group falls back to the "User-agent: *" group, so a wildcard
 *   "Disallow: /" blocks every agent that is not explicitly listed.
 *
 * User-agent tokens are matched case-insensitively (parsers treat them as
 * case-insensitive), but reported names use the dataset's exact casing.
 */
export function auditRobotsText(text: string, agents: AgentEntry[]): AuditResult {
  const datasetByName = new Map<string, AgentEntry>();
  for (const agent of agents) datasetByName.set(agent.name.toLowerCase(), agent);

  // --- Parse groups ---
  const lastGroupByAgent = new Map<string, ParsedGroup>(); // lowercase UA -> last group
  let pendingUAs: string[] = [];
  let pendingRules: string[] = [];

  const flushGroup = () => {
    if (pendingUAs.length === 0) {
      pendingRules = [];
      return;
    }
    const group: ParsedGroup = { userAgents: pendingUAs, rootDisallow: pendingRules.includes("/") };
    for (const ua of pendingUAs) lastGroupByAgent.set(ua.toLowerCase(), group);
    pendingUAs = [];
    pendingRules = [];
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) continue;

    const uaMatch = /^user-agent:\s*(.*)$/i.exec(line);
    if (uaMatch) {
      if (pendingRules.length > 0) flushGroup(); // directives seen -> new group starts
      const name = uaMatch[1].trim();
      if (name.length > 0) pendingUAs.push(name);
      continue;
    }

    const directiveMatch = /^(?:disallow|allow):\s*(.*)$/i.exec(line);
    if (directiveMatch) {
      if (pendingUAs.length === 0) continue; // directive before any User-agent line
      pendingRules.push(directiveMatch[1].trim());
    }
    // Other directives (Crawl-delay, Sitemap, ...) do not affect blocking.
  }
  flushGroup();

  const explicitGroup = (name: string): ParsedGroup | undefined =>
    lastGroupByAgent.get(name.toLowerCase());
  const wildcardRootDisallow = lastGroupByAgent.get("*")?.rootDisallow ?? false;

  /** An agent is blocked by its own last group, or by the wildcard group if it has none. */
  const isBlocked = (name: string): boolean => {
    const group = explicitGroup(name);
    if (group) return group.rootDisallow;
    return wildcardRootDisallow;
  };

  // --- Classify user-agent tokens found in the file (order of appearance) ---
  const knownAgentsFound: string[] = [];
  const unknownUserAgents: string[] = [];
  const seenUnknown = new Set<string>();
  for (const [lowerUA] of lastGroupByAgent) {
    if (lowerUA === "*") continue;
    const entry = datasetByName.get(lowerUA);
    if (entry) {
      if (!knownAgentsFound.includes(entry.name)) knownAgentsFound.push(entry.name);
    } else if (!seenUnknown.has(lowerUA)) {
      seenUnknown.add(lowerUA);
      unknownUserAgents.push(lastGroupByAgent.get(lowerUA)!.userAgents.find(
        (ua) => ua.toLowerCase() === lowerUA,
      )!);
    }
  }

  const missingNotable = NOTABLE_AGENTS.filter((name) => !isBlocked(name));
  const blocksAllKnownAi = agents.every((agent) => isBlocked(agent.name));

  // --- Warnings ---
  const warnings: string[] = [];
  if (text.trim().length === 0) {
    warnings.push("Paste your robots.txt content above to run an audit.");
  } else {
    if (lastGroupByAgent.size === 0) {
      warnings.push("No User-agent directives found — nothing is being blocked.");
    }
    if (wildcardRootDisallow) {
      warnings.push(
        'A "User-agent: *" group with "Disallow: /" blocks ALL crawlers — including AI agents and search engines like Googlebot.',
      );
    }
    const unblockedKnown = agents.filter((agent) => !isBlocked(agent.name));
    if (unblockedKnown.length > 0 && unblockedKnown.length === agents.length) {
      warnings.push("None of the known AI crawlers are blocked.");
    } else if (unblockedKnown.length > 0) {
      warnings.push(
        `${unblockedKnown.length} of ${agents.length} known AI crawlers are not blocked.`,
      );
    }
    if (missingNotable.length > 0 && !blocksAllKnownAi) {
      warnings.push(`Notable AI crawlers not blocked: ${missingNotable.join(", ")}.`);
    }
    if (unknownUserAgents.length > 0) {
      warnings.push(
        `${unknownUserAgents.length} user-agent token(s) are not in our AI dataset — they may be legitimate search bots or typos.`,
      );
    }
  }

  return { knownAgentsFound, unknownUserAgents, missingNotable, blocksAllKnownAi, warnings };
}
