import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** How to render a cell for this column. */
  cell: (row: T) => React.ReactNode;
  /** Optional class for the header cell. */
  headClassName?: string;
  /** Optional class for every body cell in this column. */
  cellClassName?: string;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  /** Return a stable key for each row (defaults to index). */
  getRowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  className,
}: Props<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-border/60 bg-card",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            {columns.map((c) => (
              <TableHead
                key={c.key}
                className={cn(
                  "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                  c.headClassName,
                )}
              >
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={getRowKey ? getRowKey(row, i) : i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-border/60",
                onRowClick && "group/row cursor-pointer hover:bg-muted/50",
              )}
            >
              {columns.map((c) => (
                <TableCell key={c.key} className={cn(c.cellClassName)}>
                  {c.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
