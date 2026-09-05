"use client";

import { useCallback, useState } from "react";
import GeneratorTab from "@/components/generator/GeneratorTab";
import AuditTab from "@/components/generator/AuditTab";
import LlmsTab from "@/components/generator/LlmsTab";

type TabId = "generator" | "audit" | "llms";

const TABS: { id: TabId; label: string }[] = [
  { id: "generator", label: "Generator" },
  { id: "audit", label: "Audit" },
  { id: "llms", label: "llms.txt" },
];

/**
 * The single OpenRobots tool surface: three self-contained tabs sharing the
 * blocked-agent selection (so "Block these" in the Audit tab can jump to the
 * Generator with agents pre-selected). Self-contained state, no props required.
 */
export default function GeneratorTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("generator");
  const [blocked, setBlocked] = useState<string[]>([]);

  const handleBlockAgents = useCallback((names: string[]) => {
    setBlocked((prev) => [...new Set([...prev, ...names])]);
    setActiveTab("generator");
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div
        role="tablist"
        aria-label="OpenRobots tools"
        className="flex w-full gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 sm:w-auto sm:inline-flex"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:flex-none ${
              activeTab === tab.id
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6"
      >
        {activeTab === "generator" && (
          <GeneratorTab blocked={blocked} onChangeBlocked={setBlocked} />
        )}
        {activeTab === "audit" && <AuditTab onBlockAgents={handleBlockAgents} />}
        {activeTab === "llms" && <LlmsTab />}
      </div>
    </div>
  );
}
