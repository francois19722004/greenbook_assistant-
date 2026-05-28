import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { categoryLabel, sortCategories } from "@/lib/categoryLabels";

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
              Green Book problems, organized.
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="hidden text-sm text-[var(--color-green)] underline-offset-4 hover:underline md:inline"
          >
            See all
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-[var(--color-fg-muted)]">
            Loading problems...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            Could not load problems. Is the backend running on :4000?
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c, i) => (
            <motion.div
              key={c.category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition-colors hover:border-[var(--color-green)]"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {c.count} problems
              </p>
              <h3 className="font-display mt-2 text-xl font-semibold">
                {categoryLabel(c.category)}
              </h3>
              <Link
                to={`/dashboard#${c.category}`}
                className="mt-6 inline-flex text-sm text-[var(--color-green)] underline-offset-4 hover:underline"
              >
                Browse
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
