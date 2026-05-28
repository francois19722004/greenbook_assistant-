import type {
  ConversationMessage,
  ConversationSession,
} from "../domain/Conversation.js";

export interface IConversationStore {
  getOrCreate(sessionId: string, problemId: string): ConversationSession;
  get(sessionId: string): ConversationSession | undefined;
  append(sessionId: string, message: ConversationMessage): void;
  end(sessionId: string): void;
}
