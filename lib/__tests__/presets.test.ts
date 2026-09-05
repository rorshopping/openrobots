import { describe, expect, it } from "vitest";
import { AI_AGENTS } from "@/lib/agents-data";
import { applyPreset, PRESETS, type PresetId } from "@/lib/presets";
import type { AgentEntry } from "@/lib/types";

const FIXTURE: AgentEntry[] = [
  { name: "GPTBot", operator: "OpenAI", category: "training", purpose: "Training data crawler." },
  { name: "ChatGPT-User", operator: "OpenAI", category: "assistant", purpose: "User-initiated fetch." },
  { name: "OAI-SearchBot", operator: "OpenAI", category: "search", purpose: "Search index crawler." },
  { name: "Amazonbot", operator: "Amazon", category: "scraper", purpose: "Content scraper." },
  { name: "GPTBot-Clone", operator: "Acme", category: "other", purpose: "Unclassified bot." },
];

describe("PRESETS", () => {
  it("exposes exactly the four contract preset ids in order", () => {
    expect(PRESETS.map((p) => p.id)).toEqual([
      "allow-all",
      "block-all",
      "block-training",
      "block-except-search",
    ]);
    for (const preset of PRESETS) {
      expect(preset.label.length).toBeGreaterThan(0);
      expect(preset.description.length).toBeGreaterThan(0);
    }
  });
});

describe("applyPreset", () => {
  it("block-all blocks every agent", () => {
    expect(applyPreset("block-all", FIXTURE)).toEqual([
      "GPTBot",
      "ChatGPT-User",
      "OAI-SearchBot",
      "Amazonbot",
      "GPTBot-Clone",
    ]);
  });

  it("allow-all blocks nothing", () => {
    expect(applyPreset("allow-all", FIXTURE)).toEqual([]);
  });

  it("block-training blocks only training-category agents", () => {
    expect(applyPreset("block-training", FIXTURE)).toEqual(["GPTBot"]);
  });

  it("block-except-search keeps search and assistant agents unblocked", () => {
    expect(applyPreset("block-except-search", FIXTURE)).toEqual(["GPTBot", "Amazonbot", "GPTBot-Clone"]);
  });

  it("works against the real dataset", () => {
    const all = applyPreset("block-all", AI_AGENTS);
    expect(all).toHaveLength(AI_AGENTS.length);
    const training = applyPreset("block-training", AI_AGENTS);
    expect(training.length).toBeGreaterThan(0);
    expect(training.length).toBeLessThan(AI_AGENTS.length);
    const exceptSearch = applyPreset("block-except-search", AI_AGENTS);
    const kept = AI_AGENTS.filter(
      (a) => a.category === "search" || a.category === "assistant",
    ).map((a) => a.name);
    expect(exceptSearch).not.toContain(kept[0]);
    expect(exceptSearch.length).toBe(AI_AGENTS.length - kept.length);
  });

  it("covers every PresetId", () => {
    const ids: PresetId[] = ["block-all", "allow-all", "block-training", "block-except-search"];
    for (const id of ids) expect(() => applyPreset(id, FIXTURE)).not.toThrow();
  });
});
