import fs from "node:fs";
import path from "node:path";
import type { Problem } from "../domain/Problem.js";
import type { ICsvParser } from "../infrastructure/csv/ICsvParser.js";
import type { IProblemRepository } from "./IProblemRepository.js";

export class InMemoryProblemRepository implements IProblemRepository {
  private readonly byId = new Map<string, Problem>();
  private readonly byCategory = new Map<string, Problem[]>();
  private readonly ordered: Problem[] = [];

  constructor(csvFilePath: string, parser: ICsvParser) {
    const absolute = path.isAbsolute(csvFilePath)
      ? csvFilePath
      : path.resolve(process.cwd(), csvFilePath);
    const text = fs.readFileSync(absolute, "utf-8");
    const rows = parser.parse(text);
    const [header, ...data] = rows;
    if (!header) throw new Error("CSV has no header");

    const idx = {
      id: header.indexOf("id"),
      title: header.indexOf("title"),
      category: header.indexOf("category"),
      subcategory: header.indexOf("subcategory"),
      problem: header.indexOf("problem_text"),
      solution: header.indexOf("solution_text"),
      hint: header.indexOf("hint_text"),
      source: header.indexOf("source"),
      created: header.indexOf("created_at"),
    };

    for (const r of data) {
      if (!r[idx.id]) continue;
      const p: Problem = {
        id: r[idx.id] ?? "",
        title: (r[idx.title] ?? "").trim(),
        category: (r[idx.category] ?? "uncategorized").trim(),
        subcategory: (r[idx.subcategory] ?? "").trim(),
        problemText: (r[idx.problem] ?? "").trim(),
        solutionText: (r[idx.solution] ?? "").trim(),
        hintText: idx.hint >= 0 ? (r[idx.hint] ?? "").trim() : "",
        source: (r[idx.source] ?? "").trim(),
        createdAt: (r[idx.created] ?? "").trim(),
      };
      this.byId.set(p.id, p);
      this.ordered.push(p);
      const bucket = this.byCategory.get(p.category) ?? [];
      bucket.push(p);
      this.byCategory.set(p.category, bucket);
    }
  }

  getAll(): Problem[] {
    return this.ordered;
  }

  getById(id: string): Problem | undefined {
    return this.byId.get(id);
  }

  getByCategory(category: string): Problem[] {
    return this.byCategory.get(category) ?? [];
  }

  listCategories(): string[] {
    return [...this.byCategory.keys()];
  }
}
