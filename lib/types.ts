export interface ParsedMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp?: number;
}

export interface ParsedConversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ParsedMessage[];
}

export interface ConversationGroup {
  theme: string;
  conversations: ParsedConversation[];
}

export interface SOP {
  id: string;
  title: string;
  trigger: string;
  steps: string[];
  tools: string[];
  expectedOutcome: string;
  sourceConversations: string[];
}

export interface AnalysisResult {
  sops: SOP[];
  totalConversations: number;
  totalGroups: number;
}

export type LLMProvider = "openai" | "anthropic";

export interface AnalyzeRequest {
  groups: ConversationGroup[];
  apiKey: string;
  provider: LLMProvider;
  userFocus: string; // Required: what kind of SOP the user wants to extract
}
