import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  summary: string | null;
  error: string | null;
}

export function SummaryModal({
  open,
  onOpenChange,
  loading,
  summary,
  error,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session summary</DialogTitle>
          <DialogDescription>
            A precise breakdown of where you got stuck on this problem.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center gap-2 py-8 text-sm text-[var(--color-fg-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating summary...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {summary && (
          <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm leading-relaxed">
            {summary}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Close
          </Button>
          <Button onClick={copy} disabled={!summary || loading}>
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy summary
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
