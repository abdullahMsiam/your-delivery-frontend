/**
 * Tiny client-side CSV builder + downloader.
 * No external dependency.
 */

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Escape double quotes and wrap in quotes if the value has commas/quotes/newlines
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T>(
  rows: T[],
  columns: {
    key: keyof T;
    header: string;
    format?: (v: T[keyof T], row: T) => string;
  }[],
): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = row[c.key];
          const value = c.format ? c.format(raw, row) : raw;
          return escapeCell(value);
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
