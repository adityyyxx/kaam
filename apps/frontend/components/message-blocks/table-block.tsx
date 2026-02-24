import { cn } from "@/lib/utils";
import type { TableBlock } from "@/lib/message-blocks";

interface TableBlockProps {
  block: TableBlock;
  className?: string;
}

export function TableBlockComponent({ block, className }: TableBlockProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto mb-0 border border-border/40 rounded-lg",
        "bg-background/50 backdrop-blur-sm",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/40 bg-muted/40">
            {block.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-semibold text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors duration-150"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-foreground leading-[1.6]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

