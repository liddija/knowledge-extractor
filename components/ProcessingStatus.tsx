"use client";

interface ProcessingStatusProps {
  stage: "parsing" | "chunking" | "analyzing" | "done" | "error";
  progress?: { completed: number; total: number };
  conversationCount?: number;
  groupCount?: number;
  error?: string;
}

const STAGE_LABELS = {
  parsing: "Parsing conversations...",
  chunking: "Grouping by topic...",
  analyzing: "Extracting knowledge assets...",
  done: "Analysis complete!",
  error: "Something went wrong",
};

export default function ProcessingStatus({
  stage,
  progress,
  conversationCount,
  groupCount,
  error,
}: ProcessingStatusProps) {
  const stageIndex = ["parsing", "chunking", "analyzing", "done"].indexOf(stage);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
      <div className="flex items-center gap-3">
        {stage === "error" ? (
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-lg font-bold">!</span>
          </div>
        ) : stage === "done" ? (
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-lg">&#10003;</span>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 rounded-full bg-brand" />
          </div>
        )}
        <span className="font-semibold text-[#111111] text-lg">
          {STAGE_LABELS[stage]}
        </span>
      </div>

      {/* Progress steps */}
      <div className="flex gap-2">
        {["Parse", "Group", "Analyze", "Done"].map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i <= stageIndex ? "bg-brand" : "bg-warm-50"
              }`}
            />
            <p className="text-xs text-[#8E8E8E] mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      {conversationCount !== undefined && (
        <div className="flex gap-6 text-sm text-[#5F5F5F]">
          <span>{conversationCount} conversations parsed</span>
          {groupCount !== undefined && (
            <span>{groupCount} topic groups found</span>
          )}
        </div>
      )}

      {/* Analysis progress */}
      {progress && stage === "analyzing" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#8E8E8E]">
            <span>
              Analyzing group {progress.completed} of {progress.total}
            </span>
            <span>
              {Math.round((progress.completed / progress.total) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-warm-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{
                width: `${(progress.completed / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
