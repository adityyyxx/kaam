import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ParagraphBlock } from "@/lib/message-blocks";

interface ParagraphBlockProps {
  block: ParagraphBlock;
  className?: string;
}

export function ParagraphBlock({ block, className }: ParagraphBlockProps) {
  return (
    <div
      className={cn(
        "leading-[1.75] text-foreground mb-0 break-words",
        "[&_p]:my-0 [&_p]:leading-[1.75]",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic [&_em]:text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80",
        "[&_del]:line-through [&_del]:text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {children}
            </a>
          ),
          del: ({ children }) => <del className="line-through text-muted-foreground">{children}</del>,
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
    </div>
  );
}

