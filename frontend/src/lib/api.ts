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

const base = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function json<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export function fetchCategories() {
  return json<{ categories: CategorySummary[] }>("/categories").then(
    (r) => r.categories
  );
}

export function fetchProblem(id: string) {
  return json<{ problem: Problem }>(`/problems/${id}`).then((r) => r.problem);
}

export function chatEndpoint() {
  return `${base}/chat`;
}

export async function endConversation(sessionId: string): Promise<string> {
  const res = await fetch(`${base}/chat/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { summary: string };
  return data.summary;
}

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
