import type { Response } from "express";

export interface ChatTurnRequest {
  sessionId: string;
  problemId: string;
  userMessage: string;
}

export interface EndConversationRequest {
  sessionId: string;
}

export interface IChatService {
  streamTurn(request: ChatTurnRequest, res: Response): Promise<void>;
  summarize(request: EndConversationRequest): Promise<string>;
}
