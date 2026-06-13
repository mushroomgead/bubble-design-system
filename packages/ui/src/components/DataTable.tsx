"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Checkbox } from "./Checkbox";
import { cn } from "../utils/cn";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
  muted?: boolean;
  mono?: boolean;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: DataTableColumn<T>[];
  data: T[];
  selectable?: boolean;
  searchable?: boolean;
  pageSize?: number;
  actions?: ReactNode;
  className?: string;
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6.2"
        cy="6.2"
        r="4.3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M9.5 9.5L13 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 2L4 6l3.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 2L8 6l-3.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SortIcon({ direction }: { direction: "asc" | "desc" | null }) {
  return (
    <span className="pds-datatable__sort-icon" aria-hidden="true">
      <svg width="7" height="4" viewBox="0 0 7 4" fill="none">
        <path
          d="M0 4L3.5 0L7 4H0Z"
          fill={
            direction === "asc" ? "var(--color-text-brand)" : "currentColor"
          }
        />
      </svg>
      <svg
        width="7"
        height="4"
        viewBox="0 0 7 4"
        fill="none"
        style={{ opacity: direction === "desc" ? 1 : 0.3 }}
      >
        <path
          d="M0 0L3.5 4L7 0H0Z"
          fill={
            direction === "desc" ? "var(--color-text-brand)" : "currentColor"
          }
        />
      </svg>
    </span>
  );
}

function renderCell(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return String(value);
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  selectable = true,
  searchable = true,
  pageSize = 10,
  actions,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [sort, setSort] = useState<{ key: string | null; dir: "asc" | "desc" }>(
    { key: null, dir: "asc" },
  );
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => {
          const v = (row as Record<string, unknown>)[col.key];
          return v != null && String(v).toLowerCase().includes(q);
        }),
      );
    }
    if (sort.key) {
      const key = sort.key;
      rows = [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[key] ?? "";
        const bv = (b as Record<string, unknown>)[key] ?? "";
        const cmp = String(av).localeCompare(String(bv), undefined, {
          numeric: true,
        });
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, query, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const allSelected =
    pageData.length > 0 && pageData.every((r) => selected.has(r.id));
  const someSelected = pageData.some((r) => selected.has(r.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) {
      pageData.forEach((r) => next.delete(r.id));
    } else {
      pageData.forEach((r) => next.add(r.id));
    }
    setSelected(next);
  };

  const toggleRow = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleSort = (key: string) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
    setPage(1);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const startItem = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, filtered.length);

  const pageNums = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [page - 2, page - 1, page, page + 1, page + 2];
  })();

  return (
    <div className={cn("pds-datatable", className)}>
      {(searchable || actions) && (
        <div className="pds-datatable__toolbar">
          {searchable && (
            <div className="pds-datatable__search">
              <span className="pds-datatable__search-icon">
                <SearchIcon />
              </span>
              <input
                className="pds-datatable__search-input"
                type="search"
                placeholder="Search…"
                value={query}
                onChange={onSearch}
                aria-label="Search table"
              />
            </div>
          )}
          {selected.size > 0 && (
            <span className="pds-datatable__bulk-label">
              {selected.size} selected
            </span>
          )}
          {actions && (
            <div className="pds-datatable__toolbar-right">{actions}</div>
          )}
        </div>
      )}

      <div className="pds-datatable__wrap">
        <table
          className={cn(
            "pds-datatable__table",
            selectable && "pds-datatable__table--selectable",
          )}
          aria-label="Data table"
        >
          <thead className="pds-datatable__thead">
            <tr className="pds-datatable__row">
              {selectable && (
                <th
                  className="pds-datatable__th pds-datatable__check-col"
                  aria-label="Select all"
                >
                  <Checkbox
                    size="sm"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onCheckedChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const sortable = col.sortable !== false;
                const isSorted = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "pds-datatable__th",
                      sortable && "pds-datatable__th--sort",
                      isSorted && "pds-datatable__th--sorted",
                    )}
                    onClick={sortable ? () => toggleSort(col.key) : undefined}
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={
                      isSorted
                        ? sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {col.label}
                    {sortable && (
                      <SortIcon direction={isSorted ? sort.dir : null} />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="pds-datatable__tbody">
            {pageData.length === 0 ? (
              <tr className="pds-datatable__row">
                <td
                  className="pds-datatable__td pds-datatable__empty"
                  colSpan={columns.length + (selectable ? 1 : 0)}
                >
                  No results found
                </td>
              </tr>
            ) : (
              pageData.map((row) => {
                const isSel = selected.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "pds-datatable__row",
                      isSel && "pds-datatable__row--selected",
                    )}
                    aria-selected={isSel}
                    onClick={selectable ? () => toggleRow(row.id) : undefined}
                  >
                    {selectable && (
                      <td
                        className="pds-datatable__td pds-datatable__check-col"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="sm"
                          checked={isSel}
                          onCheckedChange={() => toggleRow(row.id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "pds-datatable__td",
                          col.muted && "pds-datatable__td--muted",
                          col.mono && "pds-datatable__td--mono",
                        )}
                      >
                        {col.render
                          ? col.render(
                              (row as Record<string, unknown>)[col.key],
                              row,
                            )
                          : renderCell(
                              (row as Record<string, unknown>)[col.key],
                            )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pds-datatable__footer">
        <span className="pds-datatable__page-info">
          {filtered.length === 0
            ? "No results"
            : `${startItem}–${endItem} of ${filtered.length}`}
        </span>
        <div
          className="pds-datatable__pagination"
          role="navigation"
          aria-label="Pagination"
        >
          <button
            type="button"
            className="pds-datatable__page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>
          {pageNums.map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                "pds-datatable__page-btn",
                p === page && "pds-datatable__page-btn--active",
              )}
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="pds-datatable__page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
