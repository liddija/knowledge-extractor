import { ParsedConversation, ConversationGroup } from "./types";

/**
 * Group conversations by topic similarity using keyword extraction from titles
 * and time proximity as a secondary signal.
 */

// Common stop words to ignore
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "and", "but", "or",
  "nor", "not", "so", "yet", "both", "either", "neither", "each",
  "every", "all", "any", "few", "more", "most", "other", "some", "such",
  "no", "only", "own", "same", "than", "too", "very", "just", "about",
  "up", "out", "how", "what", "which", "who", "whom", "this", "that",
  "these", "those", "i", "me", "my", "myself", "we", "our", "you",
  "your", "he", "him", "his", "she", "her", "it", "its", "they", "them",
  "their", "help", "please", "want", "need", "like", "make", "get",
  "use", "using", "create", "write", "give", "tell", "show", "new",
]);

function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function similarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const intersection = b.filter((word) => setA.has(word));
  return intersection.length / Math.max(a.length, b.length);
}

export function chunkConversations(
  conversations: ParsedConversation[],
  similarityThreshold = 0.3
): ConversationGroup[] {
  if (conversations.length === 0) return [];

  // Extract keywords for each conversation
  const withKeywords = conversations.map((conv) => ({
    conv,
    keywords: extractKeywords(conv.title),
  }));

  const assigned = new Set<number>();
  const groups: ConversationGroup[] = [];

  for (let i = 0; i < withKeywords.length; i++) {
    if (assigned.has(i)) continue;

    const group: ParsedConversation[] = [withKeywords[i].conv];
    assigned.add(i);
    const groupKeywords = [...withKeywords[i].keywords];

    for (let j = i + 1; j < withKeywords.length; j++) {
      if (assigned.has(j)) continue;

      const keywordSim = similarity(groupKeywords, withKeywords[j].keywords);

      // Time proximity bonus: conversations within 7 days get a boost
      const timeDiffDays = Math.abs(
        withKeywords[i].conv.createdAt - withKeywords[j].conv.createdAt
      ) / 86400000;
      const timeBonus = timeDiffDays < 7 ? 0.1 : 0;

      if (keywordSim + timeBonus >= similarityThreshold) {
        group.push(withKeywords[j].conv);
        assigned.add(j);
        // Expand group keywords
        groupKeywords.push(...withKeywords[j].keywords);
      }
    }

    // Determine theme from most common keywords
    const keywordCounts = new Map<string, number>();
    for (const kw of groupKeywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    }
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    const theme =
      topKeywords.length > 0
        ? topKeywords.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(", ")
        : `Group ${groups.length + 1}`;

    groups.push({ theme, conversations: group });
  }

  return groups.sort((a, b) => b.conversations.length - a.conversations.length);
}
