import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { chatEndpoint, newSessionId } from "@/lib/api";
import { Thread } from "@/components/assistant-ui/Thread";

export function TryItOut() {
  const sessionId = useMemo(() => newSessionId(), []);
  const runtime = useChatRuntime({
    api: chatEndpoint(),
    body: { sessionId, problemId: "1" },
  });

  return (
    <section
      id="try-it"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Try It Out
          </span>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Ask about the
            <span className="text-[var(--color-green)]"> Tiger and Sheep </span>
            problem.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            A full preview. The assistant already has the problem loaded. Ask
            for a hint, a proof sketch, or a cleaner argument.
          </p>
        </motion.div>

        <div className="h-[520px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
          </AssistantRuntimeProvider>
        </div>
      </div>
    </section>
  );
}
