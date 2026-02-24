/**
 * Block-level message structure for rendering chat messages
 * Each block represents a semantic unit of content
 */

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface OrderedListBlock {
  type: "ordered-list";
  items: string[];
}

export interface UnorderedListBlock {
  type: "unordered-list";
  items: string[];
}

export interface CodeBlock {
  type: "code";
  language?: string;
  code: string;
}

export interface InlineCodeBlock {
  type: "inline-code";
  code: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface QuoteBlock {
  type: "quote";
  text: string;
}

export interface DividerBlock {
  type: "divider";
}

export type MessageBlock =
  | ParagraphBlock
  | HeadingBlock
  | OrderedListBlock
  | UnorderedListBlock
  | CodeBlock
  | InlineCodeBlock
  | TableBlock
  | QuoteBlock
  | DividerBlock;

export type MessageBlocks = MessageBlock[];




