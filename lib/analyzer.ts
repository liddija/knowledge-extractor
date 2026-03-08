import { ConversationGroup, SOP, LLMProvider } from "./types";
import { buildSOPPrompt, buildConversationContext } from "./prompts";

async function callLLM(
  systemPrompt: string,
  userContent: string,
  apiKey: string,
  provider: LLMProvider
): Promise<string> {
  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (provider === "anthropic") {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        provider: "anthropic",
        systemPrompt,
        userContent,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return data.content;
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

function parseJSON<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in LLM response");
  }
  return JSON.parse(jsonMatch[0]);
}

let idCounter = 0;
function genId(): string {
  return `ke-${Date.now()}-${++idCounter}`;
}

export async function analyzeGroup(
  group: ConversationGroup,
  apiKey: string,
  provider: LLMProvider,
  userFocus: string
): Promise<{ sops: SOP[] }> {
  const context = buildConversationContext(group.conversations);
  const sourceNames = group.conversations.map((c) => c.title);

  const sopPrompt = buildSOPPrompt(userFocus);
  const sopRaw = await callLLM(sopPrompt, context, apiKey, provider);

  let sops: SOP[] = [];
  try {
    const parsed = parseJSON<{ sops: Omit<SOP, "id" | "sourceConversations">[] }>(sopRaw);
    sops = (parsed.sops || []).map((s) => ({
      ...s,
      id: genId(),
      sourceConversations: sourceNames,
    }));
  } catch (e) {
    console.warn("Failed to parse SOPs:", e);
  }

  return { sops };
}

export async function analyzeAll(
  groups: ConversationGroup[],
  apiKey: string,
  provider: LLMProvider,
  userFocus: string,
  onProgress?: (completed: number, total: number) => void
): Promise<{ sops: SOP[] }> {
  const allSops: SOP[] = [];

  for (let i = 0; i < groups.length; i++) {
    const result = await analyzeGroup(groups[i], apiKey, provider, userFocus);
    allSops.push(...result.sops);
    onProgress?.(i + 1, groups.length);
  }

  return { sops: allSops };
}
