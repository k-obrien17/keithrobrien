import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { CollectHeader } from "@/components/collect-header";
import { ComingSoon } from "@/components/collect-lists";
import { getMusicYears } from "@/lib/collect";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Keith O'Brien's music: songs of the year by year, plus an all-time list. Hand-curated, with Spotify links.",
  alternates: { canonical: "/collect/music" },
  openGraph: {
    title: "Keith O'Brien — Music",
    description: "Songs of the year, by year, plus an all-time list.",
    url: "/collect/music",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Music",
    description: "Songs of the year, by year, plus an all-time list.",
    images: ["/opengraph-image"],
  },
};

export default function MusicPage() {
  const years = getMusicYears();

  return (
    <>
      <CollectHeader crumb="// collect · music" title="Music">
        <p>
          What I&apos;m listening to, kept by hand. Songs of the year are ranked
          per year with a Spotify link; an all-time list is on the way.
        </p>
      </CollectHeader>

      <Section label="By year">
        {years.length ? (
          <ul className="space-y-3">
            {years.map((y) => (
              <li
                key={y}
                className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
              >
                <Link
                  href={`/collect/music/${y}`}
                  className="group flex items-baseline gap-4"
                >
                  <span className="text-[15px] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                    Songs of {y}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ComingSoon />
        )}
      </Section>

      <Section label="All time">
        <ComingSoon />
      </Section>
    </>
  );
}
