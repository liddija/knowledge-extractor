"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onTextPasted: (text: string) => void;
}

export default function FileUpload({
  onFileSelected,
  onTextPasted,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setFileName(file.name);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("file")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "file"
              ? "bg-coral text-white"
              : "bg-cream-dark text-charcoal hover:bg-coral-light hover:text-coral-dark"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-coral text-white"
              : "bg-cream-dark text-charcoal hover:bg-coral-light hover:text-coral-dark"
          }`}
        >
          Paste Text
        </button>
      </div>

      {mode === "file" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer overflow-hidden ${
            dragOver
              ? "border-teal bg-teal-light"
              : fileName
              ? "border-green-400 bg-green-50"
              : "border-cream-dark hover:border-teal/50"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {/* Background image */}
          {!fileName && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15"
              style={{ backgroundImage: "url('/upload-bg.png')" }}
            />
          )}
          <input
            id="file-input"
            type="file"
            accept=".zip,.json"
            onChange={handleFileInput}
            className="hidden"
          />
          {fileName ? (
            <div className="relative z-10">
              <p className="text-green-700 font-medium">{fileName}</p>
              <p className="text-sm text-charcoal/40 mt-1">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-charcoal font-medium">
                Drop your ChatGPT or Claude export here
              </p>
              <p className="text-sm text-charcoal/40 mt-1">
                Accepts .zip or .json files
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={`Paste your conversation text here...\n\nFormat:\nUser: your message\nAssistant: AI response\n\n---\n\nUser: another conversation\nAssistant: another response`}
            className="w-full h-48 border border-cream-dark rounded-2xl p-4 text-sm text-charcoal bg-white/60 backdrop-blur-sm resize-y placeholder-charcoal/25 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent focus:bg-white/80 transition-all"
          />
          <button
            onClick={() => pastedText.trim() && onTextPasted(pastedText)}
            disabled={!pastedText.trim()}
            className="px-5 py-2.5 bg-teal text-white rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-dark transition-colors"
          >
            Use This Text
          </button>
        </div>
      )}
    </div>
  );
}
