import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface Props {
  text: string;
}

export function MarkdownMessage({ text }: Props) {
  return (
    <div className="prose-message text-sm leading-relaxed text-[var(--color-fg)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-green)] underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const inline = !className?.includes("language-");
            if (inline) {
              return (
                <code className="rounded bg-[var(--color-panel-2)] px-1 py-[1px] text-[0.85em]">
                  {children}
                </code>
              );
            }
            return (
              <code className="block rounded bg-[var(--color-panel-2)] p-3 text-[0.85em]">
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
