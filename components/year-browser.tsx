"use client";

import Link from "next/link";
import { useState } from "react";

// Browse the years covered by /collect without leaving the homepage: prev/next
// scrubs the label, the year itself (and "view" state) links straight into
// /collect/[year]. `years` is server-computed (getYears() reads the filesystem)
// and passed in newest-first.
export function YearBrowser({
  years,
  counts = {},
}: {
  years: number[];
  counts?: Record<number, { songs: number; films: number; shows: number }>;
}) {
  const [index, setIndex] = useState(0);
  const year = years[index];

  const canOlder = index < years.length - 1;
  const canNewer = index > 0;
  const selectedCounts = counts[year] ?? { songs: 0, films: 0, shows: 0 };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <button
        type="button"
        onClick={() => canOlder && setIndex(index + 1)}
        disabled={!canOlder}
        aria-label="Older year"
        className="text-[13px] text-[var(--color-muted)] transition-opacity hover:opacity-55 disabled:opacity-30 disabled:pointer-events-none"
      >
        &larr; older
      </button>

      <Link
        href={`/collect/${year}`}
        className="text-[22px] font-medium text-[var(--color-fg)] tabular-nums transition-opacity hover:opacity-55"
      >
        {year}
      </Link>
      <span className="text-[12px] text-[var(--color-muted)] tabular-nums">
        {[selectedCounts.songs ? `${selectedCounts.songs} songs` : null,
          selectedCounts.films ? `${selectedCounts.films} films` : null,
          selectedCounts.shows ? `${selectedCounts.shows} shows` : null]
          .filter(Boolean)
          .join(" · ") || "No entries yet"}
      </span>

      <button
        type="button"
        onClick={() => canNewer && setIndex(index - 1)}
        disabled={!canNewer}
        aria-label="Newer year"
        className="text-[13px] text-[var(--color-muted)] transition-opacity hover:opacity-55 disabled:opacity-30 disabled:pointer-events-none"
      >
        newer &rarr;
      </button>

      <label className="ml-auto flex items-center gap-2 text-[12.5px] text-[var(--color-muted)]">
        jump to
        <select
          value={year}
          onChange={(e) => setIndex(years.indexOf(Number(e.target.value)))}
          className="border border-[var(--color-accent)] bg-[var(--color-accent-light)] px-3 py-1 text-[12.5px] font-medium text-[var(--color-fg)] outline-none transition-colors focus:ring-2 focus:ring-[var(--color-accent)]/30"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
