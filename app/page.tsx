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

const FEATURES = [
  {
    id: "sops",
    label: "SOPs & Workflows",
    description:
      "Step-by-step processes you\u2019ve built through repeated AI interactions",
  },
  {
    id: "prompts",
    label: "Prompt Templates",
    description:
      "Your best prompts extracted and turned into reusable templates with placeholder variables",
  },
  {
    id: "lessons",
    label: "Lessons Learned",
    description:
      "What worked, what didn\u2019t \u2014 trial-and-error insights and debugging approaches",
  },
  {
    id: "decisions",
    label: "Decision Patterns",
    description:
      "How you make decisions, recurring reasoning, and problem-solving strategies",
  },
  {
    id: "brand",
    label: "Brand & Tone Guidelines",
    description:
      "Voice, tone, and messaging rules refined through AI dialogue",
  },
  {
    id: "research",
    label: "Research & Insights",
    description:
      "Market assessments, target audience analyses, and competitive findings",
  },
];

export default function Home() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [groups, setGroups] = useState<ConversationGroup[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [userFocus, setUserFocus] = useState("");
  const [focusError, setFocusError] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleKeySet = useCallback((key: string, prov: LLMProvider) => {
    setApiKey(key);
    setProvider(prov);
  }, []);

  /** Validate before starting — returns false if something is missing */
  const validateInputs = (): boolean => {
    if (!apiKey) {
      setError("Please set your API key first.");
      setStage("error");
      return false;
    }
    if (!userFocus.trim()) {
      setFocusError(true);
      return false;
    }
    setFocusError(false);
    return true;
  };

  const runAnalysis = async (parsedConvos: ParsedConversation[]) => {
    const focus = userFocus.trim();

    setConversations(parsedConvos);

    // Chunk
    setStage("chunking");
    const chunked = chunkConversations(parsedConvos);
    setGroups(chunked);

    // Analyze
    setStage("analyzing");
    setProgress({ completed: 0, total: chunked.length });

    try {
      const result = await analyzeAll(chunked, apiKey, provider, focus, (completed, total) => {
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
      setTimeout(() => router.push("/results"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStage("error");
    }
  };

  const handleFile = async (file: File) => {
    if (!validateInputs()) return;
    setStage("parsing");
    setError("");

    try {
      let parsed: ParsedConversation[];

      if (file.name.endsWith(".zip")) {
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
    if (!validateInputs()) return;
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

  const activeFeature = FEATURES.find((f) => f.id === selectedFeature);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-charcoal tracking-tight text-balance leading-tight">
          Extract Your High-Impact Workflows
          <br />
          <span className="text-teal">from Your AI Conversations</span>
        </h2>
        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
          Upload your AI export. Get back structured knowledge — ready to scale.
        </p>
      </div>

      {/* Feature showcase */}
      <div className="bg-grid bg-cream rounded-2xl shadow-sm p-8 space-y-5 border border-sage-border/40">
        <p className="text-charcoal/70 text-sm leading-relaxed max-w-3xl">
          Your AI conversations contain months of refined expertise. Knowledge
          Extractor analyzes your chat history and surfaces the knowledge that
          matters:
        </p>
        <div className="flex flex-wrap gap-3">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() =>
                setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )
              }
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedFeature === feature.id
                  ? "bg-teal-dark text-white shadow-sm"
                  : "bg-sage/70 backdrop-blur-sm border border-sage-border text-charcoal hover:bg-sage hover:border-teal/40"
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>
        {activeFeature && (
          <div className="bg-white/80 backdrop-blur-sm border border-sage-border rounded-xl px-5 py-4 text-sm text-charcoal animate-fadeIn">
            <strong className="text-teal-dark">{activeFeature.label}:</strong>{" "}
            {activeFeature.description}
          </div>
        )}
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
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <h3 className="font-semibold text-charcoal text-lg">
                Set your API key
              </h3>
            </div>
            <ApiKeyInput onKeySet={handleKeySet} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <h3 className="font-semibold text-charcoal text-lg">
                Export your conversations
              </h3>
            </div>
            <div className="text-sm text-charcoal/60 space-y-2">
              <p>
                <strong className="text-charcoal">Claude:</strong> Settings &rarr; Privacy &rarr; Export
              </p>
              <p>
                <strong className="text-charcoal">ChatGPT:</strong> Settings &rarr; Data Controls &rarr;
                Export
              </p>
              <p>
                <strong className="text-charcoal">Other:</strong> Paste your conversations as text using
                the &quot;Paste Text&quot; tab below
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <h3 className="font-semibold text-charcoal text-lg">
                Describe the SOP you want to extract
              </h3>
            </div>
            <textarea
              value={userFocus}
              onChange={(e) => {
                setUserFocus(e.target.value);
                if (e.target.value.trim()) setFocusError(false);
              }}
              placeholder="e.g. How we onboard new clients, Our content publishing workflow, Bug triage process..."
              className={`w-full border rounded-2xl px-5 py-4 text-sm text-charcoal placeholder-charcoal/30 bg-cream/50 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-shadow ${
                focusError
                  ? "border-red-400 focus:ring-red-400"
                  : "border-cream-dark focus:ring-teal"
              }`}
              rows={3}
            />
            {focusError ? (
              <p className="mt-2 text-xs text-red-500 font-medium">
                Please describe the SOP you want to extract before uploading.
              </p>
            ) : (
              <p className="mt-2 text-xs text-charcoal/40">
                Give a short description of the workflow or process you want to
                turn into a Standard Operating Procedure. The more specific, the
                better the results.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <h3 className="font-semibold text-charcoal text-lg">
                Upload your conversations
              </h3>
            </div>
            <FileUpload onFileSelected={handleFile} onTextPasted={handleText} />
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
          className="w-full py-3 bg-cream-dark text-charcoal/60 rounded-full font-medium hover:bg-teal-light hover:text-teal-dark transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
