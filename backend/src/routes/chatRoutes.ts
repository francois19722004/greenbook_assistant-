import { Router } from "express";
import type { ChatController } from "../controllers/ChatController.js";

export function createChatRouter(controller: ChatController): Router {
  const router = Router();
  router.post("/chat", controller.stream);
  router.post("/chat/end", controller.end);
  return router;
}
