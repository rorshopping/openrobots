import { describe, expect, it } from "vitest";
import { AI_AGENTS, NOTABLE_AGENTS } from "@/lib/agents-data";
import type { AgentCategory } from "@/lib/types";

const VALID_CATEGORIES: AgentCategory[] = [
  "training",
  "assistant",
  "search",
  "scraper",
  "multimodal",
  "other",
];

describe("agents dataset", () => {
  it("contains at least 50 curated agents", () => {
    expect(AI_AGENTS.length).toBeGreaterThanOrEqual(50);
  });

  it("has unique agent names", () => {
    const names = AI_AGENTS.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("uses only valid categories", () => {
    for (const agent of AI_AGENTS) {
      expect(VALID_CATEGORIES).toContain(agent.category);
    }
  });

  it("has required string fields on every entry", () => {
    for (const agent of AI_AGENTS) {
      expect(agent.name.length).toBeGreaterThan(0);
      expect(agent.operator.length).toBeGreaterThan(0);
      expect(agent.purpose.length).toBeGreaterThan(0);
    }
  });

  it("only includes valid respectsRobots values", () => {
    for (const agent of AI_AGENTS) {
      if (agent.respectsRobots !== undefined) {
        expect([true, false, "partial"]).toContain(agent.respectsRobots);
      }
    }
  });

  it("includes the contract-mandated agents with exact tokens", () => {
    const names = new Set(AI_AGENTS.map((a) => a.name));
    for (const required of [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "ClaudeBot",
      "Claude-User",
      "Claude-SearchBot",
      "Google-Extended",
      "GoogleOther",
      "Applebot-Extended",
      "CCBot",
      "Bytespider",
      "PerplexityBot",
      "Perplexity-User",
      "Amazonbot",
      "FacebookBot",
      "meta-externalagent",
      "ImagesiftBot",
      "Diffbot",
      "YouBot",
      "cohere-ai",
      "anthropic-ai",
      "MistralAI-User",
    ]) {
      expect(names.has(required)).toBe(true);
    }
  });

  it("has every notable agent present in the dataset", () => {
    const names = new Set(AI_AGENTS.map((a) => a.name));
    expect(NOTABLE_AGENTS.length).toBeGreaterThanOrEqual(10);
    for (const notable of NOTABLE_AGENTS) {
      expect(names.has(notable)).toBe(true);
    }
  });
});
