/**
 * DataTable — 14A 数据表格功能包（规范 14/14A 章）的 TanStack Table 封装
 * 排序(aria-sort) · 列宽拖动(role=separator + 方向键) · 换行 · 分页(10/20/50+省略号)
 * 防抖搜索 · 状态筛选 · 批量选择 · 空态
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge, type BadgeTone } from "./Badge";
import { Dialog } from "./Dialog";

export interface DemoRow {
  id: number;
  no: string;
  title: string;
  type: string;
  status: string;
  size: number;
}

const STATUS_TONE: Record<string, BadgeTone> = {
  draft: "neutral",
  doing: "info",
  published: "success",
  archived: "warning",
};

const SortIcon = ({ state }: { state: "none" | "asc" | "desc" }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={state === "none" ? 2.4 : 2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {state === "none" && <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />}
    {state === "asc" && <path d="m17 11-5-5-5 5" />}
    {state === "desc" && <path d="m7 13 5 5 5-5" />}
  </svg>
);

const PgIcon = { first: "«", prev: "‹", next: "›", last: "»" };

function pageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "…"> = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function DataTable({ data, onDelete }: { data: DemoRow[]; onDelete?: (rows: DemoRow[]) => void }) {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("all");
  const [sorting, setSorting] = useState([{ id: "no", desc: false }]);
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebounced(globalFilter);
      table.setPageIndex(0);
    }, 300);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  const filtered = useMemo(
    () => (status === "all" ? data : data.filter((r) => r.status === status)),
    [data, status],
  );

  const columns = useMemo<ColumnDef<DemoRow, any>[]>(() => [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      enableResizing: false,
      header: () => {
        const pageRows = table.getRowModel().rows;
        const allSel = pageRows.length > 0 && pageRows.every((r) => selection.has(r.original.id));
        return (
          <input type="checkbox" checked={allSel} aria-label={t("table.selectAll")}
                 className="w-4 h-4 cursor-pointer"
                 onChange={() => setSelection((prev) => {
                   const next = new Set(prev);
                   pageRows.forEach((r) => (allSel ? next.delete(r.original.id) : next.add(r.original.id)));
                   return next;
                 })} />
        );
      },
      cell: ({ row }) => (
        <input type="checkbox" checked={selection.has(row.original.id)}
               aria-label={row.original.no}
               className="w-4 h-4 cursor-pointer"
               onClick={(e) => e.stopPropagation()}
               onChange={() => setSelection((prev) => {
                 const next = new Set(prev);
                 next.has(row.original.id) ? next.delete(row.original.id) : next.add(row.original.id);
                 return next;
               })} />
      ),
    },
    {
      accessorKey: "no", size: 140,
      header: () => t("table.col.no"),
      cell: (c) => <span className="mono font-semibold text-action break-words">{c.getValue<string>()}</span>,
    },
    {
      accessorKey: "title", size: 240,
      header: () => t("table.col.title"),
      cell: (c) => <span className="break-words">{c.getValue<string>()}</span>,
    },
    {
      accessorKey: "type", size: 110, enableSorting: false,
      header: () => t("table.col.type"),
      cell: (c) => <span className="text-text-muted break-words">{t(`type.${c.getValue<string>()}`)}</span>,
    },
    {
      accessorKey: "status", size: 110,
      header: () => t("table.col.status"),
      cell: (c) => <Badge tone={STATUS_TONE[c.getValue<string>()] ?? "neutral"}>{t(`status.${c.getValue<string>()}`)}</Badge>,
    },
    {
      accessorKey: "size", size: 110,
      header: () => t("table.col.size"),
      cell: (c) => <span className="block text-right font-semibold tabular-nums">{c.getValue<number>().toLocaleString()}</span>,
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [t, selection]);

  const [userSized, setUserSized] = useState(false);   // 拖过列宽 → 精确像素模式（拖哪列动哪列）

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter: debounced },
    onSortingChange: setSorting,
    onGlobalFilterChange: setDebounced,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    initialState: { pagination: { pageSize: 10 } },
  });

  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = filtered.filter((r) => selection.has(r.id));

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏：防抖搜索 + 状态筛选（14A.5） */}
      <div className="flex flex-wrap items-center gap-2">
        <input className="input max-w-[320px] flex-1" type="text"
               placeholder={t("table.search")} value={globalFilter}
               aria-label={t("table.search")}
               onChange={(e) => setGlobalFilter(e.target.value)} />
        <select className="input w-auto min-w-[130px]" value={status} aria-label={t("table.allStatus")}
                onChange={(e) => { setStatus(e.target.value); table.setPageIndex(0); }}>
          <option value="all">{t("table.allStatus")}</option>
          <option value="draft">{t("status.draft")}</option>
          <option value="doing">{t("status.doing")}</option>
          <option value="published">{t("status.published")}</option>
          <option value="archived">{t("status.archived")}</option>
        </select>
      </div>

      {/* 批量操作条（14A.6） */}
      {selectedRows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-[8px] border px-3 py-2 text-[13px]"
             style={{ background: "var(--color-purple-tint)", borderColor: "var(--ale-purple-40)" }}>
          <span className="font-bold text-heading">{t("table.selected", { count: selectedRows.length })}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelection(new Set())}>{t("table.clearSelection")}</button>
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmOpen(true)}>{t("table.batchDelete")}</button>
        </div>
      )}

      <div className="rounded-[12px] border border-border bg-surface" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="overflow-x-auto">
          {/* 宽度模式：userSized=false 填满容器（filler 列吸收余量）；拖动后精确像素（Σ列宽，只有目标列变，F14） */}
          <table className="data w-full"
                 style={userSized
                   ? { width: table.getTotalSize(), minWidth: 0 }
                   : { minWidth: "100%" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header, i) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted(); // false | "asc" | "desc"
                    const col = header.column;
                    return (
                      <th key={header.id} className="relative select-none"
                          style={{ width: header.getSize() }}
                          aria-sort={canSort ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}>
                        <div className={cn("flex items-center gap-1", canSort && "cursor-pointer")}
                             onClick={canSort ? col.getToggleSortingHandler() : undefined}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <button type="button" className="sort-btn"
                                    aria-label={t("table.sortAsc", { col: header.id })}
                                    onClick={(e) => { e.stopPropagation(); col.getToggleSortingHandler()?.(e); }}>
                              <SortIcon state={sorted || "none"} />
                            </button>
                          )}
                        </div>
                        {/* 列宽手柄：role=separator + 方向键（14A.2） */}
                        {header.column.getCanResize() && i < hg.headers.length - 1 && (
                          <div role="separator" tabIndex={0} aria-orientation="vertical"
                               aria-label={t("table.resize", { col: header.id, px: header.getSize() })}
                               className="col-resizer"
                               onMouseDown={(e) => {
                                 e.preventDefault();
                                 setUserSized(true);
                                 (e.target as HTMLElement).classList.add("active");
                                 header.getResizeHandler()?.(e as unknown as React.MouseEvent);
                                 const onUp = () => {
                                   document.querySelectorAll(".col-resizer.active").forEach((el) => el.classList.remove("active"));
                                   document.removeEventListener("mouseup", onUp);
                                 };
                                 document.addEventListener("mouseup", onUp);
                               }}
                               onTouchStart={header.getResizeHandler()}
                               onKeyDown={(e) => {
                                 setUserSized(true);
                                 const step = e.shiftKey ? 1 : 10;
                                 const cur = table.getState().columnSizing[header.column.id] ?? header.getSize();
                                 if (e.key === "ArrowLeft") table.setColumnSizing((prev) => ({ ...prev, [header.column.id]: Math.max(50, (prev[header.column.id] ?? cur) - step) }));
                                 else if (e.key === "ArrowRight") table.setColumnSizing((prev) => ({ ...prev, [header.column.id]: Math.max(50, (prev[header.column.id] ?? cur) + step) }));
                                 else return;
                                 e.preventDefault();
                               }} />
                        )}
                      </th>
                    );
                  })}
                  <th className="filler" aria-hidden="true" />
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="table-state">{t("table.empty")}</td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} aria-selected={selection.has(row.original.id)}
                      className={selection.has(row.original.id) ? "selected" : ""}
                      style={selection.has(row.original.id) ? { background: "var(--color-purple-tint)" } : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2 text-[13px] border-b"
                          style={{ width: cell.column.getSize(), borderColor: "var(--color-border-soft)" }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="filler border-b" style={{ borderColor: "var(--color-border-soft)" }} />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页（14A.4） */}
        <div className="pagination">
          <div className="pg-left">
            <span>{t("table.perPage")}</span>
            <select className="input" style={{ minHeight: 32, width: 70, padding: ".2rem .6rem" }}
                    aria-label={t("table.perPage")}
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}>
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>{t("table.range", {
              start: totalRows > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0,
              end: Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows),
              total: totalRows.toLocaleString(),
            })}</span>
          </div>
          <div className="pg-right">
            <button className="pg-btn" disabled={!table.getCanPreviousPage()} aria-label="首页"
                    onClick={() => table.setPageIndex(0)}>{PgIcon.first}</button>
            <button className="pg-btn" disabled={!table.getCanPreviousPage()} aria-label="上一页"
                    onClick={() => table.previousPage()}>{PgIcon.prev}</button>
            {pageNumbers(table.getState().pagination.pageIndex + 1, Math.max(1, totalPages)).map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="pg-ellipsis">…</span>
              ) : (
                <button key={p} className="pg-btn" aria-current={table.getState().pagination.pageIndex + 1 === p ? "page" : undefined}
                        onClick={() => table.setPageIndex(p - 1)}>{p}</button>
              ),
            )}
            <button className="pg-btn" disabled={!table.getCanNextPage()} aria-label="下一页"
                    onClick={() => table.nextPage()}>{PgIcon.next}</button>
            <button className="pg-btn" disabled={!table.getCanNextPage()} aria-label="末页"
                    onClick={() => table.setPageIndex(totalPages - 1)}>{PgIcon.last}</button>
          </div>
        </div>
      </div>

      {/* 批量删除危险确认（规范 17 章） */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}
              title={t("table.confirmDeleteTitle", { count: selectedRows.length })}
              footer={
                <>
                  <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>{t("table.cancel")}</button>
                  <button className="btn btn-danger" onClick={() => {
                    onDelete?.(selectedRows);
                    setSelection(new Set());
                    setConfirmOpen(false);
                  }}>{t("table.deleteOk")}</button>
                </>
              }>
        {t("table.confirmDeleteBody")}
      </Dialog>
    </div>
  );
}
