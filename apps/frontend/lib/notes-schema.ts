// TypeScript types for Notion-style notes based on output.ts schema

export interface CalloutBlock {
  type: "callout";
  icon: string;
  content: string;
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface BulletsBlock {
  type: "bullets";
  items: string[];
}

export interface CodeBlock {
  type: "code";
  language: string;
  content: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface DividerBlock {
  type: "divider";
}

export type NotesBlock =
  | CalloutBlock
  | HeadingBlock
  | BulletsBlock
  | CodeBlock
  | TableBlock
  | DividerBlock;

export interface NotionPage {
  type: "notion_page";
  title: string;
  blocks: NotesBlock[];
}

// Type guards
export function isCalloutBlock(block: NotesBlock): block is CalloutBlock {
  return block.type === "callout";
}

export function isHeadingBlock(block: NotesBlock): block is HeadingBlock {
  return block.type === "heading";
}

export function isBulletsBlock(block: NotesBlock): block is BulletsBlock {
  return block.type === "bullets";
}

export function isCodeBlock(block: NotesBlock): block is CodeBlock {
  return block.type === "code";
}

export function isTableBlock(block: NotesBlock): block is TableBlock {
  return block.type === "table";
}

export function isDividerBlock(block: NotesBlock): block is DividerBlock {
  return block.type === "divider";
}

// Validation function
export function isValidNotionPage(data: any): data is NotionPage {
  if (!data || typeof data !== "object") return false;
  if (data.type !== "notion_page") return false;
  if (typeof data.title !== "string") return false;
  if (!Array.isArray(data.blocks)) return false;

  // Validate each block
  for (const block of data.blocks) {
    if (!block || typeof block !== "object" || !block.type) return false;

    switch (block.type) {
      case "callout":
        if (typeof block.icon !== "string" || typeof block.content !== "string")
          return false;
        break;
      case "heading":
        if (
          !Number.isInteger(block.level) ||
          block.level < 1 ||
          block.level > 6 ||
          typeof block.content !== "string"
        )
          return false;
        break;
      case "bullets":
        if (!Array.isArray(block.items) || !block.items.every((item: any) => typeof item === "string"))
          return false;
        break;
      case "code":
        if (typeof block.language !== "string" || typeof block.content !== "string")
          return false;
        break;
      case "table":
        if (
          !Array.isArray(block.headers) ||
          !block.headers.every((h: any) => typeof h === "string") ||
          !Array.isArray(block.rows) ||
          !block.rows.every((row: any) => Array.isArray(row) && row.every((cell: any) => typeof cell === "string"))
        )
          return false;
        break;
      case "divider":
        // No additional fields to validate
        break;
      default:
        return false;
    }
  }

  return true;
}










