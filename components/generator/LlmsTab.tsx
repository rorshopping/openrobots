"use client";

import { useMemo, useState } from "react";
import OutputPanel from "@/components/generator/OutputPanel";
import { generateLlmsTxt, type LlmsSection } from "@/lib/llms";

interface LinkRow {
  title: string;
  url: string;
  summary: string;
}

interface SectionRow {
  title: string;
  links: LinkRow[];
}

const EMPTY_LINK: LinkRow = { title: "", url: "", summary: "" };

const inputClasses =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none";

export default function LlmsTab() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [sections, setSections] = useState<SectionRow[]>([
    { title: "Docs", links: [{ ...EMPTY_LINK }] },
  ]);

  const output = useMemo(
    () =>
      generateLlmsTxt({
        name: name.trim().length > 0 ? name : "Your Site",
        description,
        url,
        sections: sections.map(
          (section): LlmsSection => ({
            title: section.title,
            links: section.links.map((link) => ({
              title: link.title,
              url: link.url,
              summary: link.summary.trim().length > 0 ? link.summary : undefined,
            })),
          }),
        ),
      }),
    [name, description, url, sections],
  );

  const updateSection = (index: number, patch: Partial<SectionRow>) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, ...patch } : section)),
    );
  };

  const updateLink = (sectionIndex: number, linkIndex: number, patch: Partial<LinkRow>) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              links: section.links.map((link, j) =>
                j === linkIndex ? { ...link, ...patch } : link,
              ),
            }
          : section,
      ),
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="llms-name" className="mb-1 block text-sm font-medium text-zinc-700">
              Site name
            </label>
            <input
              id="llms-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Inc."
              className={inputClasses}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="llms-description"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              One-line description
            </label>
            <input
              id="llms-description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What your site is about, in one sentence."
              className={inputClasses}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="llms-url" className="mb-1 block text-sm font-medium text-zinc-700">
              Site URL
            </label>
            <input
              id="llms-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className={inputClasses}
            />
          </div>
        </div>

        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`llms-section-title-${sectionIndex}`}
                  className="mb-1 block text-sm font-medium text-zinc-700"
                >
                  Section {sectionIndex + 1} title
                </label>
                <input
                  id={`llms-section-title-${sectionIndex}`}
                  type="text"
                  value={section.title}
                  onChange={(event) =>
                    updateSection(sectionIndex, { title: event.target.value })
                  }
                  placeholder="Documentation"
                  className={inputClasses}
                />
              </div>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSections((prev) => prev.filter((_, i) => i !== sectionIndex))
                  }
                  className="rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Remove
                </button>
              )}
            </div>

            <ul className="mt-3 space-y-2">
              {section.links.map((link, linkIndex) => (
                <li
                  key={linkIndex}
                  className="grid gap-2 rounded-lg bg-zinc-50 p-2.5 sm:grid-cols-[1fr_1fr]"
                >
                  <div>
                    <label
                      htmlFor={`llms-link-title-${sectionIndex}-${linkIndex}`}
                      className="mb-1 block text-xs font-medium text-zinc-500"
                    >
                      Link title
                    </label>
                    <input
                      id={`llms-link-title-${sectionIndex}-${linkIndex}`}
                      type="text"
                      value={link.title}
                      onChange={(event) =>
                        updateLink(sectionIndex, linkIndex, { title: event.target.value })
                      }
                      placeholder="Getting started"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`llms-link-url-${sectionIndex}-${linkIndex}`}
                      className="mb-1 block text-xs font-medium text-zinc-500"
                    >
                      URL
                    </label>
                    <input
                      id={`llms-link-url-${sectionIndex}-${linkIndex}`}
                      type="url"
                      value={link.url}
                      onChange={(event) =>
                        updateLink(sectionIndex, linkIndex, { url: event.target.value })
                      }
                      placeholder="https://example.com/start"
                      className={inputClasses}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`llms-link-summary-${sectionIndex}-${linkIndex}`}
                      className="mb-1 block text-xs font-medium text-zinc-500"
                    >
                      Summary <span className="font-normal text-zinc-400">(optional)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={`llms-link-summary-${sectionIndex}-${linkIndex}`}
                        type="text"
                        value={link.summary}
                        onChange={(event) =>
                          updateLink(sectionIndex, linkIndex, { summary: event.target.value })
                        }
                        placeholder="What this page covers"
                        className={inputClasses}
                      />
                      {section.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(sectionIndex, {
                              links: section.links.filter((_, j) => j !== linkIndex),
                            })
                          }
                          aria-label={`Remove link ${linkIndex + 1}`}
                          className="shrink-0 rounded-lg px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() =>
                updateSection(sectionIndex, { links: [...section.links, { ...EMPTY_LINK }] })
              }
              className="mt-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              + Add link
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setSections((prev) => [...prev, { title: "", links: [{ ...EMPTY_LINK }] }])
          }
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          + Add section
        </button>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">Your llms.txt</h3>
        <OutputPanel label="llms.txt — live preview" output={output} filename="llms.txt" />
        <p className="mt-3 text-sm text-zinc-500">
          Put this file at the root of your site (e.g. https://example.com/llms.txt) so AI
          assistants can understand your content at a glance.
        </p>
      </div>
    </div>
  );
}
