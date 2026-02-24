import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { OrderedListBlock } from "@/lib/message-blocks";

interface OrderedListBlockProps {
  block: OrderedListBlock;
  className?: string;
}

export function OrderedListBlock({ block, className }: OrderedListBlockProps) {
  return (
    <ol
      className={cn(
        "list-decimal list-outside ml-6 mb-0 space-y-2.5 leading-[1.75]",
        className
      )}
    >
      {block.items.map((item, index) => (
        <li key={index} className="pl-2.5 text-foreground break-words">
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
            {item}
          </ReactMarkdown>
        </li>
      ))}
    </ol>
  );
}

