import { cn } from "@/lib/utils";
import type { InlineCodeBlock } from "@/lib/message-blocks";

interface InlineCodeBlockProps {
  block: InlineCodeBlock;
  className?: string;
}

export function InlineCodeBlock({
  block,
  className,
}: InlineCodeBlockProps) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded-md bg-[#f6f6f6] dark:bg-[#2d2d30] text-[#d73a49] dark:text-[#f97583] text-sm font-mono font-medium border border-[#e1e4e8] dark:border-[#3e3e42]",
        "transition-colors duration-150",
        className
      )}
    >
      {block.code}
    </code>
  );
}

