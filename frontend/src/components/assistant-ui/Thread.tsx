import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { SendHorizonal } from "lucide-react";
import { MarkdownMessage } from "./MarkdownMessage";
import { cn } from "@/lib/utils";

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-6 py-6">
        <ThreadPrimitive.Empty>
          <div className="mx-auto max-w-prose text-center text-[var(--color-fg-muted)]">
            <p className="font-display text-lg text-[var(--color-fg)]">
              Ask anything about this problem.
            </p>
            <p className="mt-2 text-sm">
              The tutor will guide you. It will not just hand you the answer.
            </p>
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{ UserMessage, AssistantMessage }}
        />

        <ThreadPrimitive.If running>
          <TypingIndicator />
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>

      <Composer />
    </ThreadPrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-3xl justify-end py-3">
      <div className="max-w-[75%] rounded-lg bg-gradient-green px-4 py-2 text-[var(--color-bg)] shadow-[0_8px_24px_-12px_rgba(34,224,122,0.5)]">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-3xl py-3">
      <div className="max-w-[85%] rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-[var(--color-fg)]">
        <MessagePrimitive.Content
          components={{
            Text: ({ text }) => <MarkdownMessage text={text} />,
          }}
        />
      </div>
    </MessagePrimitive.Root>
  );
}

function TypingIndicator() {
  return (
    <div className="mx-auto flex w-full max-w-3xl py-3">
      <div
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3"
        aria-label="Assistant is typing"
      >
        <span className="dot" />
        <span className="dot dot-2" />
        <span className="dot dot-3" />
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <ComposerPrimitive.Root
        className={cn(
          "mx-auto flex w-full max-w-3xl items-end gap-2 px-6 py-4"
        )}
      >
        <ComposerPrimitive.Input
          rows={1}
          autoFocus
          placeholder="Ask a question about the problem..."
          className="flex-1 resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-dim)] focus:border-[var(--color-green)]"
        />
        <ComposerPrimitive.Send asChild>
          <button
            type="submit"
            aria-label="Send message"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-green px-3 text-[var(--color-bg)] shadow-[0_8px_20px_-10px_rgba(34,224,122,0.55)] hover:brightness-110"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </div>
  );
}
