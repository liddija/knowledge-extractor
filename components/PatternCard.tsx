"use client";

import { Pattern } from "@/lib/types";
import { useState } from "react";

export default function PatternCard({ pattern }: { pattern: Pattern }) {
  const [copied, setCopied] = useState(false);

  const toMarkdown = () => {
    let md = `# ${pattern.name}\n\n`;
    md += `**Frequency:** ~${pattern.frequency} occurrences\n\n`;
    md += `${pattern.description}\n\n`;
    if (pattern.decisions.length > 0) {
      md += `## Key Decisions\n\n`;
      pattern.decisions.forEach((d) => {
        md += `- ${d}\n`;
      });
    }
    if (pattern.insights.length > 0) {
      md += `\n## Insights\n\n`;
      pattern.insights.forEach((i) => {
        md += `- ${i}\n`;
      });
    }
    return md;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(toMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
          <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
            ~{pattern.frequency}x observed
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          {copied ? "Copied!" : "Copy MD"}
        </button>
      </div>

      <p className="text-sm text-gray-700">{pattern.description}</p>

      {pattern.decisions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Key Decisions
          </p>
          <ul className="space-y-1">
            {pattern.decisions.map((d, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-gray-400">&bull;</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pattern.insights.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Insights
          </p>
          <ul className="space-y-1">
            {pattern.insights.map((insight, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-indigo-400">&rarr;</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
