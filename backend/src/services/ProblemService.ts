import type { CategorySummary, Problem } from "../domain/Problem.js";
import type { IProblemRepository } from "../repositories/IProblemRepository.js";
import type { IProblemService } from "./IProblemService.js";

export class ProblemService implements IProblemService {
  constructor(private readonly repo: IProblemRepository) {}

  listCategories(): CategorySummary[] {
    return this.repo.listCategories().map((category) => {
      const problems = this.repo.getByCategory(category);
      return {
        category,
        count: problems.length,
        problems: problems.map((p) => ({
          id: p.id,
          title: p.title,
          subcategory: p.subcategory,
        })),
      };
    });
  }

  getProblem(id: string): Problem | undefined {
    return this.repo.getById(id);
  }

  listProblems(): Problem[] {
    return this.repo.getAll();
  }
}
