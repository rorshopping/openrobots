export type AgentCategory =
  | "training"
  | "assistant"
  | "search"
  | "scraper"
  | "multimodal"
  | "other";

export interface AgentEntry {
  /** Exact User-agent token, e.g. "GPTBot". Casing matters for robots.txt. */
  name: string;
  /** Company or project operating the crawler, e.g. "OpenAI". */
  operator: string;
  category: AgentCategory;
  /** One-line, human-readable summary of what the crawler does. */
  purpose: string;
  /** Whether the crawler is documented to respect robots.txt. Omitted when unclear. */
  respectsRobots?: boolean | "partial";
  /** Operator's website, when known. */
  website?: string;
}
