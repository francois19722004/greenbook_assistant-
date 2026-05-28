import type { Response } from "express";
import type {
  IAiService,
  LlmChatInput,
} from "../infrastructure/ai/IAiService.js";
import type { IConversationStore } from "../repositories/IConversationStore.js";
import type { IProblemRepository } from "../repositories/IProblemRepository.js";
import type {
  ChatTurnRequest,
  EndConversationRequest,
  IChatService,
} from "./IChatService.js";

const BASE_SYSTEM_PROMPT =
  "You are Greenbook Assistant, a patient mentor for aspiring quantitative traders. " +
  "You explain Green Book problems by Xinfeng Zhou step by step. " +
  "Use clear reasoning, reveal intuitions, and adapt to the user's follow up questions. " +
  "Format math with LaTeX when useful. Do not use em dashes in your prose.";

export class ChatService implements IChatService {
  constructor(
    private readonly ai: IAiService,
    private readonly problems: IProblemRepository,
    private readonly conversations: IConversationStore
  ) {}

  async streamTurn(request: ChatTurnRequest, res: Response): Promise<void> {
    const problem = this.problems.getById(request.problemId);
    if (!problem) {
      res.status(404).json({ error: "problem not found" });
      return;
    }

    const session = this.conversations.getOrCreate(
      request.sessionId,
      request.problemId
    );

    this.conversations.append(request.sessionId, {
      role: "user",
      content: request.userMessage,
    });

    const input: LlmChatInput = {
      systemPrompt: BASE_SYSTEM_PROMPT,
      questionInstruction: problem.problemText,
      questionSolution: problem.solutionText,
      conversationHistory: [...session.history],
    };

    await this.ai.streamChat(input, res, {
      onAssistantMessage: (text) => {
        if (text && text.trim().length > 0) {
          this.conversations.append(request.sessionId, {
            role: "assistant",
            content: text,
          });
        }
      },
    });
  }

  async summarize(request: EndConversationRequest): Promise<string> {
    const session = this.conversations.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }
    const problem = this.problems.getById(session.problemId);
    if (!problem) {
      throw new Error(`Problem ${session.problemId} not found`);
    }

    const summarizerSystem =
      "You are a diagnostic tutor reviewing a finished tutoring session. " +
      "Produce a precise summary of the specific points where the user struggled. " +
      "Be concrete: cite the exact step, concept, or sub-question that caused friction, " +
      "and explain briefly what the misunderstanding was. " +
      "If the user understood everything cleanly, say so plainly and list what they got right. " +
      "Do not use em dashes. Output plain text, 4 to 8 short bullet points, no preamble.";

    const finalUserMessage =
      "Based on this conversation, write the difficulty summary now. " +
      "Reference specific questions the user asked, specific steps they got stuck on, " +
      "and what concept was unclear at each point.";

    const input: LlmChatInput = {
      systemPrompt: summarizerSystem,
      questionInstruction: problem.problemText,
      questionSolution: problem.solutionText,
      conversationHistory: [
        ...session.history,
        { role: "user", content: finalUserMessage },
      ],
    };

    const summary = await this.ai.completeChat(input);
    this.conversations.end(request.sessionId);
    return summary;
  }
}
