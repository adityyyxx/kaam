"use client";

import React from "react";
import { DividerBlock } from "@/lib/notes-schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DividerBlockProps {
  block: DividerBlock;
  index: number;
}

export function DividerBlockComponent({ block, index }: DividerBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="my-8"
    >
      <div className="h-px bg-border w-full" />
    </motion.div>
  );
}

