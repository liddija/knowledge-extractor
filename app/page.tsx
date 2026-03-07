"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import ApiKeyInput from "@/components/ApiKeyInput";
import ProcessingStatus from "@/components/ProcessingStatus";
import { LLMProvider, ParsedConversation, ConversationGroup, AnalysisResult } from "@/lib/types";
import { parseChatGPTZip, parseChatGPTJSON } from "@/lib/parsers/chatgpt";
import { parseClaudeExport } from "@/lib/parsers/claude";
import { parseRawText } from "@/lib/parsers/raw-text";
import { chunkConversations } from "@/lib/chunker";
import { analyzeAll } from "@/lib/analyzer";

type Stage = "idle" | "parsing" | "chunking" | "analyzing" | "done" | "error";

export default function Home() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [groups, setGroups] = useState<ConversationGroup[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const handleKeySet = useCallback((key: string, prov: LLMProvider) => {
    setApiKey(key);
    setProvider(prov);
  }, []);

  const runAnalysis = async (parsedConvos: ParsedConversation[]) => {
    if (!apiKey) {
      setError("Please set your API key first.");
      setStage("error");
      return;
    }

    setConversations(parsedConvos);

    // Chunk
    setStage("chunking");
    const chunked = chunkConversations(parsedConvos);
    setGroups(chunked);

    // Analyze
    setStage("analyzing");
    setProgress({ completed: 0, total: chunked.length });

    try {
      const result = await analyzeAll(chunked, apiKey, provider, (completed, total) => {
        setProgress({ completed, total });
      });

      // Store results in sessionStorage for the results page
      const fullResult: AnalysisResult = {
        ...result,
        totalConversations: parsedConvos.length,
        totalGroups: chunked.length,
      };
      sessionStorage.setItem("ke-results", JSON.stringify(fullResult));

      setStage("done");
      // Navigate to results after a brief moment
      setTimeout(() => router.push("/results"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStage("error");
    }
  };

  const handleFile = async (file: File) => {
    setStage("parsing");
    setError("");

    try {
      let parsed: ParsedConversation[];

      if (file.name.endsWith(".zip")) {
        // Try ChatGPT format first, then Claude
        try {
          parsed = await parseChatGPTZip(file);
        } catch {
          parsed = await parseClaudeExport(file);
        }
      } else if (file.name.endsWith(".json")) {
        const text = await file.text();
        try {
          parsed = await parseChatGPTJSON(text);
        } catch {
          parsed = await parseClaudeExport(file);
        }
      } else {
        throw new Error("Unsupported file type. Please use .zip or .json");
      }

      if (parsed.length === 0) {
        throw new Error("No conversations found in the file.");
      }

      await runAnalysis(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
      setStage("error");
    }
  };

  const handleText = async (text: string) => {
    setStage("parsing");
    setError("");

    try {
      const parsed = parseRawText(text);
      if (parsed.length === 0) {
        throw new Error("Could not parse any conversations from the text.");
      }
      await runAnalysis(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse text");
      setStage("error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 py-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Turn AI Conversations into Knowledge Assets
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Upload your ChatGPT or Claude export and extract SOPs, recurring
          patterns, and reusable prompt templates for your team.
        </p>
      </div>

      {/* Status (when processing) */}
      {stage !== "idle" && (
        <ProcessingStatus
          stage={stage}
          progress={stage === "analyzing" ? progress : undefined}
          conversationCount={conversations.length || undefined}
          groupCount={groups.length || undefined}
          error={error}
        />
      )}

      {/* Inputs (only when idle or error) */}
      {(stage === "idle" || stage === "error") && (
        <div className="space-y-8">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              1. Set your API key
            </h3>
            <ApiKeyInput onKeySet={handleKeySet} />
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              2. Upload your conversations
            </h3>
            <FileUpload onFileSelected={handleFile} onTextPasted={handleText} />
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>
                <strong>ChatGPT:</strong> Settings &rarr; Data Controls &rarr;
                Export Data &rarr; upload the .zip
              </p>
              <p>
                <strong>Claude:</strong> Settings &rarr; Account &rarr; Export
                Data &rarr; upload the .json
              </p>
              <p>
                <strong>Other:</strong> Paste your conversations as text using
                the &quot;Paste Text&quot; tab
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset button when error */}
      {stage === "error" && (
        <button
          onClick={() => {
            setStage("idle");
            setError("");
          }}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
