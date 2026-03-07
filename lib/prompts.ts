export const SOP_EXTRACTION_PROMPT = `You are a knowledge management expert. Analyze the following AI conversations and identify any repeated workflows, processes, or procedures that the user follows.

For each workflow you identify, generate a Standard Operating Procedure (SOP) in the following JSON format:

{
  "sops": [
    {
      "title": "Short descriptive title",
      "trigger": "When/why this SOP should be used",
      "steps": ["Step 1 description", "Step 2 description", ...],
      "tools": ["Tool or resource needed"],
      "expectedOutcome": "What the completed SOP produces"
    }
  ]
}

Rules:
- Only extract SOPs for workflows that appear in at least 2 conversations or have clearly defined multi-step processes
- Steps should be actionable and specific, not vague
- If no clear SOPs exist, return {"sops": []}
- Focus on WHAT the user does repeatedly, not the AI's responses
- Include context about why each step matters when it's not obvious

Return ONLY valid JSON, no other text.`;

export const PATTERN_DETECTION_PROMPT = `You are a business intelligence analyst. Analyze the following AI conversations and identify recurring patterns, topics, and decision-making behaviors.

For each pattern, provide analysis in the following JSON format:

{
  "patterns": [
    {
      "name": "Short pattern name",
      "frequency": <estimated number of times this pattern appears>,
      "description": "What this pattern is about",
      "decisions": ["Key decision or choice made within this pattern"],
      "insights": ["Actionable insight derived from this pattern"]
    }
  ]
}

Rules:
- Look for recurring topics, repeated questions, common problem types
- Identify decision patterns: what choices does the user tend to make?
- Note any knowledge gaps: topics where the user frequently asks basic questions
- Identify expertise areas: topics where the user gives detailed context
- Return ONLY valid JSON, no other text

Focus on patterns that would be valuable for a team to know about — what work is being done, how decisions are made, and what knowledge exists.`;

export const PROMPT_EXTRACTION_PROMPT = `You are a prompt engineering expert. Analyze the following AI conversations and extract the most effective, reusable prompts the user wrote.

For each high-quality prompt, provide it in the following JSON format:

{
  "prompts": [
    {
      "title": "Short descriptive title for this prompt",
      "template": "The prompt with variable parts replaced by {{placeholder_name}}",
      "variables": ["placeholder_name"],
      "useCase": "When to use this prompt",
      "originalPrompt": "The exact original prompt text"
    }
  ]
}

Rules:
- Only extract prompts that are well-structured, specific, and would be useful to reuse
- Replace specific details (names, dates, products, etc.) with {{placeholders}}
- Skip simple one-line questions like "what is X?" — focus on prompts with structure
- Look for prompts that include: context setting, specific instructions, format requirements, or constraints
- Return ONLY valid JSON, no other text
- Aim for 3-8 prompts per conversation group (quality over quantity)`;

export function buildConversationContext(
  conversations: { title: string; messages: { role: string; content: string }[] }[]
): string {
  return conversations
    .map((conv, i) => {
      const messageSummary = conv.messages
        .slice(0, 20) // Limit to first 20 messages to stay within token limits
        .map((m) => {
          const truncated =
            m.content.length > 500
              ? m.content.slice(0, 500) + "... [truncated]"
              : m.content;
          return `${m.role.toUpperCase()}: ${truncated}`;
        })
        .join("\n");

      return `--- Conversation ${i + 1}: "${conv.title}" ---\n${messageSummary}`;
    })
    .join("\n\n");
}
