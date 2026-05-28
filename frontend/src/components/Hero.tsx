import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--color-green)] opacity-[0.06] blur-3xl" />
        <div className="absolute left-[10%] top-[40%] h-[300px] w-[300px] rounded-full bg-[var(--color-blue)] opacity-30 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" />
            Greenbook Assistant
          </span>
          <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-7xl">
            Understand every Green Book problem,
            <span className="text-[var(--color-green)]"> not just the answer.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            Browse the complete set of Green Book problems, ask an assistant to
            walk you through the reasoning, and build the intuitions that matter
            in quant interviews.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <Button asChild size="lg">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#try-it">Try it out</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
