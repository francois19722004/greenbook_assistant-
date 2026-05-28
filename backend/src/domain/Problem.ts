export interface Problem {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  problemText: string;
  solutionText: string;
  hintText: string;
  source: string;
  createdAt: string;
}

export interface CategorySummary {
  category: string;
  count: number;
  problems: Array<Pick<Problem, "id" | "title" | "subcategory">>;
}
