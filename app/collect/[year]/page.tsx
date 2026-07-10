import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { CollectHeader } from "@/components/collect-header";
import {
  MusicList,
  FilmList,
  BookList,
  SpotifyLink,
  ComingSoon,
} from "@/components/collect-lists";
import { getYears, getYearData } from "@/lib/collect";

export function generateStaticParams() {
  return getYears().map((y) => ({ year: String(y) }));
}

function parseYear(raw: string): number | null {
  return /^\d{4}$/.test(raw) ? Number(raw) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (y === null || !getYears().includes(y)) return {};
  const title = `Best of ${y}`;
  const description = `Keith O'Brien's favorites of ${y} in one place: songs of the year with a Spotify link, top films ranked by his own score, TV, and reading.`;
  return {
    title,
    description,
    alternates: { canonical: `/collect/${y}` },
    openGraph: {
      title: `Keith O'Brien — ${title}`,
      description,
      url: `/collect/${y}`,
      type: "website",
      siteName: "Keith O'Brien",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `Keith O'Brien — ${title}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const y = parseYear(year);
  if (y === null || !getYears().includes(y)) notFound();
  const data = getYearData(y);
  const years = getYears();
  const idx = years.indexOf(y);
  const prev = years[idx + 1]; // older
  const next = years[idx - 1]; // newer

  return (
    <>
      <CollectHeader crumb={`// collect · ${y}`} title={`Best of ${y}`}>
        <p>
          Everything I loved in {y}, gathered in one place: songs, films, and
          more. Music is hand-picked; films are pulled from a media library I
          keep, ranked by my own score out of 10. Curated, not a feed.
        </p>
        <p className="text-[13px] text-[var(--color-muted)]">
          {next ? (
            <Link href={`/collect/${next}`} className="hover:text-[var(--color-accent)] transition-colors">
              ← {next}
            </Link>
          ) : (
            <span className="opacity-40">← {y + 1}</span>
          )}
          <span className="mx-2 text-[var(--color-faint)]">/</span>
          {prev ? (
            <Link href={`/collect/${prev}`} className="hover:text-[var(--color-accent)] transition-colors">
              {prev} →
            </Link>
          ) : (
            <span className="opacity-40">{y - 1} →</span>
          )}
        </p>
      </CollectHeader>

      <Section label="Music">
        {data.music ? (
          <>
            {data.music.spotify_url ? (
              <p className="mb-6">
                <SpotifyLink url={data.music.spotify_url} />
              </p>
            ) : null}
            <MusicList tracks={data.music.tracks} />
            <p className="mt-5 text-[13px]">
              <Link
                href={`/collect/music/${y}`}
                className="text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                Songs of {y} →
              </Link>
            </p>
          </>
        ) : (
          <ComingSoon />
        )}
      </Section>

      <Section label="Film">
        {data.film.length ? (
          <>
            <FilmList films={data.film} />
            <p className="mt-5 text-[13px]">
              <Link
                href={`/collect/watching/${y}`}
                className="text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                Films of {y} →
              </Link>
            </p>
          </>
        ) : (
          <ComingSoon />
        )}
      </Section>

      <Section label="TV">
        {data.tv.length ? <FilmList films={data.tv} /> : <ComingSoon />}
      </Section>

      <Section label="Reading">
        {data.reading.length ? <BookList books={data.reading} /> : <ComingSoon />}
      </Section>
    </>
  );
}
