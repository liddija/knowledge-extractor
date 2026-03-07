"use client";

import { SOP } from "@/lib/types";
import { useState } from "react";

export default function SOPCard({ sop }: { sop: SOP }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toMarkdown = () => {
    let md = `# ${sop.title}\n\n`;
    md += `**When to use:** ${sop.trigger}\n\n`;
    md += `## Steps\n\n`;
    sop.steps.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });
    if (sop.tools.length > 0) {
      md += `\n## Tools & Resources\n\n`;
      sop.tools.forEach((tool) => {
        md += `- ${tool}\n`;
      });
    }
    md += `\n## Expected Outcome\n\n${sop.expectedOutcome}\n`;
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
          <h3 className="font-semibold text-gray-900">{sop.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{sop.trigger}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          {copied ? "Copied!" : "Copy MD"}
        </button>
      </div>

      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {expanded ? "Collapse" : `${sop.steps.length} steps - Click to expand`}
        </button>

        {expanded && (
          <ol className="mt-3 space-y-2">
            {sop.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-indigo-600 font-medium shrink-0">
                  {i + 1}.
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {expanded && sop.tools.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sop.tools.map((tool) => (
            <span
              key={tool}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400">
        From {sop.sourceConversations.length} conversation(s)
      </div>
    </div>
  );
}
