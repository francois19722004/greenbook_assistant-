import cors from "cors";
import express, { type Express } from "express";
import type { Env } from "./config/Env.js";
import { ChatController } from "./controllers/ChatController.js";
import { ProblemController } from "./controllers/ProblemController.js";
import { MistralAiService } from "./infrastructure/ai/MistralAiService.js";
import { CsvParser } from "./infrastructure/csv/CsvParser.js";
import { InMemoryConversationStore } from "./repositories/InMemoryConversationStore.js";
import { InMemoryProblemRepository } from "./repositories/InMemoryProblemRepository.js";
import { createChatRouter } from "./routes/chatRoutes.js";
import { createProblemRouter } from "./routes/problemRoutes.js";
import { ChatService } from "./services/ChatService.js";
import { ProblemService } from "./services/ProblemService.js";

export function createApp(env: Env): Express {
  const parser = new CsvParser();
  const repository = new InMemoryProblemRepository(env.CSV_PATH, parser);
  const conversations = new InMemoryConversationStore();

  const problemService = new ProblemService(repository);
  const aiService = new MistralAiService(env.MISTRAL_API_KEY, env.MISTRAL_MODEL);
  const chatService = new ChatService(aiService, repository, conversations);

  const problemController = new ProblemController(problemService);
  const chatController = new ChatController(chatService);

  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, problems: repository.getAll().length });
  });

  app.use("/api", createProblemRouter(problemController));
  app.use("/api", createChatRouter(chatController));

  return app;
}
