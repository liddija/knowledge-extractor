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

export interface Pattern {
  id: string;
  name: string;
  frequency: number;
  description: string;
  decisions: string[];
  insights: string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  template: string;
  variables: string[];
  useCase: string;
  originalPrompt: string;
}

export interface AnalysisResult {
  sops: SOP[];
  patterns: Pattern[];
  prompts: PromptTemplate[];
  totalConversations: number;
  totalGroups: number;
}

export type LLMProvider = "openai" | "anthropic";

export interface AnalyzeRequest {
  groups: ConversationGroup[];
  apiKey: string;
  provider: LLMProvider;
}
