"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { CalloutBlock } from "@/lib/message-blocks";

interface CalloutBlockProps {
    block: CalloutBlock;
    className?: string;
}

export function CalloutBlockComponent({ block, className }: CalloutBlockProps) {
    return (
        <div
            className={cn(
                "flex gap-3 rounded-xl px-4 py-3.5",
                "bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/25",
                "shadow-sm",
                className
            )}
        >
            {/* Icon */}
            <span className="mt-0.5 text-lg shrink-0 select-none" aria-hidden>
                {block.icon}
            </span>

            {/* Content */}
            <div
                className={cn(
                    "leading-[1.75] text-foreground text-sm break-words min-w-0 flex-1",
                    "[&_p]:my-0 [&_p]:leading-[1.75]",
                    "[&_strong]:font-semibold [&_strong]:text-foreground",
                    "[&_em]:italic [&_em]:text-foreground/80",
                    "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80",
                )}
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}
