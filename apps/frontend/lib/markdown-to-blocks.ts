import type { MessageBlocks } from "./message-blocks";

/**
 * Converts markdown string to structured block-level AST
 * Uses a custom approach with react-markdown's AST
 */
export function markdownToBlocks(markdown: string): MessageBlocks {
  if (!markdown || typeof markdown !== "string") {
    return [];
  }

  try {
    const blocks: MessageBlocks = [];
    const lines = markdown.split("\n");
    let i = 0;
    let inCodeBlock = false;
    let codeBlockLanguage = "";
    let codeBlockContent: string[] = [];
    let inQuote = false;
    let quoteContent: string[] = [];
    let inOrderedList = false;
    let inUnorderedList = false;
    let orderedListItems: string[] = [];
    let unorderedListItems: string[] = [];

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        blocks.push({
          type: "code",
          language: codeBlockLanguage || undefined,
          code: codeBlockContent.join("\n"),
        });
        codeBlockContent = [];
        codeBlockLanguage = "";
      }
    };

    const flushQuote = () => {
      if (quoteContent.length > 0) {
        blocks.push({
          type: "quote",
          text: quoteContent.join("\n").replace(/^>\s*/gm, "").trim(),
        });
        quoteContent = [];
      }
    };

    const flushOrderedList = () => {
      if (orderedListItems.length > 0) {
        blocks.push({
          type: "ordered-list",
          items: orderedListItems,
        });
        orderedListItems = [];
      }
    };

    const flushUnorderedList = () => {
      if (unorderedListItems.length > 0) {
        blocks.push({
          type: "unordered-list",
          items: unorderedListItems,
        });
        unorderedListItems = [];
      }
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushQuote();
          flushOrderedList();
          flushUnorderedList();
          inCodeBlock = true;
          const match = trimmed.match(/^```(\w+)?/);
          codeBlockLanguage = match?.[1] || "";
        }
        i++;
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        i++;
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushQuote();
        flushOrderedList();
        flushUnorderedList();
        const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        blocks.push({
          type: "heading",
          level: level,
          text: headingMatch[2],
        });
        i++;
        continue;
      }

      // Horizontal rule
      if (trimmed.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        flushQuote();
        flushOrderedList();
        flushUnorderedList();
        blocks.push({
          type: "divider",
        });
        i++;
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith(">")) {
        flushOrderedList();
        flushUnorderedList();
        inQuote = true;
        quoteContent.push(line);
        i++;
        continue;
      } else if (inQuote) {
        flushQuote();
        inQuote = false;
      }

      // Ordered lists
      const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (orderedListMatch) {
        flushQuote();
        flushUnorderedList();
        inOrderedList = true;
        let listItem = orderedListMatch[2];
        i++;
        
        // Collect continuation lines (indented or part of the same list item)
        while (i < lines.length) {
          const nextLine = lines[i];
          const nextTrimmed = nextLine.trim();
          
          // If empty line, end the list item
          if (nextTrimmed === "") {
            break;
          }
          
          // If it's another list item (same or different type), end current item
          if (nextTrimmed.match(/^[-*+]\s+/) || nextTrimmed.match(/^\d+\.\s+/)) {
            break;
          }
          
          // If it's a heading, code block, table, etc., end the list
          if (nextTrimmed.match(/^(#{1,6}|```|>|\||-{3,}|\*{3,}|_{3,})/)) {
            break;
          }
          
          // Continuation line - add to current list item
          // Preserve indentation for nested content
          if (nextLine.match(/^\s{2,}/)) {
            listItem += "\n" + nextLine;
          } else {
            listItem += " " + nextTrimmed;
          }
          i++;
        }
        
        orderedListItems.push(listItem);
        continue;
      } else if (inOrderedList && trimmed === "") {
        flushOrderedList();
        inOrderedList = false;
      } else if (inOrderedList && !orderedListMatch && !trimmed.match(/^\s{2,}/)) {
        // Only flush if it's not a continuation line (indented)
        flushOrderedList();
        inOrderedList = false;
      }

      // Unordered lists
      const unorderedListMatch = trimmed.match(/^[-*+]\s+(.+)$/);
      if (unorderedListMatch) {
        flushQuote();
        flushOrderedList();
        inUnorderedList = true;
        let listItem = unorderedListMatch[1];
        i++;
        
        // Collect continuation lines (indented or part of the same list item)
        while (i < lines.length) {
          const nextLine = lines[i];
          const nextTrimmed = nextLine.trim();
          
          // If empty line, end the list item
          if (nextTrimmed === "") {
            break;
          }
          
          // If it's another list item (same or different type), end current item
          if (nextTrimmed.match(/^[-*+]\s+/) || nextTrimmed.match(/^\d+\.\s+/)) {
            break;
          }
          
          // If it's a heading, code block, table, etc., end the list
          if (nextTrimmed.match(/^(#{1,6}|```|>|\||-{3,}|\*{3,}|_{3,})/)) {
            break;
          }
          
          // Continuation line - add to current list item
          // Preserve indentation for nested content
          if (nextLine.match(/^\s{2,}/)) {
            listItem += "\n" + nextLine;
          } else {
            listItem += " " + nextTrimmed;
          }
          i++;
        }
        
        unorderedListItems.push(listItem);
        continue;
      } else if (inUnorderedList && trimmed === "") {
        flushUnorderedList();
        inUnorderedList = false;
      } else if (inUnorderedList && !unorderedListMatch && !trimmed.match(/^\s{2,}/)) {
        // Only flush if it's not a continuation line (indented)
        flushUnorderedList();
        inUnorderedList = false;
      }

      // Tables (GFM)
      if (trimmed.includes("|") && i + 1 < lines.length) {
        const nextLine = lines[i + 1]?.trim() || "";
        if (nextLine.match(/^\|[\s\-:|]+\|$/)) {
          flushQuote();
          flushOrderedList();
          flushUnorderedList();
          
          const headers = trimmed
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h);
          
          const rows: string[][] = [];
          i += 2; // Skip header and separator
          
          while (i < lines.length && lines[i].trim().includes("|")) {
            const row = lines[i]
              .split("|")
              .map((c) => c.trim())
              .filter((c) => c);
            if (row.length > 0) {
              rows.push(row);
            }
            i++;
          }
          
          if (headers.length > 0) {
            blocks.push({
              type: "table",
              headers: headers,
              rows: rows,
            });
          }
          continue;
        }
      }

      // Regular paragraphs
      if (trimmed) {
        flushQuote();
        flushOrderedList();
        flushUnorderedList();
        
        // Collect consecutive non-empty lines as a paragraph
        const paragraphLines: string[] = [line];
        i++;
        while (i < lines.length && lines[i].trim() && !lines[i].trim().match(/^(#{1,6}|```|>|[-*+]|\d+\.|\||-{3,}|\*{3,}|_{3,})/)) {
          paragraphLines.push(lines[i]);
          i++;
        }
        
        const paragraphText = paragraphLines.join("\n").trim();
        if (paragraphText) {
          blocks.push({
            type: "paragraph",
            text: paragraphText,
          });
        }
        continue;
      }

      i++;
    }

    // Flush any remaining blocks
    flushCodeBlock();
    flushQuote();
    flushOrderedList();
    flushUnorderedList();

    return blocks.length > 0 ? blocks : [
      {
        type: "paragraph",
        text: markdown,
      },
    ];
  } catch (error) {
    console.error("Error parsing markdown to blocks:", error);
    // Fallback: return a single paragraph block with the original text
    return [
      {
        type: "paragraph",
        text: markdown,
      },
    ];
  }
}

