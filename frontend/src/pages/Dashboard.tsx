import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useCategories } from "@/hooks/useCategories";
import { categoryLabel, sortCategories } from "@/lib/categoryLabels";

export default function Dashboard() {
  const { categories, loading, error } = useCategories();
  const sorted = sortCategories(categories);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Dashboard
          </span>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight">
            All Green Book problems
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Click a problem to open a conversation with the assistant.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-[var(--color-fg-muted)]">Loading...</p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            Could not reach backend. Start it on :4000.
          </p>
        )}

        <div className="flex flex-col gap-14">
          {sorted.map((c) => (
            <section key={c.category} id={c.category}>
              <div className="mb-4 flex items-baseline justify-between border-b border-[var(--color-border)] pb-2">
                <h2 className="font-display text-2xl font-semibold">
                  {categoryLabel(c.category)}
                </h2>
                <span className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {c.count} problems
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {c.problems.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                  >
                    <Link
                      to={`/chat/${p.id}`}
                      className="flex h-full flex-col justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-4 transition-colors hover:border-[var(--color-green)]"
                    >
                      <span className="font-display text-base font-medium text-[var(--color-fg)]">
                        {p.title || `Problem ${p.id}`}
                      </span>
                      {p.subcategory && (
                        <span className="mt-2 text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                          {p.subcategory}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
