"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/lib/types";
import { exportToZip } from "@/lib/export";
import SOPCard from "@/components/SOPCard";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult | null>(null);
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
      const blob = await exportToZip(results.sops);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sop-extraction-${new Date().toISOString().split("T")[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (!results) {
    return (
      <div className="text-center py-20 text-[#8E8E8E]">Loading results...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#111111]">Your SOPs</h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            {results.sops.length} SOP{results.sops.length !== 1 ? "s" : ""}{" "}
            extracted from {results.totalConversations} conversations across{" "}
            {results.totalGroups} topic groups
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-[#5F5F5F] hover:bg-warm-50 transition-colors"
          >
            New Extraction
          </button>
          {results.sops.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
            >
              {exporting ? "Exporting..." : "Download All (Markdown)"}
            </button>
          )}
        </div>
      </div>

      {/* SOP list */}
      <div className="space-y-4">
        {results.sops.length === 0 ? (
          <div className="text-center py-16 bg-warm-50 rounded-2xl">
            <p className="text-[#8E8E8E]">
              No SOPs found for this topic in your conversations. Try a
              different description or upload more conversations.
            </p>
          </div>
        ) : (
          results.sops.map((sop) => <SOPCard key={sop.id} sop={sop} />)
        )}
      </div>
    </div>
  );
}
