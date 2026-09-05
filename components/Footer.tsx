import { GITHUB_URL, SITE_NAME } from "@/lib/config";
import BuyMeACoffee from "@/components/BuyMeACoffee";

/**
 * Site footer: brand one-liner, quick links, and the Support column with the
 * Buy Me a Coffee button (renders only when BMC_SLUG is configured).
 */
export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        {/* 1 — Brand */}
        <div>
          <p className="text-lg font-bold text-white">🤖 {SITE_NAME}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Decide how AI sees your site. Free, open source, 100% in-browser.
          </p>
        </div>

        {/* 2 — Links */}
        <div>
          <p className="text-sm font-semibold text-white">Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#generator" className="text-zinc-400 hover:text-white">
                Generator
              </a>
            </li>
            <li>
              <a href="#faq" className="text-zinc-400 hover:text-white">
                FAQ
              </a>
            </li>
            {GITHUB_URL ? (
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-zinc-400 hover:text-white"
                >
                  GitHub
                </a>
              </li>
            ) : null}
            <li>
              <a
                href="https://github.com/ai-robots-txt/ai.robots.txt"
                target="_blank"
                rel="noopener"
                className="text-zinc-400 hover:text-white"
              >
                robots data by ai.robots.txt
              </a>
            </li>
          </ul>
        </div>

        {/* 3 — Support */}
        <div>
          <p className="text-sm font-semibold text-white">Support</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            OpenRobots is free and runs entirely in your browser. If it saved
            you time, a coffee keeps the crawler database updated.
          </p>
          <div className="mt-4">
            <BuyMeACoffee />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-zinc-500">
          © 2026 {SITE_NAME} · MIT License · No tracking · Crawler data updated
          Sept 2026
        </div>
      </div>
    </footer>
  );
}
