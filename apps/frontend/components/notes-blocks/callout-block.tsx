"use client";

import React from "react";
import { CalloutBlock } from "@/lib/notes-schema";
import { Typography } from "@/components/ui/typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface CalloutBlockProps {
  block: CalloutBlock;
}

export function CalloutBlockComponent({ block }: CalloutBlockProps) {
  return (
    <div className={cn(
      "rounded-lg border-l-4 bg-muted/50 p-4 my-4",
      "border-blue-500 dark:border-blue-400",
      "animate-in fade-in slide-in-from-bottom-2 duration-300"
    )}>
      <div className="flex gap-3">
        <span className="text-xl shrink-0 mt-0.5">{block.icon}</span>
        <Typography 
          variant="p" 
          as="div"
          className="flex-1 text-sm leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_a]:text-primary [&_a]:underline [&_p]:mb-2 last:[&_p]:mb-0 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
        </Typography>
      </div>
    </div>
  );
}

