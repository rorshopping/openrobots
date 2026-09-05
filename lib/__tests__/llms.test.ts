import { describe, expect, it } from "vitest";
import { generateLlmsTxt, type LlmsSite } from "@/lib/llms";

const SITE: LlmsSite = {
  name: "Acme",
  description: "We build robots.",
  url: "https://acme.example",
  sections: [
    {
      title: "Docs",
      links: [
        { title: "Guide", url: "https://acme.example/guide", summary: "Start here" },
        { title: "API", url: "https://acme.example/api" },
      ],
    },
    { title: "Blog", links: [{ title: "News", url: "https://acme.example/blog", summary: "Updates" }] },
  ],
};

describe("generateLlmsTxt", () => {
  it("produces the golden llms.txt format", () => {
    expect(generateLlmsTxt(SITE)).toBe(
      "# Acme\n" +
        "\n" +
        "> We build robots.\n" +
        "\n" +
        "https://acme.example\n" +
        "\n" +
        "## Docs\n" +
        "\n" +
        "- [Guide](https://acme.example/guide): Start here\n" +
        "- [API](https://acme.example/api)\n" +
        "\n" +
        "## Blog\n" +
        "\n" +
        "- [News](https://acme.example/blog): Updates\n",
    );
  });

  it("skips empty sections and links without title or url", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "",
      url: "",
      sections: [
        { title: "", links: [{ title: "Ghost", url: "https://ghost.example" }] },
        { title: "S", links: [{ title: "", url: "https://nope.example" }, { title: "A", url: "https://a.example" }] },
      ],
    });
    expect(out).toBe("# X\n\n## S\n\n- [A](https://a.example)\n");
  });

  it("ends with exactly one trailing newline", () => {
    expect(generateLlmsTxt(SITE).endsWith("\n")).toBe(true);
    expect(generateLlmsTxt(SITE).endsWith("\n\n")).toBe(false);
  });
});
