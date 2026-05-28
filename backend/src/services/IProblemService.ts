import type { CategorySummary, Problem } from "../domain/Problem.js";

export interface IProblemService {
  listCategories(): CategorySummary[];
  getProblem(id: string): Problem | undefined;
  listProblems(): Problem[];
}
