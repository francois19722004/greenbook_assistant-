import type {
  ConversationMessage,
  ConversationSession,
} from "../domain/Conversation.js";
import type { IConversationStore } from "./IConversationStore.js";

export class InMemoryConversationStore implements IConversationStore {
  private readonly sessions = new Map<string, ConversationSession>();

  getOrCreate(sessionId: string, problemId: string): ConversationSession {
    const existing = this.sessions.get(sessionId);
    if (existing) {
      if (existing.problemId !== problemId) {
        throw new Error(
          `Session ${sessionId} already bound to problem ${existing.problemId}`
        );
      }
      return existing;
    }
    const now = Date.now();
    const created: ConversationSession = {
      sessionId,
      problemId,
      history: [],
      createdAt: now,
      updatedAt: now,
    };
    this.sessions.set(sessionId, created);
    return created;
  }

  get(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }

  append(sessionId: string, message: ConversationMessage): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    session.history.push(message);
    session.updatedAt = Date.now();
  }

  end(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
