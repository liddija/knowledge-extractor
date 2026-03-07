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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "file"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-indigo-500 bg-indigo-50"
              : fileName
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
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
              <p className="text-sm text-gray-500 mt-1">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 font-medium">
                Drop your ChatGPT or Claude export here
              </p>
              <p className="text-sm text-gray-400 mt-1">
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
            className="w-full h-48 border rounded-xl p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={() => pastedText.trim() && onTextPasted(pastedText)}
            disabled={!pastedText.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            Use This Text
          </button>
        </div>
      )}
    </div>
  );
}
