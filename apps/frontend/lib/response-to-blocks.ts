import type { MessageBlocks } from "./message-blocks";
import { parseJsonResponse } from "./json-to-blocks";
import { markdownToBlocks } from "./markdown-to-blocks";

/**
 * Unified response parser that tries JSON parsing first, then falls back to markdown
 * This handles both structured JSON responses (notion_page format) and markdown responses
 */
export function responseToBlocks(response: string): MessageBlocks {
  if (!response || typeof response !== "string") {
    return [];
  }

  // First, try to parse as JSON (notion_page format)
  const jsonBlocks = parseJsonResponse(response);
  if (jsonBlocks) {
    return jsonBlocks;
  }

  // Fall back to markdown parsing
  return markdownToBlocks(response);
}

