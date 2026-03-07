import JSZip from "jszip";
import { ParsedConversation, ParsedMessage } from "../types";

/**
 * Parse Claude's conversation export.
 * Claude exports conversations as JSON with a similar structure.
 * This handles both the JSON array format and individual conversation files.
 */

interface ClaudeMessage {
  sender: "human" | "assistant";
  text: string;
  created_at?: string;
}

interface ClaudeConversation {
  uuid: string;
  name: string;
  created_at: string;
  chat_messages: ClaudeMessage[];
}

export async function parseClaudeExport(
  file: File
): Promise<ParsedConversation[]> {
  const text = await file.text();

  // Try parsing as JSON first
  try {
    const data: ClaudeConversation[] = JSON.parse(text);
    return data
      .map((conv, index) => ({
        id: conv.uuid || `claude-${index}`,
        title: conv.name || "Untitled",
        createdAt: new Date(conv.created_at).getTime(),
        messages: conv.chat_messages
          .filter((m) => m.text.trim())
          .map(
            (m): ParsedMessage => ({
              role: m.sender === "human" ? "user" : "assistant",
              content: m.text,
              timestamp: m.created_at
                ? new Date(m.created_at).getTime() / 1000
                : undefined,
            })
          ),
      }))
      .filter((c) => c.messages.length > 0)
      .sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    // Not JSON — might be a zip
  }

  // Try as zip
  try {
    const zip = await JSZip.loadAsync(file);
    const conversations: ParsedConversation[] = [];
    let index = 0;

    for (const [filename, zipEntry] of Object.entries(zip.files)) {
      if (filename.endsWith(".json") && !zipEntry.dir) {
        try {
          const content = await zipEntry.async("string");
          const data: ClaudeConversation[] = JSON.parse(content);
          for (const conv of data) {
            conversations.push({
              id: conv.uuid || `claude-${index}`,
              title: conv.name || "Untitled",
              createdAt: new Date(conv.created_at).getTime(),
              messages: conv.chat_messages
                .filter((m) => m.text.trim())
                .map(
                  (m): ParsedMessage => ({
                    role: m.sender === "human" ? "user" : "assistant",
                    content: m.text,
                    timestamp: m.created_at
                      ? new Date(m.created_at).getTime() / 1000
                      : undefined,
                  })
                ),
            });
            index++;
          }
        } catch {
          // Skip unparseable files
        }
      }
    }

    return conversations
      .filter((c) => c.messages.length > 0)
      .sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    throw new Error(
      "Could not parse Claude export. Expected JSON or zip file."
    );
  }
}
