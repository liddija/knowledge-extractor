"use client";

import { PromptTemplate } from "@/lib/types";
import { useState } from "react";

export default function PromptCard({ prompt }: { prompt: PromptTemplate }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{prompt.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{prompt.useCase}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Template with highlighted variables */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap text-gray-800">
        {prompt.template.split(/(\{\{[^}]+\}\})/).map((part, i) =>
          part.startsWith("{{") ? (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 px-1 rounded"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>

      {/* Variables */}
      {prompt.variables.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prompt.variables.map((v) => (
            <span
              key={v}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md"
            >
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      {/* Toggle original */}
      {prompt.originalPrompt && (
        <div>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {showOriginal ? "Hide original" : "Show original prompt"}
          </button>
          {showOriginal && (
            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 whitespace-pre-wrap">
              {prompt.originalPrompt}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
