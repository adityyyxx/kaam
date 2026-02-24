"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CodeBlock } from "@/lib/message-blocks";

interface CodeBlockProps {
  block: CodeBlock;
  className?: string;
}

export function CodeBlockComponent({ block, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // Detect if content is JSON
  const isJSON = block.language === "json" || 
    (block.language === undefined && block.code.trim().startsWith("{") && block.code.trim().endsWith("}"));

  return (
    <div
      className={cn(
        "relative mb-0 rounded-lg overflow-hidden",
        "bg-[#1e1e1e] dark:bg-[#0d0d0d]",
        "border border-border/30 dark:border-border/20",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {(block.language || isJSON) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] dark:bg-[#1a1a1a] border-b border-border/20">
          <span className="text-xs font-medium text-[#858585] dark:text-[#858585] uppercase tracking-wide">
            {block.language || (isJSON ? "json" : "code")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#858585] hover:text-foreground hover:bg-[#2d2d30] dark:hover:bg-[#2d2d30] transition-colors"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}
      <div className="relative group">
        {!block.language && !isJSON && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#858585] hover:text-foreground hover:bg-[#2d2d30] dark:hover:bg-[#2d2d30] transition-colors"
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
        <pre className="p-4 overflow-x-auto m-0">
          <code className={cn(
            "text-sm font-mono leading-relaxed whitespace-pre",
            "text-[#d4d4d4] dark:text-[#d4d4d4]",
            isJSON && "text-[#ce9178] dark:text-[#ce9178]" // Slightly warmer color for JSON
          )}>
            {block.code}
          </code>
        </pre>
      </div>
    </div>
  );
}

