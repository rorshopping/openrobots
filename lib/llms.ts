export interface LlmsSection {
  title: string;
  links: { title: string; url: string; summary?: string }[];
}

export interface LlmsSite {
  name: string;
  description: string;
  url: string;
  sections: LlmsSection[];
}

/**
 * Generates llms.txt markdown per the emerging spec:
 * "# Site name", "> description", the site URL, then "## Section" headings
 * with "- [title](url): summary" bullets. Empty sections/links are skipped.
 */
export function generateLlmsTxt(site: LlmsSite): string {
  const lines: string[] = [];
  lines.push(`# ${site.name.trim()}`, "");
  if (site.description.trim().length > 0) {
    lines.push(`> ${site.description.trim()}`, "");
  }
  if (site.url.trim().length > 0) {
    lines.push(site.url.trim(), "");
  }

  for (const section of site.sections) {
    const title = section.title.trim();
    const links = section.links.filter((link) => link.title.trim() && link.url.trim());
    if (title.length === 0 || links.length === 0) continue;
    lines.push(`## ${title}`, "");
    for (const link of links) {
      const summary = link.summary?.trim() ?? "";
      lines.push(
        summary.length > 0
          ? `- [${link.title.trim()}](${link.url.trim()}): ${summary}`
          : `- [${link.title.trim()}](${link.url.trim()})`,
      );
    }
    lines.push("");
  }

  // Collapse any run of trailing blank lines into a single final newline.
  return lines.join("\n").replace(/\n+$/, "\n");
}
