import { useEffect, useState } from "react";
import { fetchProblem, type Problem } from "@/lib/api";

export function useProblem(id: string | undefined) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchProblem(id)
      .then((p) => {
        if (active) setProblem(p);
      })
      .catch((e: Error) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { problem, loading, error };
}
