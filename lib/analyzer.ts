import { ConversationGroup, SOP, Pattern, PromptTemplate, LLMProvider } from "./types";
import {
  SOP_EXTRACTION_PROMPT,
  PATTERN_DETECTION_PROMPT,
  PROMPT_EXTRACTION_PROMPT,
  buildConversationContext,
} from "./prompts";

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
  // Try to extract JSON from the response (LLMs sometimes wrap in markdown)
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
  provider: LLMProvider
): Promise<{ sops: SOP[]; patterns: Pattern[]; prompts: PromptTemplate[] }> {
  const context = buildConversationContext(group.conversations);
  const sourceNames = group.conversations.map((c) => c.title);

  // Run all three extraction passes in parallel
  const [sopRaw, patternRaw, promptRaw] = await Promise.all([
    callLLM(SOP_EXTRACTION_PROMPT, context, apiKey, provider),
    callLLM(PATTERN_DETECTION_PROMPT, context, apiKey, provider),
    callLLM(PROMPT_EXTRACTION_PROMPT, context, apiKey, provider),
  ]);

  // Parse results with fallbacks
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

  let patterns: Pattern[] = [];
  try {
    const parsed = parseJSON<{ patterns: Omit<Pattern, "id">[] }>(patternRaw);
    patterns = (parsed.patterns || []).map((p) => ({
      ...p,
      id: genId(),
    }));
  } catch (e) {
    console.warn("Failed to parse patterns:", e);
  }

  let prompts: PromptTemplate[] = [];
  try {
    const parsed = parseJSON<{ prompts: Omit<PromptTemplate, "id">[] }>(promptRaw);
    prompts = (parsed.prompts || []).map((p) => ({
      ...p,
      id: genId(),
    }));
  } catch (e) {
    console.warn("Failed to parse prompts:", e);
  }

  return { sops, patterns, prompts };
}

export async function analyzeAll(
  groups: ConversationGroup[],
  apiKey: string,
  provider: LLMProvider,
  onProgress?: (completed: number, total: number) => void
): Promise<{ sops: SOP[]; patterns: Pattern[]; prompts: PromptTemplate[] }> {
  const allSops: SOP[] = [];
  const allPatterns: Pattern[] = [];
  const allPrompts: PromptTemplate[] = [];

  // Process groups sequentially to avoid rate limits
  for (let i = 0; i < groups.length; i++) {
    const result = await analyzeGroup(groups[i], apiKey, provider);
    allSops.push(...result.sops);
    allPatterns.push(...result.patterns);
    allPrompts.push(...result.prompts);
    onProgress?.(i + 1, groups.length);
  }

  return { sops: allSops, patterns: allPatterns, prompts: allPrompts };
}
