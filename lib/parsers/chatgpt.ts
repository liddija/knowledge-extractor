import JSZip from "jszip";
import { ParsedConversation, ParsedMessage } from "../types";

interface ChatGPTMessage {
  id: string;
  author: { role: string };
  content: { content_type: string; parts?: (string | null)[] };
  create_time: number | null;
}

interface ChatGPTConversation {
  title: string;
  create_time: number;
  mapping: Record<
    string,
    { message: ChatGPTMessage | null; parent: string | null; children: string[] }
  >;
}

function flattenMapping(
  mapping: ChatGPTConversation["mapping"]
): ParsedMessage[] {
  const messages: ParsedMessage[] = [];

  // Find the root node (no parent)
  const rootId = Object.keys(mapping).find((id) => !mapping[id].parent);
  if (!rootId) return messages;

  // BFS through the tree following first child path
  const queue: string[] = [rootId];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = mapping[nodeId];

    if (node.message) {
      const role = node.message.author.role;
      const parts = node.message.content.parts ?? [];
      const content = parts
        .filter((p): p is string => typeof p === "string")
        .join("\n")
        .trim();

      if (content && (role === "user" || role === "assistant")) {
        messages.push({
          role: role as "user" | "assistant",
          content,
          timestamp: node.message.create_time ?? undefined,
        });
      }
    }

    // Follow children
    if (node.children.length > 0) {
      queue.push(...node.children);
    }
  }

  return messages;
}

export async function parseChatGPTZip(
  file: File
): Promise<ParsedConversation[]> {
  const zip = await JSZip.loadAsync(file);
  const conversationsFile = zip.file("conversations.json");

  if (!conversationsFile) {
    throw new Error(
      "No conversations.json found in zip. Make sure this is a ChatGPT data export."
    );
  }

  const raw = await conversationsFile.async("string");
  const data: ChatGPTConversation[] = JSON.parse(raw);

  return data
    .map((conv, index) => ({
      id: `chatgpt-${index}`,
      title: conv.title || "Untitled",
      createdAt: conv.create_time,
      messages: flattenMapping(conv.mapping),
    }))
    .filter((conv) => conv.messages.length > 0)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function parseChatGPTJSON(
  json: string
): Promise<ParsedConversation[]> {
  const data: ChatGPTConversation[] = JSON.parse(json);

  return data
    .map((conv, index) => ({
      id: `chatgpt-${index}`,
      title: conv.title || "Untitled",
      createdAt: conv.create_time,
      messages: flattenMapping(conv.mapping),
    }))
    .filter((conv) => conv.messages.length > 0)
    .sort((a, b) => a.createdAt - b.createdAt);
}
