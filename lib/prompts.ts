/**
 * Build SOP extraction prompt focused on the user's specific topic.
 * The user always provides what kind of SOP they want.
 */
export function buildSOPPrompt(userFocus: string): string {
  return `You are a knowledge management expert. Analyze the following AI conversations and extract Standard Operating Procedures (SOPs).

The user is specifically looking for SOPs related to:
"${userFocus}"

Only extract SOPs that are directly relevant to this topic. Ignore workflows that are not related.
If the conversations contain no information about this topic, return {"sops": []}.

For each workflow you identify, generate an SOP in the following JSON format:

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
- Steps should be actionable and specific, not vague
- If no clear SOPs exist for this topic, return {"sops": []}
- Include context about why each step matters when it's not obvious
- Maximum 5 SOPs per response — only the most important ones

Return ONLY valid JSON, no other text.`;
}

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
