import type { Response } from "express";
import type { ConversationMessage } from "../../domain/Conversation.js";

export interface LlmChatInput {
  systemPrompt: string;
  questionInstruction: string;
  questionSolution: string;
  conversationHistory: ConversationMessage[];
}

export interface IAiService {
  streamChat(
    input: LlmChatInput,
    res: Response,
    callbacks?: { onAssistantMessage?: (text: string) => void }
  ): Promise<void>;

  completeChat(input: LlmChatInput): Promise<string>;
}
