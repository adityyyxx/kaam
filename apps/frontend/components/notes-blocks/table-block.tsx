"use client";

import React from "react";
import { TableBlock } from "@/lib/notes-schema";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TableBlockProps {
  block: TableBlock;
  index: number;
}

export function TableBlockComponent({ block, index }: TableBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="my-6 overflow-x-auto"
    >
      <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-muted/50">
            {block.headers.map((header, headerIndex) => (
              <th
                key={headerIndex}
                className={cn(
                  "px-4 py-3 text-left border-b border-border",
                  headerIndex > 0 && "border-l border-border"
                )}
              >
                <Typography variant="small" as="div" className="font-semibold text-foreground">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{header}</ReactMarkdown>
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 + rowIndex * 0.05 }}
              className={cn(
                "hover:bg-muted/30 transition-colors",
                rowIndex < block.rows.length - 1 && "border-b border-border"
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3",
                    cellIndex > 0 && "border-l border-border"
                  )}
                >
                  <Typography
                    variant="small"
                    as="div"
                    className="text-foreground [&_strong]:font-semibold [&_em]:italic [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cell}</ReactMarkdown>
                  </Typography>
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

