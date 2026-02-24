import { NotionPage, isValidNotionPage } from "./notes-schema";

// Enable debug logging in development
const DEBUG = process.env.NODE_ENV === "development";

interface ParseError {
  step: string;
  error: unknown;
  details?: string;
}

/**
 * Attempts to parse a NotionPage from an AI response string
 * Looks for JSON in code blocks or standalone JSON
 * Enhanced with better error handling and validation
 */
export function parseNotesFromResponse(content: string): NotionPage | null {
  if (!content || typeof content !== "string") {
    if (DEBUG) {
      console.debug("[NotesParser] Invalid input: content is not a string or is empty");
    }
    return null;
  }

  if (DEBUG) {
    console.debug("[NotesParser] Attempting to parse notes from response, length:", content.length);
  }

  const errors: ParseError[] = [];

  // Try to find JSON in ```json code blocks (most common format)
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/i;
  const jsonBlockMatch = content.match(jsonBlockRegex);
  
  if (jsonBlockMatch) {
    try {
      const jsonStr = jsonBlockMatch[1].trim();
      if (DEBUG) {
        console.debug("[NotesParser] Found JSON code block, length:", jsonStr.length);
      }
      
      if (!jsonStr) {
        errors.push({ step: "json_code_block", error: "Empty JSON string", details: "JSON code block found but content is empty" });
        if (DEBUG) {
          console.debug("[NotesParser] Empty JSON string in code block");
        }
      } else {
        const parsed = JSON.parse(jsonStr);
        if (isValidNotionPage(parsed)) {
          if (DEBUG) {
            console.debug("[NotesParser] Successfully parsed valid NotionPage from JSON code block");
          }
          return parsed;
        } else {
          errors.push({ 
            step: "json_code_block_validation", 
            error: "Validation failed", 
            details: "Parsed JSON does not match NotionPage schema" 
          });
          if (DEBUG) {
            console.debug("[NotesParser] Parsed JSON but validation failed");
          }
        }
      }
    } catch (error) {
      errors.push({ 
        step: "json_code_block_parse", 
        error, 
        details: error instanceof Error ? error.message : String(error) 
      });
      if (DEBUG) {
        console.debug("[NotesParser] Failed to parse JSON from code block:", error);
      }
    }
  }

  // Try to find JSON in ``` code blocks (without json label)
  const genericCodeBlockRegex = /```\s*([\s\S]*?)\s*```/;
  const codeBlockMatches = content.matchAll(new RegExp(genericCodeBlockRegex, 'g'));
  
  for (const match of codeBlockMatches) {
    try {
      const codeContent = match[1].trim();
      // Skip if it looks like code (has syntax that's not JSON)
      if (codeContent.startsWith('{') && codeContent.includes('"type"')) {
        const parsed = JSON.parse(codeContent);
        if (isValidNotionPage(parsed)) {
          if (DEBUG) {
            console.debug("[NotesParser] Successfully parsed valid NotionPage from generic code block");
          }
          return parsed;
        } else {
          errors.push({ 
            step: "generic_code_block_validation", 
            error: "Validation failed", 
            details: "Parsed JSON does not match NotionPage schema" 
          });
        }
      }
    } catch (error) {
      // Not JSON, continue - don't log as error since this is expected for non-JSON code blocks
      if (DEBUG && error instanceof Error && error.message.includes("JSON")) {
        // Only log actual JSON parse errors
      }
    }
  }

  // Try to find standalone JSON object with balanced braces
  // This is more robust - finds the first { and matches to the last }
  let braceCount = 0;
  let startIndex = -1;
  let endIndex = -1;
  
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
      if (startIndex === -1) startIndex = i;
      braceCount++;
    } else if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (startIndex !== -1 && endIndex !== -1) {
    try {
      const jsonStr = content.substring(startIndex, endIndex + 1);
      // Only try if it looks like our schema
      if (jsonStr.includes('"type"') && jsonStr.includes('"notion_page"')) {
        const parsed = JSON.parse(jsonStr);
        if (isValidNotionPage(parsed)) {
          if (DEBUG) {
            console.debug("[NotesParser] Successfully parsed valid NotionPage from balanced braces");
          }
          return parsed;
        } else {
          errors.push({ 
            step: "balanced_braces_validation", 
            error: "Validation failed", 
            details: "Parsed JSON does not match NotionPage schema" 
          });
        }
      }
    } catch (error) {
      errors.push({ 
        step: "balanced_braces_parse", 
        error, 
        details: error instanceof Error ? error.message : String(error) 
      });
      if (DEBUG) {
        console.debug("[NotesParser] Failed to parse JSON from balanced braces:", error);
      }
    }
  }

  // Try parsing the entire content as JSON (in case response is pure JSON)
  try {
    const trimmed = content.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (isValidNotionPage(parsed)) {
        if (DEBUG) {
          console.debug("[NotesParser] Successfully parsed valid NotionPage from entire content");
        }
        return parsed;
      } else {
        errors.push({ 
          step: "full_content_validation", 
          error: "Validation failed", 
          details: "Parsed JSON does not match NotionPage schema" 
        });
      }
    }
  } catch (error) {
    errors.push({ 
      step: "full_content_parse", 
      error, 
      details: error instanceof Error ? error.message : String(error) 
    });
  }

  if (DEBUG) {
    console.debug("[NotesParser] Could not parse notes from response");
    if (errors.length > 0) {
      console.debug("[NotesParser] Errors encountered:", errors);
    }
  }

  return null;
}

