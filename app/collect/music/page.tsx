import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import data from "@/content/collect/music.json";

type Track = {
  track: string;
  artist: string;
  album: string;
};

type YearSet = {
  year: number;
  spotify_url: string;
  tracks: Track[];
};

export const metadata: Metadata = {
  title: "Music",
  description:
    "Keith O'Brien's songs of the year: a ranked tracklist, hand-curated, with a Spotify link.",
  alternates: { canonical: "/collect/music" },
  openGraph: {
    title: "Keith O'Brien — Music",
    description: "Songs of the year, ranked. A hand-curated tracklist with a Spotify link.",
    url: "/collect/music",
    type: "website",
  },
  twitter: {
    title: "Keith O'Brien — Music",
    description: "Songs of the year, ranked. A hand-curated tracklist with a Spotify link.",
  },
};

function SpotifyLink({ url }: { url: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-[var(--color-accent)] hover:underline underline-offset-4"
    >
      Listen on Spotify →
    </a>
  );
}

export default function MusicPage() {
  const sets = data.songs_of_the_year as YearSet[];

  return (
    <>
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// collect · music"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Music
        </h1>
        <div className="prose mt-[34px]">
          <p>
            My songs of the year, ranked. Not a critic&apos;s list and not
            comprehensive, just the tracks that stuck with me, kept in order and
            updated by hand. Each set links out to the full playlist on Spotify.
          </p>
        </div>
      </Container>

      {sets.map((set) => (
        <Section key={set.year} label={`Songs of the year · ${set.year}`}>
          {set.spotify_url ? (
            <p className="mb-6">
              <SpotifyLink url={set.spotify_url} />
            </p>
          ) : null}
          <ol className="space-y-3">
            {set.tracks.map((entry, idx) => (
              <li
                key={`${set.year}-${idx}`}
                className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-[12px] text-[var(--color-muted)] tabular-nums w-6 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1">
                    <span className="text-[14px] text-[var(--color-fg)]">
                      {entry.track}
                    </span>
                    <span className="text-[14px] text-[var(--color-muted)]">
                      {" "}
                      · {entry.artist}
                    </span>
                  </span>
                  <span className="text-[12px] text-[var(--color-muted)] italic mt-1 sm:mt-0 sm:text-right sm:max-w-[220px]">
                    {entry.album}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ))}
    </>
  );
}
