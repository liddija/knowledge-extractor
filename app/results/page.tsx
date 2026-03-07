"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/lib/types";
import { exportToZip } from "@/lib/export";
import SOPCard from "@/components/SOPCard";
import PatternCard from "@/components/PatternCard";
import PromptCard from "@/components/PromptCard";

type Tab = "sops" | "patterns" | "prompts";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("sops");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("ke-results");
    if (!stored) {
      router.push("/");
      return;
    }
    setResults(JSON.parse(stored));
  }, [router]);

  const handleExport = async () => {
    if (!results) return;
    setExporting(true);
    try {
      const blob = await exportToZip(
        results.sops,
        results.patterns,
        results.prompts
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `knowledge-extraction-${new Date().toISOString().split("T")[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (!results) {
    return (
      <div className="text-center py-20 text-gray-500">Loading results...</div>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "sops", label: "SOPs", count: results.sops.length },
    { key: "patterns", label: "Patterns", count: results.patterns.length },
    { key: "prompts", label: "Prompt Templates", count: results.prompts.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Knowledge Assets
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Extracted from {results.totalConversations} conversations across{" "}
            {results.totalGroups} topic groups
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            New Analysis
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {exporting ? "Exporting..." : "Download All (Markdown)"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-4 rounded-xl border text-left transition-colors ${
              activeTab === tab.key
                ? "bg-indigo-50 border-indigo-200"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{tab.count}</p>
            <p className="text-sm text-gray-500">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {activeTab === "sops" && (
          <>
            {results.sops.length === 0 ? (
              <EmptyState label="No SOPs extracted. Try uploading more conversations with repeated workflows." />
            ) : (
              results.sops.map((sop) => <SOPCard key={sop.id} sop={sop} />)
            )}
          </>
        )}

        {activeTab === "patterns" && (
          <>
            {results.patterns.length === 0 ? (
              <EmptyState label="No patterns found. Try uploading a larger conversation history." />
            ) : (
              results.patterns.map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))
            )}
          </>
        )}

        {activeTab === "prompts" && (
          <>
            {results.prompts.length === 0 ? (
              <EmptyState label="No reusable prompts found. The analyzer looks for structured, multi-part prompts." />
            ) : (
              results.prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-12 bg-white border rounded-xl">
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
