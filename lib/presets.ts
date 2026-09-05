import type { AgentEntry } from "@/lib/types";

export type PresetId = "block-all" | "allow-all" | "block-training" | "block-except-search";

export const PRESETS: { id: PresetId; label: string; description: string }[] = [
  {
    id: "allow-all",
    label: "Allow all AI",
    description: "Permissive robots.txt — no AI crawler is blocked.",
  },
  {
    id: "block-all",
    label: "Block all AI",
    description: "Deny every known AI crawler access to your whole site.",
  },
  {
    id: "block-training",
    label: "Block training bots",
    description: "Deny crawlers that collect data for training AI models.",
  },
  {
    id: "block-except-search",
    label: "Block all except search",
    description:
      "Block AI crawlers, but keep search and assistant bots that fetch pages at a user's request.",
  },
];

/** Applies a preset to the agent list and returns the blocked agent names. */
export function applyPreset(id: PresetId, agents: AgentEntry[]): string[] {
  switch (id) {
    case "block-all":
      return agents.map((agent) => agent.name);
    case "allow-all":
      return [];
    case "block-training":
      return agents.filter((agent) => agent.category === "training").map((agent) => agent.name);
    case "block-except-search":
      // Assistant bots fetch pages for a user's direct request, so they are
      // kept alongside search bots.
      return agents
        .filter((agent) => agent.category !== "search" && agent.category !== "assistant")
        .map((agent) => agent.name);
  }
}
