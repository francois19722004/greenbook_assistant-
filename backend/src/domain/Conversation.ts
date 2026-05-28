export type ConversationRole = "user" | "assistant";

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

export interface ConversationSession {
  sessionId: string;
  problemId: string;
  history: ConversationMessage[];
  createdAt: number;
  updatedAt: number;
}
