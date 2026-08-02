import type { Metadata } from "next";
import { CollectHeader } from "@/components/collect-header";
import { Section } from "@/components/section";
import { getMusicChangelog, type ChangelogEntry } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every change to Keith O'Brien's living lists: Theseus' Playlist, the Best-of-YYYY playlists, and the movies/TV top 10s.",
  alternates: { canonical: "/collect/changelog" },
  openGraph: {
    title: "Keith O'Brien — Changelog",
    description: "Every change to the living lists in /collect.",
    url: "/collect/changelog",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Changelog",
    description: "Every change to the living lists in /collect.",
    images: ["/opengraph-image"],
  },
};

function domainLabel(entry: ChangelogEntry): string {
  switch (entry.domain) {
    case "playlist":
      return "Theseus' Playlist";
    case "best-of":
      return entry.year ? `Best of ${entry.year}` : "Best of";
    case "movies":
      return "Movies";
    case "tv":
      return "TV";
    case "annual":
      return entry.year ? `${entry.year} Films` : "Annual";
  }
}

function describeEntry(entry: ChangelogEntry): string {
  const withYear = entry.year ? `${entry.title} (${entry.year})` : entry.title;
  const listSize = entry.domain === "annual" ? "top 5" : "top 10";
  switch (entry.type) {
    case "added":
      return `+ ${entry.title}${entry.artists ? ` · ${entry.artists}` : ""}`;
    case "removed":
      return `− ${entry.title}${entry.artists ? ` · ${entry.artists}` : ""}`;
    case "entered":
      return `entered the ${listSize}: ${withYear}, at #${entry.rank}`;
    case "exited":
      return `left the ${listSize}: ${withYear}, was #${entry.previousRank}`;
    case "rank-change":
      return `${withYear} moved #${entry.previousRank} → #${entry.rank}`;
    case "watched":
      return `watched ${withYear}`;
  }
}

function EntryRow({ entry }: { entry: ChangelogEntry }) {
  return (
    <li className="flex items-baseline gap-3 text-[12.5px] border-b border-[var(--color-border)] pb-3 last:border-b-0">
      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--color-faint)] w-[110px] shrink-0">
        {domainLabel(entry)}
      </span>
      <span className="flex-1 text-[var(--color-muted)]">{describeEntry(entry)}</span>
      <span className="text-[var(--color-faint)] w-[60px] text-right shrink-0">
        {new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })}
      </span>
    </li>
  );
}

export default function ChangelogPage() {
  const entries = getMusicChangelog();

  return (
    <>
      <CollectHeader crumb="// collect · changelog" title="Changelog">
        <p>
          Every change to the living lists above: tracks moving in and out of
          Theseus&apos; Playlist and the Best-of-YYYY playlists, and titles
          entering, leaving, or reshuffling the movies and TV top 10s.
        </p>
      </CollectHeader>

      <Section label="History">
        {entries.length ? (
          <ul className="flex flex-col gap-0">
            {entries.map((entry, i) => (
              <EntryRow key={`${entry.domain}-${entry.type}-${entry.date}-${i}`} entry={entry} />
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-[var(--color-muted)]">
            Nothing logged yet. Check back after the next update.
          </p>
        )}
      </Section>
    </>
  );
}
