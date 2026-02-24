import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { HeadingBlock } from "@/lib/message-blocks";

interface HeadingBlockProps {
  block: HeadingBlock;
  className?: string;
}

const headingStyles = {
  1: "text-3xl font-bold mb-2 mt-6 first:mt-0 tracking-tight",
  2: "text-2xl font-semibold mb-2 mt-5 first:mt-0 tracking-tight",
  3: "text-xl font-semibold mb-2 mt-4 first:mt-0 tracking-tight",
  4: "text-lg font-semibold mb-1.5 mt-3 first:mt-0",
  5: "text-base font-semibold mb-1.5 mt-3 first:mt-0",
  6: "text-sm font-semibold mb-1 mt-2 first:mt-0",
};

export function HeadingBlock({ block, className }: HeadingBlockProps) {
  const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        "leading-[1.3] text-foreground",
        headingStyles[block.level],
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <>{children}</>,
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
    </Tag>
  );
}

