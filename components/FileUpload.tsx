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
              ? "bg-brand text-white"
              : "bg-warm-50 text-[#5F5F5F] hover:bg-warm-100"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-brand text-white"
              : "bg-warm-50 text-[#5F5F5F] hover:bg-warm-100"
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
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-brand bg-brand-light"
              : fileName
              ? "border-green-400 bg-green-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-warm-50"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".zip,.json"
            onChange={handleFileInput}
            className="hidden"
          />
          {fileName ? (
            <div>
              <p className="text-green-700 font-medium">{fileName}</p>
              <p className="text-sm text-[#8E8E8E] mt-1">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[#111111] font-medium">
                Drop your ChatGPT or Claude export here
              </p>
              <p className="text-sm text-[#8E8E8E] mt-1">
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
            className="w-full h-48 border border-gray-200 rounded-2xl p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
          <button
            onClick={() => pastedText.trim() && onTextPasted(pastedText)}
            disabled={!pastedText.trim()}
            className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
          >
            Use This Text
          </button>
        </div>
      )}
    </div>
  );
}
