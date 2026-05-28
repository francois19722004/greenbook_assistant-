import { Link } from "react-router-dom";
import { CategoryCard } from "@/components/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { sortCategories } from "@/lib/categoryLabels";

export function ProblemsPreview() {
  const { categories, loading, error } = useCategories();
  const sorted = sortCategories(categories);

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
              The Library
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              <span className="text-gradient-green">Green Book</span> topics
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="hidden text-sm text-gradient-green underline-offset-4 hover:underline md:inline"
          >
            See all
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-[var(--color-fg-muted)]">
            Loading topics...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            Could not load topics. Is the backend running on :4000?
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((c, i) => (
            <CategoryCard
              key={c.category}
              category={c.category}
              count={c.count}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
