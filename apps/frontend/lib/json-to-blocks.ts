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
 * More strict check - must have "type": "notion_page" pattern
 */
function looksLikeNotionPageJson(jsonString: string): boolean {
  if (!jsonString || typeof jsonString !== "string") {
    return false;
  }
  
  // Must contain the notion_page type indicator
  // Check for "type" and "notion_page" pattern (allowing for whitespace)
  const hasTypePattern = /"type"\s*:\s*"notion_page"/.test(jsonString);
  if (!hasTypePattern) {
    return false;
  }
  
  // Must have "blocks" array
  const hasBlocksPattern = /"blocks"\s*:\s*\[/.test(jsonString);
  if (!hasBlocksPattern) {
    return false;
  }
  
  return true;
}

/**
 * Extracts JSON from a response string that may be wrapped in code blocks
 * Only extracts if it's clearly a notion_page JSON format
 */
function extractJsonFromResponse(response: string): string | null {
  if (!response || typeof response !== "string") {
    return null;
  }

  // Try to find JSON wrapped in ```json code blocks
  const jsonCodeBlockMatch = response.match(/```json\s*([\s\S]*?)```/);
  if (jsonCodeBlockMatch) {
    const content = jsonCodeBlockMatch[1].trim();
    // Only return if it looks like a notion_page JSON
    if (looksLikeNotionPageJson(content)) {
      return content;
    }
  }

  // Try to find JSON wrapped in ``` code blocks (without language specifier)
  // But only if it's clearly JSON (has notion_page pattern)
  const codeBlockMatch = response.match(/```\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    const content = codeBlockMatch[1].trim();
    // Check if it looks like JSON and specifically notion_page format
    if (content.startsWith("{") && looksLikeNotionPageJson(content)) {
      return content;
    }
  }

  // Only try raw JSON if the entire response is JSON and it's a notion_page
  // This prevents false positives from markdown that might start with {
  const trimmed = response.trim();
  if (trimmed.startsWith("{") && !trimmed.includes("\n") && trimmed.length < 5000) {
    // Only check if it's a single-line JSON (unlikely to be markdown)
    // and it looks like notion_page format
    if (looksLikeNotionPageJson(trimmed)) {
      return trimmed;
    }
  }

  return null;
}

/**
 * Converts a NotesBlock to a MessageBlock
 */
function convertNotesBlockToMessageBlock(block: NotesBlock): MessageBlocks[0] | null {
  if (isCalloutBlock(block)) {
    // Convert callout to paragraph with icon emoji prepended
    return {
      type: "paragraph",
      text: `${block.icon} ${block.content}`,
    };
  }

  if (isHeadingBlock(block)) {
    // Convert heading: map content to text
    return {
      type: "heading",
      level: block.level,
      text: block.content,
    };
  }

  if (isBulletsBlock(block)) {
    // Convert bullets to unordered-list
    return {
      type: "unordered-list",
      items: block.items,
    };
  }

  if (isCodeBlock(block)) {
    // Convert code: map content to code
    return {
      type: "code",
      language: block.language || undefined,
      code: block.content,
    };
  }

  if (isTableBlock(block)) {
    // Convert table: direct mapping
    return {
      type: "table",
      headers: block.headers,
      rows: block.rows,
    };
  }

  if (isDividerBlock(block)) {
    // Convert divider: direct mapping
    return {
      type: "divider",
    };
  }

  return null;
}

/**
 * Checks if JSON string is complete (balanced braces/brackets)
 * This prevents parsing incomplete JSON during streaming
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
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '[') bracketCount++;
      else if (char === ']') bracketCount--;
    }
  }
  
  return braceCount === 0 && bracketCount === 0 && !inString;
}

/**
 * Parses a JSON response and converts it to MessageBlocks format
 * Returns null if the response is not valid JSON or not a notion_page format
 */
export function parseJsonResponse(response: string): MessageBlocks | null {
  try {
    // Extract JSON from the response
    const jsonString = extractJsonFromResponse(response);
    if (!jsonString) {
      return null;
    }

    // Check if JSON is complete (important during streaming)
    if (!isJsonComplete(jsonString)) {
      return null; // Incomplete JSON, fall back to markdown
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonString);

    // Validate it's a notion_page format
    if (!isValidNotionPage(parsed)) {
      return null;
    }

    const notionPage = parsed as NotionPage;

    // Convert NotesBlocks to MessageBlocks
    const messageBlocks: MessageBlocks = [];

    // Optionally add title as a heading block
    if (notionPage.title) {
      messageBlocks.push({
        type: "heading",
        level: 1,
        text: notionPage.title,
      });
    }

    // Convert each block
    for (const block of notionPage.blocks) {
      const converted = convertNotesBlockToMessageBlock(block);
      if (converted) {
        messageBlocks.push(converted);
      }
    }

    return messageBlocks.length > 0 ? messageBlocks : null;
  } catch (error) {
    // If JSON parsing fails, return null to fall back to markdown parsing
    return null;
  }
}

