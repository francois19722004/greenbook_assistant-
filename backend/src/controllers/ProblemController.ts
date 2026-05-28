import type { Request, Response } from "express";
import type { IProblemService } from "../services/IProblemService.js";

export class ProblemController {
  constructor(private readonly service: IProblemService) {}

  listCategories = (_req: Request, res: Response): void => {
    res.json({ categories: this.service.listCategories() });
  };

  listProblems = (_req: Request, res: Response): void => {
    res.json({ problems: this.service.listProblems() });
  };

  getProblem = (req: Request, res: Response): void => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    const problem = this.service.getProblem(id);
    if (!problem) {
      res.status(404).json({ error: "problem not found" });
      return;
    }
    res.json({ problem });
  };
}
