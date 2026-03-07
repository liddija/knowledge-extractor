import { ParsedConversation, ParsedMessage } from "../types";

/**
 * Parse raw pasted text into conversations.
 * Supports formats:
 *   - "User: ... \n Assistant: ..." style
 *   - "Human: ... \n AI: ..." style
 *   - Separated by blank lines or --- dividers
 */
export function parseRawText(text: string): ParsedConversation[] {
  // Split into conversation blocks by --- or === dividers
  const blocks = text
    .split(/\n\s*(?:---+|===+)\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    // Treat the whole thing as one conversation
    return [parseBlock(text, 0)].filter((c) => c.messages.length > 0);
  }

  return blocks
    .map((block, i) => parseBlock(block, i))
    .filter((c) => c.messages.length > 0);
}

function parseBlock(text: string, index: number): ParsedConversation {
  const messages: ParsedMessage[] = [];

  // Match patterns like "User:", "Human:", "Assistant:", "AI:", "ChatGPT:", "Claude:"
  const turnPattern =
    /^(User|Human|Me|Assistant|AI|ChatGPT|Claude|GPT|System):\s*/gim;
  const parts: { role: string; startIndex: number }[] = [];

  let match;
  while ((match = turnPattern.exec(text)) !== null) {
    parts.push({ role: match[1].toLowerCase(), startIndex: match.index + match[0].length });
  }

  if (parts.length === 0) {
    // No role markers found — treat the whole block as a single user message
    messages.push({ role: "user", content: text.trim() });
  } else {
    for (let i = 0; i < parts.length; i++) {
      const start = parts[i].startIndex;
      const end = i < parts.length - 1 ? text.lastIndexOf("\n", parts[i + 1].startIndex - 1) : text.length;
      const content = text.slice(start, end).trim();

      if (!content) continue;

      const rawRole = parts[i].role;
      const role: "user" | "assistant" =
        ["user", "human", "me"].includes(rawRole) ? "user" : "assistant";

      messages.push({ role, content });
    }
  }

  // Try to extract a title from the first user message
  const firstUserMsg = messages.find((m) => m.role === "user");
  const title = firstUserMsg
    ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "..." : "")
    : `Conversation ${index + 1}`;

  return {
    id: `raw-${index}`,
    title,
    createdAt: Date.now() - (1000 - index) * 86400000, // spread across time
    messages,
  };
}
