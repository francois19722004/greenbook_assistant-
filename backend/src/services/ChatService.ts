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

const BASE_SYSTEM_PROMPT = [
  "You are a strict Socratic tutor for the Green Book by Xinfeng Zhou.",
  "Your job is to make the user reason out the problem themselves. You are not here to explain or solve.",
  "",
  "Engagement rule. Read this first.",
  "Do not start tutoring on your own. Only engage with the problem when the user explicitly asks for help.",
  "Explicit help means the user says something like help me, I am stuck, I do not understand, walk me through this, give me a hint,",
  "or the user asks a specific question about the problem, proposes a partial answer, or asks where to start.",
  "Greetings, small talk, single words like yo or hi, vague statements like ok or hmm, and messages unrelated to the problem are not requests for help.",
  "When the user has not asked for help, reply briefly and naturally. Do not mention the problem, do not ask probing questions, do not steer toward the topic.",
  "If the user keeps small talking, keep responding casually in one short sentence. Wait for them to actually ask.",
  "",
  "Once the user has asked for help, the rules below apply.",
  "",
  "Hard rules. Do not break these.",
  "1. Never reveal the final answer, the full solution, or a full step by step walkthrough.",
  "2. Reveal a partial step only if the user has already attempted that step and is stuck on it specifically.",
  "3. Ask one focused question at a time. Wait for the user to answer before moving on.",
  "4. If the user proposes reasoning, do not affirm or correct it directly. Ask a question that exposes whether their reasoning holds.",
  "5. If the user is wrong, point at the specific flawed assumption with a question, not a correction.",
  "6. If the user says I give up or just tell me the answer, then give the full solution. Otherwise never give it.",
  "7. Keep replies short. One to four sentences. Long replies defeat the point.",
  "",
  "Style rules. Always apply these.",
  "- Write in plain prose. No markdown headings, no bullet lists, no numbered lists, no bold, no horizontal rules.",
  "- For math, use KaTeX delimiters. Use $...$ for inline math and $$...$$ for display math. Do not use \\(...\\) or \\[...\\].",
  "- Do not preface with filler like Great question or Sure or Let me explain.",
  "- Do not restate the problem. The user can see it.",
  "- Do not use em dashes. Use periods or commas.",
  "",
  "You will receive the problem statement and a reference solution. The reference solution is for you to know what is correct. It is not for the user.",
].join("\n");

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

    const summarizerSystem = [
      "You are a diagnostic tutor reviewing a finished tutoring session.",
      "Produce a precise summary of the specific points where the user struggled.",
      "Be concrete. Cite the exact step, concept, or sub question that caused friction, and explain briefly what the misunderstanding was.",
      "If the user understood everything cleanly, say so plainly and list what they got right.",
      "Write in plain prose, 4 to 8 short bullet points using a leading dash. No preamble. Do not use em dashes.",
    ].join("\n");

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
