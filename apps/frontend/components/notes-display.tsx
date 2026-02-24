"use client";

import React, { useState } from "react";
import { NotionPage } from "@/lib/notes-schema";
import { Typography } from "@/components/ui/typography";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  CalloutBlockComponent,
  HeadingBlockComponent,
  BulletsBlockComponent,
  CodeBlockComponent,
  TableBlockComponent,
  DividerBlockComponent,
} from "./notes-blocks";
import {
  isCalloutBlock,
  isHeadingBlock,
  isBulletsBlock,
  isCodeBlock,
  isTableBlock,
  isDividerBlock,
} from "@/lib/notes-schema";

interface NotesDisplayProps {
  notes: NotionPage;
  className?: string;
}

export function NotesDisplay({ notes, className }: NotesDisplayProps) {
  const [copied, setCopied] = useState(false);

  const convertToMarkdown = (): string => {
    let markdown = `# ${notes.title}\n\n`;

    for (const block of notes.blocks) {
      if (isCalloutBlock(block)) {
        markdown += `${block.icon} ${block.content}\n\n`;
      } else if (isHeadingBlock(block)) {
        const hashes = "#".repeat(block.level);
        markdown += `${hashes} ${block.content}\n\n`;
      } else if (isBulletsBlock(block)) {
        block.items.forEach((item) => {
          markdown += `- ${item}\n`;
        });
        markdown += "\n";
      } else if (isCodeBlock(block)) {
        markdown += `\`\`\`${block.language}\n${block.content}\n\`\`\`\n\n`;
      } else if (isTableBlock(block)) {
        markdown += `| ${block.headers.join(" | ")} |\n`;
        markdown += `| ${block.headers.map(() => "---").join(" | ")} |\n`;
        block.rows.forEach((row) => {
          markdown += `| ${row.join(" | ")} |\n`;
        });
        markdown += "\n";
      } else if (isDividerBlock(block)) {
        markdown += "---\n\n";
      }
    }

    return markdown;
  };

  const handleCopy = async () => {
    try {
      const markdown = convertToMarkdown();
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("Notes copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy notes");
    }
  };

  const handleDownload = async (format: "md" | "json") => {
    try {
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === "md") {
        content = convertToMarkdown();
        mimeType = "text/markdown";
        extension = "md";
      } else {
        content = JSON.stringify(notes, null, 2);
        mimeType = "application/json";
        extension = "json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${notes.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-notes.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded as ${extension.toUpperCase()}`);
    } catch {
      toast.error("Failed to download notes");
    }
  };

  const renderBlock = (block: NotionPage["blocks"][0], index: number) => {
    if (isCalloutBlock(block)) {
      return <CalloutBlockComponent key={index} block={block} />;
    }
    if (isHeadingBlock(block)) {
      return <HeadingBlockComponent key={index} block={block} index={index} />;
    }
    if (isBulletsBlock(block)) {
      return <BulletsBlockComponent key={index} block={block} index={index} />;
    }
    if (isCodeBlock(block)) {
      return <CodeBlockComponent key={index} block={block} index={index} />;
    }
    if (isTableBlock(block)) {
      return <TableBlockComponent key={index} block={block} index={index} />;
    }
    if (isDividerBlock(block)) {
      return <DividerBlockComponent key={index} block={block} index={index} />;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("relative group", className)}
    >
      <Card className="relative shadow-lg border-border/50 overflow-hidden">
        {/* Action Bar - Compact, modern, sticky header */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-end gap-2 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key="actions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 px-3 text-xs font-medium hover:bg-accent/50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1.5 px-3 text-xs font-medium hover:bg-accent/50 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleDownload("md")} className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Markdown (.md)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("json")} className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    JSON (.json)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 lg:p-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <Typography variant="h1" className="text-foreground">
              {notes.title}
            </Typography>
          </motion.div>

          {/* Blocks */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {notes.blocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {renderBlock(block, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

