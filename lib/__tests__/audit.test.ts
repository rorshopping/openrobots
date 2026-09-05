import { describe, expect, it } from "vitest";
import { auditRobotsText } from "@/lib/audit";
import { AI_AGENTS, NOTABLE_AGENTS } from "@/lib/agents-data";

describe("auditRobotsText", () => {
  it("finds known agents, flags unknown ones, and applies last-group-wins", () => {
    const text = [
      "User-agent: GPTBot",
      "Disallow: /",
      "",
      "User-agent: GPTBot",
      "Disallow:",
      "",
      "User-agent: MadeUpBot",
      "Disallow: /",
    ].join("\n");

    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.knownAgentsFound).toEqual(["GPTBot"]);
    expect(result.unknownUserAgents).toEqual(["MadeUpBot"]);
    // Last group for GPTBot has no root disallow -> not blocked.
    expect(result.missingNotable).toContain("GPTBot");
    expect(result.blocksAllKnownAi).toBe(false);
  });

  it("marks agents blocked when their last group has a root disallow", () => {
    const text = [
      "User-agent: ClaudeBot",
      "Disallow:",
      "",
      "User-agent: ClaudeBot",
      "Disallow: /",
    ].join("\n");
    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.knownAgentsFound).toEqual(["ClaudeBot"]);
    expect(result.missingNotable).not.toContain("ClaudeBot");
  });

  it("groups consecutive User-agent lines into one directive group", () => {
    const text = ["User-agent: GPTBot", "User-agent: CCBot", "Disallow: /"].join("\n");
    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.knownAgentsFound).toEqual(["GPTBot", "CCBot"]);
    expect(result.missingNotable).not.toContain("GPTBot");
    expect(result.missingNotable).not.toContain("CCBot");
    expect(result.unknownUserAgents).toEqual([]);
  });

  it("matches user-agent tokens case-insensitively but reports dataset casing", () => {
    const text = ["user-agent: gptbot", "disallow: /"].join("\n");
    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.knownAgentsFound).toEqual(["GPTBot"]);
    expect(result.unknownUserAgents).toEqual([]);
    expect(result.missingNotable).not.toContain("GPTBot");
  });

  it("treats a wildcard root disallow as blocking every known agent", () => {
    const text = ["User-agent: *", "Disallow: /"].join("\n");
    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.knownAgentsFound).toEqual([]);
    expect(result.blocksAllKnownAi).toBe(true);
    expect(result.missingNotable).toEqual([]);
  });

  it("an explicit group overrides the wildcard for that agent", () => {
    const text = ["User-agent: *", "Disallow: /", "", "User-agent: GPTBot", "Disallow:"].join("\n");
    const result = auditRobotsText(text, AI_AGENTS);
    expect(result.blocksAllKnownAi).toBe(false);
    expect(result.missingNotable).toContain("GPTBot");
    expect(result.missingNotable).not.toContain("ClaudeBot");
  });

  it("lists notable agents not covered", () => {
    const result = auditRobotsText("User-agent: GPTBot\nDisallow: /\n", AI_AGENTS);
    expect(result.missingNotable).toContain("ClaudeBot");
    expect(result.missingNotable).not.toContain("GPTBot");
    expect(NOTABLE_AGENTS.length).toBeGreaterThanOrEqual(10);
  });

  it("handles empty input gracefully", () => {
    const result = auditRobotsText("", AI_AGENTS);
    expect(result.knownAgentsFound).toEqual([]);
    expect(result.unknownUserAgents).toEqual([]);
    expect(result.blocksAllKnownAi).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("reports no User-agent directives as a warning", () => {
    const result = auditRobotsText("# just a comment\n", AI_AGENTS);
    expect(result.warnings.some((w) => /no user-agent/i.test(w))).toBe(true);
  });

  it("does not flag the wildcard token as an unknown agent", () => {
    const result = auditRobotsText("User-agent: *\nDisallow: /private/\n", AI_AGENTS);
    expect(result.unknownUserAgents).toEqual([]);
  });
});
