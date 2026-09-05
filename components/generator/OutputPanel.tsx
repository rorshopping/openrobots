"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface OutputPanelProps {
  /** Small label shown in the panel header, e.g. "robots.txt — live preview". */
  label: string;
  /** The generated file content. */
  output: string;
  /** When set, a download button for this filename is shown. */
  filename?: string;
}

/**
 * Dark, monospace output panel with copy + optional download actions and a
 * line/character counter. Purely client-side (Blob download, clipboard API).
 */
export default function OutputPanel({ label, output, filename }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename ?? "output.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [output, filename]);

  const lineCount = output.length === 0 ? 0 : output.split("\n").length;

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-zinc-950 text-zinc-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2.5">
          <span className="font-mono text-xs text-zinc-400">{label}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            {filename && (
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Download {filename}
              </button>
            )}
          </div>
        </div>
        <pre className="max-h-96 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          {output}
        </pre>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {lineCount} {lineCount === 1 ? "line" : "lines"} · {output.length} characters · generated
        locally, nothing leaves your browser
      </p>
    </div>
  );
}
