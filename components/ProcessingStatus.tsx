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
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        {stage === "error" ? (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-lg">!</span>
          </div>
        ) : stage === "done" ? (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-lg">&#10003;</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
          </div>
        )}
        <span className="font-medium text-gray-900">
          {STAGE_LABELS[stage]}
        </span>
      </div>

      {/* Progress steps */}
      <div className="flex gap-2">
        {["Parse", "Group", "Analyze", "Done"].map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${
                i <= stageIndex ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      {conversationCount !== undefined && (
        <div className="flex gap-6 text-sm text-gray-600">
          <span>{conversationCount} conversations parsed</span>
          {groupCount !== undefined && (
            <span>{groupCount} topic groups found</span>
          )}
        </div>
      )}

      {/* Analysis progress */}
      {progress && stage === "analyzing" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Analyzing group {progress.completed} of {progress.total}
            </span>
            <span>
              {Math.round((progress.completed / progress.total) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: `${(progress.completed / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
