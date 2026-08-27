"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/lib/engines/data";

interface DataGridProps { table: DataTable; search: string; pageSize?: number; }

export function DataGrid({ table, search, pageSize = 25 }: DataGridProps) {
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState<{ column: number; direction: "asc" | "desc" } | null>(null);
  const rows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query ? table.rows.filter((row) => row.some((value) => value.toLowerCase().includes(query))) : [...table.rows];
    if (sort) filtered.sort((a, b) => a[sort.column].localeCompare(b[sort.column], undefined, { numeric: true }) * (sort.direction === "asc" ? 1 : -1));
    return filtered;
  }, [search, sort, table.rows]);
  React.useEffect(() => setPage(0), [search, table]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice(page * pageSize, (page + 1) * pageSize);
  return (
    <div className="space-y-3">
      <div className="max-h-[480px] overflow-auto rounded-xl border border-border/70">
        <table className="w-full min-w-max border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>{table.headers.map((header, index) => <th key={`${header}-${index}`} className="border-b border-border px-3 py-2 font-semibold"><button type="button" onClick={() => setSort((current) => ({ column: index, direction: current?.column === index && current.direction === "asc" ? "desc" : "asc" }))} className="hover:text-primary">{header}{sort?.column === index ? (sort.direction === "asc" ? " ↑" : " ↓") : ""}</button></th>)}</tr>
          </thead>
          <tbody>{visible.map((row, rowIndex) => <tr key={`${page}-${rowIndex}`} className="border-b border-border/40 last:border-0 hover:bg-muted/30">{table.headers.map((_, column) => <td key={column} className="max-w-[22rem] truncate px-3 py-2 text-muted-foreground" title={row[column]}>{row[column]}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{rows.length} matching rows · {table.headers.length} columns</span>
        <div className="flex items-center gap-2"><Button size="icon" variant="outline" className="h-8 w-8" disabled={page === 0} onClick={() => setPage((value) => value - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button><span>Page {page + 1} of {pages}</span><Button size="icon" variant="outline" className="h-8 w-8" disabled={page + 1 >= pages} onClick={() => setPage((value) => value + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button></div>
      </div>
    </div>
  );
}
