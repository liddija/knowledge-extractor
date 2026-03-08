"use client";

import { useState, useEffect } from "react";
import { LLMProvider } from "@/lib/types";

interface ApiKeyInputProps {
  onKeySet: (key: string, provider: LLMProvider) => void;
}

export default function ApiKeyInput({ onKeySet }: ApiKeyInputProps) {
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("ke-api-key");
    const storedProvider = localStorage.getItem("ke-provider") as LLMProvider;
    if (storedKey && storedProvider) {
      setApiKey(storedKey);
      setProvider(storedProvider);
      onKeySet(storedKey, storedProvider);
      setSaved(true);
    }
  }, [onKeySet]);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem("ke-api-key", apiKey);
    localStorage.setItem("ke-provider", provider);
    onKeySet(apiKey, provider);
    setSaved(true);
  };

  const handleClear = () => {
    localStorage.removeItem("ke-api-key");
    localStorage.removeItem("ke-provider");
    setApiKey("");
    setSaved(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        LLM API Key
      </label>
      <p className="text-xs text-charcoal/40">
        Your key is stored in your browser only and sent directly to the
        provider. We never store it.
      </p>
      <div className="flex gap-2">
        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value as LLMProvider);
            setSaved(false);
          }}
          className="border border-cream-dark rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-shadow"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setSaved(false);
          }}
          placeholder={
            provider === "openai" ? "sk-..." : "sk-ant-..."
          }
          className="flex-1 border border-cream-dark rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-shadow"
        />
        {saved ? (
          <button
            onClick={handleClear}
            className="px-5 py-2.5 border border-cream-dark text-charcoal/60 rounded-full text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-5 py-2.5 bg-teal text-white rounded-full text-sm font-medium disabled:opacity-50 hover:bg-teal-dark transition-colors"
          >
            Save
          </button>
        )}
      </div>
      {saved && (
        <p className="text-xs text-teal font-medium">
          Key saved ({provider === "openai" ? "OpenAI" : "Anthropic"})
        </p>
      )}
    </div>
  );
}
