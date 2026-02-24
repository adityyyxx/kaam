import { cn } from "@/lib/utils";
import type { DividerBlock } from "@/lib/message-blocks";

interface DividerBlockProps {
  block: DividerBlock;
  className?: string;
}

export function DividerBlock({ block: _, className }: DividerBlockProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t border-border/40 my-2",
        className
      )}
    />
  );
}

