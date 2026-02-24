"use client";

import React from "react";
import { BulletsBlock } from "@/lib/notes-schema";
import { Typography } from "@/components/ui/typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BulletsBlockProps {
  block: BulletsBlock;
  index: number;
}

export function BulletsBlockComponent({ block, index }: BulletsBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="my-4"
    >
      <ul className="space-y-2 list-none">
        {block.items.map((item, itemIndex) => (
          <motion.li
            key={itemIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 + itemIndex * 0.03 }}
            className="flex gap-3"
          >
            <span className="text-muted-foreground mt-1 shrink-0">•</span>
            <Typography
              variant="p"
              as="div"
              className="flex-1 text-sm leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_a]:text-primary [&_a]:underline [&_p]:my-0 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
            </Typography>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

