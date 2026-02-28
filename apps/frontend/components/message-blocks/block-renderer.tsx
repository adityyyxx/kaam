"use client";

import { motion } from "framer-motion";
import type { MessageBlocks } from "@/lib/message-blocks";
import { ParagraphBlock } from "./paragraph-block";
import { HeadingBlock } from "./heading-block";
import { OrderedListBlock } from "./ordered-list-block";
import { UnorderedListBlock } from "./unordered-list-block";
import { CodeBlockComponent } from "./code-block";
import { InlineCodeBlock } from "./inline-code-block";
import { TableBlockComponent } from "./table-block";
import { QuoteBlock } from "./quote-block";
import { DividerBlock } from "./divider-block";
import { CalloutBlockComponent } from "./callout-block";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  blocks: MessageBlocks;
  className?: string;
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full leading-[1.75] text-foreground",
        className
      )}
    >
      {blocks.map((block, index) => {
        const isCompactBlock = block.type === "divider" || block.type === "inline-code";
        const spacing = isCompactBlock ? "mb-2" : "mb-4 last:mb-0";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: index * 0.02,
              ease: "easeOut"
            }}
            className={cn(spacing)}
          >
            {(() => {
              switch (block.type) {
                case "paragraph":
                  return <ParagraphBlock block={block} />;
                case "heading":
                  return <HeadingBlock block={block} />;
                case "ordered-list":
                  return <OrderedListBlock block={block} />;
                case "unordered-list":
                  return <UnorderedListBlock block={block} />;
                case "code":
                  return <CodeBlockComponent block={block} />;
                case "inline-code":
                  return <InlineCodeBlock block={block} />;
                case "table":
                  return <TableBlockComponent block={block} />;
                case "quote":
                  return <QuoteBlock block={block} />;
                case "callout":
                  return <CalloutBlockComponent block={block} />;
                case "divider":
                  return <DividerBlock block={block} />;
                default:
                  // Fallback for unknown block types
                  return (
                    <div className="text-muted-foreground text-sm">
                      Unknown block type: {(block as { type: string }).type}
                    </div>
                  );
              }
            })()}
          </motion.div>
        );
      })}
    </div>
  );
}

