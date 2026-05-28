import type { Problem } from "../domain/Problem.js";

export interface IProblemRepository {
  getAll(): Problem[];
  getById(id: string): Problem | undefined;
  getByCategory(category: string): Problem[];
  listCategories(): string[];
}
