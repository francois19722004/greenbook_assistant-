import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ProblemsPreview } from "@/components/ProblemsPreview";
import { TryItOut } from "@/components/TryItOut";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Navbar />
      <main>
        <Hero />
        <ProblemsPreview />
        <TryItOut />
        <footer className="border-t border-[var(--color-border)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 text-xs text-[var(--color-fg-muted)]">
            <span>Greenbook Assistant</span>
            <span>Built for aspiring quants.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
