import { Router } from "express";
import type { ProblemController } from "../controllers/ProblemController.js";

export function createProblemRouter(controller: ProblemController): Router {
  const router = Router();
  router.get("/categories", controller.listCategories);
  router.get("/problems", controller.listProblems);
  router.get("/problems/:id", controller.getProblem);
  return router;
}
