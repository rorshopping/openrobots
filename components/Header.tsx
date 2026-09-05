import Link from "next/link";
import { GITHUB_URL, SITE_NAME } from "@/lib/config";

/** GitHub mark (inline SVG so we need no icon package). */
function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * Sticky site header: brand on the left, in-page nav + optional GitHub on the right.
 * The GitHub link renders only when NEXT_PUBLIC_GITHUB_URL is configured.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-zinc-900 hover:text-emerald-700"
        >
          🤖 {SITE_NAME}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6">
          <a
            href="#generator"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Generator
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            FAQ
          </a>
          {GITHUB_URL ? (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener"
              aria-label="OpenRobots on GitHub"
              className="text-zinc-600 hover:text-zinc-900"
            >
              <GitHubIcon />
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
