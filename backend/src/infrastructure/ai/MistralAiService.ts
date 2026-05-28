import { createMistral } from "@ai-sdk/mistral";
import { generateText, streamText, type CoreMessage } from "ai";
import type { Response } from "express";
import type { IAiService, LlmChatInput } from "./IAiService.js";

export class MistralAiService implements IAiService {
  private readonly model;
  private readonly modelId: string;

  constructor(apiKey: string, modelId: string) {
    if (!apiKey) {
      console.warn(
        "[MistralAiService] MISTRAL_API_KEY is empty. /api/chat endpoints will fail."
      );
    }
    const client = createMistral({ apiKey });
    this.modelId = modelId;
    this.model = client(modelId);
  }

  async streamChat(
    input: LlmChatInput,
    res: Response,
    callbacks?: { onAssistantMessage?: (text: string) => void }
  ): Promise<void> {
    const { system, messages } = this.compose(input);

    console.log(
      `[MistralAiService] streamChat model=${this.modelId} historyLen=${messages.length}`
    );

    const result = streamText({
      model: this.model,
      system,
      messages,
      onError: ({ error }) => {
        console.error("[MistralAiService] streamText onError:", error);
      },
      onFinish: ({ text, finishReason, usage }) => {
        console.log(
          `[MistralAiService] finished reason=${finishReason} usage=${JSON.stringify(usage)}`
        );
        callbacks?.onAssistantMessage?.(text);
      },
    });

    result.pipeDataStreamToResponse(res, {
      getErrorMessage: (error) => {
        console.error("[MistralAiService] data stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  }

  async completeChat(input: LlmChatInput): Promise<string> {
    const { system, messages } = this.compose(input);
    const result = await generateText({
      model: this.model,
      system,
      messages,
    });
    return result.text;
  }

  private compose(input: LlmChatInput): {
    system: string;
    messages: CoreMessage[];
  } {
    const system = [
      input.systemPrompt,
      "",
      "Problem instruction:",
      input.questionInstruction,
      "",
      "Reference solution (ground truth, do not dump it verbatim unless asked):",
      input.questionSolution,
    ].join("\n");

    const messages: CoreMessage[] = input.conversationHistory.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    return { system, messages };
  }
}
