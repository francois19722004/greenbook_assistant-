import type { Request, Response } from "express";
import { z } from "zod";
import type { IChatService } from "../services/IChatService.js";

const partSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
  })
  .passthrough();

const messageSchema = z
  .object({
    role: z.enum(["system", "user", "assistant", "data"]),
    content: z.union([z.string(), z.array(partSchema)]).optional(),
    parts: z.array(partSchema).optional(),
  })
  .passthrough();

const chatBodySchema = z.object({
  sessionId: z.string().min(1),
  problemId: z.string().min(1),
  messages: z.array(messageSchema).min(1),
});

const endBodySchema = z.object({
  sessionId: z.string().min(1),
});

function flattenContent(msg: z.infer<typeof messageSchema>): string {
  if (typeof msg.content === "string" && msg.content.length > 0) {
    return msg.content;
  }
  if (Array.isArray(msg.content)) {
    const joined = msg.content
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text ?? "")
      .join("");
    if (joined.length > 0) return joined;
  }
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text ?? "")
      .join("");
  }
  return "";
}

export class ChatController {
  constructor(private readonly service: IChatService) {}

  stream = async (req: Request, res: Response): Promise<void> => {
    const parsed = chatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      console.error(
        "[ChatController] invalid body:",
        JSON.stringify(parsed.error.format(), null, 2),
        "actual body:",
        JSON.stringify(req.body, null, 2)
      );
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const last = parsed.data.messages[parsed.data.messages.length - 1];
    if (!last || last.role !== "user") {
      res.status(400).json({ error: "last message must be from user" });
      return;
    }
    const userMessage = flattenContent(last);
    if (!userMessage) {
      console.error(
        "[ChatController] empty user content; raw last message:",
        JSON.stringify(last, null, 2)
      );
      res.status(400).json({ error: "last user message has empty content" });
      return;
    }

    console.log(
      `[ChatController] /api/chat session=${parsed.data.sessionId} problem=${parsed.data.problemId} userMsgLen=${userMessage.length}`
    );

    try {
      await this.service.streamTurn(
        {
          sessionId: parsed.data.sessionId,
          problemId: parsed.data.problemId,
          userMessage,
        },
        res
      );
    } catch (err) {
      console.error("[ChatController] streamTurn error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: (err as Error).message });
      } else {
        res.end();
      }
    }
  };

  end = async (req: Request, res: Response): Promise<void> => {
    const parsed = endBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }
    try {
      const summary = await this.service.summarize({
        sessionId: parsed.data.sessionId,
      });
      res.json({ summary });
    } catch (err) {
      console.error("[ChatController] summarize error:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
