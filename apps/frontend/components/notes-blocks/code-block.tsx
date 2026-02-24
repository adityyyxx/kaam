"use client";

import React, { useState } from "react";
import { CodeBlock } from "@/lib/notes-schema";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CodeBlockProps {
  block: CodeBlock;
  index: number;
}

export function CodeBlockComponent({ block, index }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.content);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="my-4 relative group"
    >
      <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {block.language || "text"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <div className="overflow-x-auto p-4 bg-slate-950 dark:bg-zinc-900">
          <pre className="text-sm font-mono text-slate-100">
            <code className={cn(`language-${block.language || "text"}`)}>
              {block.content}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

