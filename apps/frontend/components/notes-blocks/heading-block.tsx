"use client";

import React from "react";
import { HeadingBlock } from "@/lib/notes-schema";
import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface HeadingBlockProps {
  block: HeadingBlock;
  index: number;
}

// Custom components for ReactMarkdown to render inline content in headings
// Remove paragraph wrapper since we're inside a heading element
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headingMarkdownComponents: any = {
  p: ({ children }: any) => <>{children || null}</>,
  // Disable heading elements since we're already in a heading
  h1: ({ children }: any) => <>{children || null}</>,
  h2: ({ children }: any) => <>{children || null}</>,
  h3: ({ children }: any) => <>{children || null}</>,
  h4: ({ children }: any) => <>{children || null}</>,
  h5: ({ children }: any) => <>{children || null}</>,
  h6: ({ children }: any) => <>{children || null}</>,
};

export function HeadingBlockComponent({ block, index }: HeadingBlockProps) {
  const variant = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mt-6 first:mt-0"
    >
      <Typography
        variant={variant}
        as={variant}
        className="text-foreground"
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={headingMarkdownComponents}
        >
          {block.content}
        </ReactMarkdown>
      </Typography>
    </motion.div>
  );
}

