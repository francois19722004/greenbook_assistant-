import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { motion } from "framer-motion";
import { ChevronLeft, Lightbulb, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Thread } from "@/components/assistant-ui/Thread";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Navbar } from "@/components/Navbar";
import { SummaryModal } from "@/components/SummaryModal";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/useProblem";
import {
  chatEndpoint,
  endConversation,
  newSessionId,
} from "@/lib/api";
import { categoryLabel } from "@/lib/categoryLabels";
import { cn } from "@/lib/utils";

type Tab = "question" | "solution";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { problem, loading, error } = useProblem(id);

  const sessionId = useMemo(() => newSessionId(), [id]);

  const runtime = useChatRuntime({
    api: chatEndpoint(),
    body: { sessionId, problemId: id },
  });

  const [tab, setTab] = useState<Tab>("question");
  const [showHint, setShowHint] = useState(false);
  const [hintConfirm, setHintConfirm] = useState(false);
  const [solutionConfirm, setSolutionConfirm] = useState(false);

  const [endConfirm, setEndConfirm] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  function requestSolution() {
    if (tab === "solution") {
      setTab("question");
      return;
    }
    setSolutionConfirm(true);
  }

  function requestHint() {
    if (showHint) {
      setShowHint(false);
      return;
    }
    setHintConfirm(true);
  }

  async function runEndConversation() {
    setSummaryOpen(true);
    setSummaryLoading(true);
    setSummary(null);
    setSummaryError(null);
    try {
      const text = await endConversation(sessionId);
      setSummary(text);
    } catch (e) {
      setSummaryError((e as Error).message);
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Navbar />
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_1.2fr]">
        <aside className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          {loading && (
            <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
              Loading problem...
            </p>
          )}
          {error && (
            <p className="mt-6 text-sm text-red-400">Failed to load problem.</p>
          )}

          {problem && (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex flex-1 flex-col"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {categoryLabel(problem.category)}
                {problem.subcategory ? " / " + problem.subcategory : ""}
              </span>
              <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
                {problem.title || `Problem ${problem.id}`}
              </h1>

              <div className="mt-5 inline-flex w-fit rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
                <TabButton active={tab === "question"} onClick={() => setTab("question")}>
                  Question
                </TabButton>
                <TabButton active={tab === "solution"} onClick={requestSolution}>
                  Solution
                </TabButton>
              </div>

              <div className="mt-5 flex-1 overflow-y-auto whitespace-pre-wrap rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm leading-relaxed text-[var(--color-fg)]">
                {tab === "question" ? problem.problemText : problem.solutionText}
              </div>

              {tab === "question" && (
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant={showHint ? "subtle" : "outline"}
                    size="sm"
                    onClick={requestHint}
                    className="w-fit"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {showHint ? "Hide hint" : "Show hint"}
                  </Button>
                  {showHint && problem.hintText && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-md border border-[var(--color-green)] bg-[var(--color-green-soft)] p-3 text-sm leading-relaxed text-[var(--color-fg)]"
                    >
                      {problem.hintText}
                    </motion.div>
                  )}
                  {showHint && !problem.hintText && (
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      No hint is available for this problem.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </aside>

        <section className="flex min-h-[70vh] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
              Conversation
            </span>
            <Button variant="danger" size="sm" onClick={() => setEndConfirm(true)}>
              <Square className="h-3 w-3" />
              End and summarize
            </Button>
          </div>
          <div className="flex-1">
            <AssistantRuntimeProvider runtime={runtime}>
              <Thread />
            </AssistantRuntimeProvider>
          </div>
        </section>
      </main>

      <ConfirmDialog
        open={solutionConfirm}
        onOpenChange={setSolutionConfirm}
        title="Show the full solution?"
        description="You will not be able to unsee it. We recommend trying with a hint first."
        confirmLabel="Yes, show the solution"
        onConfirm={() => setTab("solution")}
      />

      <ConfirmDialog
        open={hintConfirm}
        onOpenChange={setHintConfirm}
        title="Reveal the hint?"
        description="A hint nudges you in the right direction without giving the full answer."
        confirmLabel="Yes, show the hint"
        onConfirm={() => setShowHint(true)}
      />

      <ConfirmDialog
        open={endConfirm}
        onOpenChange={setEndConfirm}
        title="End the conversation?"
        description="The assistant will produce a precise summary of where you got stuck. The conversation will be closed."
        confirmLabel="End and summarize"
        onConfirm={runEndConversation}
      />

      <SummaryModal
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        loading={summaryLoading}
        summary={summary}
        error={summaryError}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
        active
          ? "bg-[var(--color-green)] text-[var(--color-bg)]"
          : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      )}
    >
      {children}
    </button>
  );
}