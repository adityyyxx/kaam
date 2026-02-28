import type { MessageBlocks } from "./message-blocks";
import type { NotesBlock, NotionPage } from "./notes-schema";
import {
  isValidNotionPage,
  isCalloutBlock,
  isHeadingBlock,
  isBulletsBlock,
  isCodeBlock,
  isTableBlock,
  isDividerBlock,
} from "./notes-schema";

/**
 * Checks if a string looks like valid JSON (notion_page format)
 */
function looksLikeNotionPageJson(jsonString: string): boolean {
  if (!jsonString || typeof jsonString !== "string") {
    return false;
  }
  const hasTypePattern = /\"type\"\s*:\s*\"notion_page\"/.test(jsonString);
  if (!hasTypePattern) return false;
  const hasBlocksPattern = /\"blocks\"\s*:\s*\[/.test(jsonString);
  if (!hasBlocksPattern) return false;
  return true;
}

/**
 * Extracts the JSON string from a response that may be:
 * - Wrapped in ```json ... ``` fences
 * - Wrapped in ``` ... ``` fences
 * - A raw JSON object starting with {
 * 
 * Enhanced to be streaming-safe and handle all AI output patterns.
 */
function extractJsonFromResponse(response: string): string | null {
  if (!response || typeof response !== "string") {
    return null;
  }

  // 1. Try ```json ... ``` fences
  const jsonCodeBlockMatch = response.match(/```json\s*([\s\S]*?)```/);
  if (jsonCodeBlockMatch) {
    const content = jsonCodeBlockMatch[1].trim();
    if (looksLikeNotionPageJson(content)) {
      return content;
    }
  }

  // 2. Try ``` ... ``` fences (without language specifier)
  const codeBlockMatch = response.match(/```\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    const content = codeBlockMatch[1].trim();
    if (content.startsWith("{") && looksLikeNotionPageJson(content)) {
      return content;
    }
  }

  // 3. Try raw JSON — find the largest balanced {...} block in the response.
  //    This is the primary path since the new prompt always returns raw JSON.
  const rawJson = extractBalancedJson(response);
  if (rawJson && looksLikeNotionPageJson(rawJson)) {
    return rawJson;
  }

  return null;
}

/**
 * Extracts a balanced JSON object from a string by tracking brace depth.
 * More robust than a simple regex for multi-line JSON.
 */
function extractBalancedJson(text: string): string | null {
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === "\\") {
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        return text.substring(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Checks if JSON string is complete (balanced braces/brackets).
 * Prevents parsing incomplete JSON during streaming.
 */
function isJsonComplete(jsonString: string): boolean {
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") braceCount++;
      else if (char === "}") braceCount--;
      else if (char === "[") bracketCount++;
      else if (char === "]") bracketCount--;
    }
  }

  return braceCount === 0 && bracketCount === 0 && !inString;
}

/**
 * Converts a NotesBlock to a MessageBlock
 */
function convertNotesBlockToMessageBlock(block: NotesBlock): MessageBlocks[0] | null {
  if (isCalloutBlock(block)) {
    return {
      type: "callout",
      icon: block.icon,
      text: block.content,
    };
  }

  if (isHeadingBlock(block)) {
    return {
      type: "heading",
      level: block.level,
      text: block.content,
    };
  }

  if (isBulletsBlock(block)) {
    return {
      type: "unordered-list",
      items: block.items,
    };
  }

  if (isCodeBlock(block)) {
    return {
      type: "code",
      language: block.language || undefined,
      code: block.content,
    };
  }

  if (isTableBlock(block)) {
    return {
      type: "table",
      headers: block.headers,
      rows: block.rows,
    };
  }

  if (isDividerBlock(block)) {
    return {
      type: "divider",
    };
  }

  return null;
}

/**
 * Parses a JSON response and converts it to MessageBlocks format.
 * Returns null if the response is not valid JSON or not a notion_page format.
 * Streaming-safe: returns null for incomplete JSON instead of throwing.
 */
export function parseJsonResponse(response: string): MessageBlocks | null {
  try {
    const jsonString = extractJsonFromResponse(response);
    if (!jsonString) {
      return null;
    }

    // Check if JSON is complete (important during streaming)
    if (!isJsonComplete(jsonString)) {
      return null;
    }

    const parsed = JSON.parse(jsonString);

    if (!isValidNotionPage(parsed)) {
      return null;
    }

    const notionPage = parsed as NotionPage;

    const messageBlocks: MessageBlocks = [];

    // Add title as a level-1 heading
    if (notionPage.title) {
      messageBlocks.push({
        type: "heading",
        level: 1,
        text: notionPage.title,
      });
    }

    // Convert each content block
    for (const block of notionPage.blocks) {
      const converted = convertNotesBlockToMessageBlock(block);
      if (converted) {
        messageBlocks.push(converted);
      }
    }

    return messageBlocks.length > 0 ? messageBlocks : null;
  } catch {
    return null;
  }
}
