import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Aligned index table from the minimal design system — flex rows (not a
 * <table>) so the header rule and every row share one column template.
 *
 * Define columns once; the header and each row reuse the same per-column
 * classes by position, which guarantees alignment. Rows may link internally
 * (`href`) or externally (`external`). Used by the projects list and the
 * writing index.
 */
export interface IndexColumn {
  label: string;
  /** Tailwind width/flex + alignment classes, e.g. "w-11", "flex-1", "w-9 text-right". */
  className: string;
  /** Accent the cell text in rows (used for the leading index number). */
  accent?: boolean;
}

export interface IndexRowData {
  /** One cell per column, in column order. */
  cells: ReactNode[];
  href?: string;
  external?: boolean;
  ariaLabel?: string;
}

export function IndexTable({
  columns,
  rows,
}: {
  columns: IndexColumn[];
  rows: IndexRowData[];
}) {
  return (
    <div>
      {/* Header rule */}
      <div className="flex text-[11px] tracking-[0.06em] text-[var(--color-faint-2)] pb-3 border-b border-[var(--color-rule-strong)]">
        {columns.map((col, i) => (
          <span key={i} className={col.className}>
            {col.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, ri) => {
        const inner = columns.map((col, ci) => (
          <span
            key={ci}
            className={`${col.className} ${
              col.accent
                ? "text-[var(--color-accent)]"
                : ci === 0
                ? ""
                : "text-[var(--color-muted)]"
            }`}
          >
            {row.cells[ci]}
          </span>
        ));

        const rowClass =
          "flex items-baseline text-[13.5px] py-4 border-b border-[var(--color-border-row)] transition-colors hover:bg-[var(--color-bg-alt)]";

        if (row.href && row.external) {
          return (
            <a
              key={ri}
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={row.ariaLabel}
              className={rowClass}
            >
              {inner}
            </a>
          );
        }
        if (row.href) {
          return (
            <Link key={ri} href={row.href} className={rowClass}>
              {inner}
            </Link>
          );
        }
        return (
          <div key={ri} className={rowClass}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
