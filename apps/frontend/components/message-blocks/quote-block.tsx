import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { QuoteBlock } from "@/lib/message-blocks";

interface QuoteBlockProps {
  block: QuoteBlock;
  className?: string;
}

export function QuoteBlock({ block, className }: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        "border-l-4 border-primary/60 pl-4 py-3 mb-0",
        "bg-muted/30 rounded-r-lg",
        "text-foreground/90 leading-[1.7]",
        "not-italic",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <span>{children}</span>,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-[#f6f6f6] dark:bg-[#2d2d30] text-[#d73a49] dark:text-[#f97583] text-sm font-mono font-medium border border-[#e1e4e8] dark:border-[#3e3e42]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {block.text}
      </ReactMarkdown>
    </blockquote>
  );
}

