import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { CollectHeader } from "@/components/collect-header";
import { MusicList, SpotifyLink } from "@/components/collect-lists";
import { getMusicYears, getYearData } from "@/lib/collect";

export function generateStaticParams() {
  return getMusicYears().map((y) => ({ year: String(y) }));
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
  if (y === null || !getMusicYears().includes(y)) return {};
  const title = `Songs of ${y}`;
  const description = `Keith O'Brien's songs of the year for ${y}: a hand-picked, ranked tracklist with a Spotify playlist link. One list per year, kept by hand.`;
  return {
    title,
    description,
    alternates: { canonical: `/collect/music/${y}` },
    openGraph: {
      title: `Keith O'Brien — ${title}`,
      description,
      url: `/collect/music/${y}`,
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

export default async function MusicYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const y = parseYear(year);
  if (y === null || !getMusicYears().includes(y)) notFound();
  const music = getYearData(y).music!;

  return (
    <>
      <CollectHeader crumb={`// collect · music · ${y}`} title={`Songs of ${y}`}>
        <p>
          My songs of {y}, ranked. Not a critic&apos;s list and not
          comprehensive, just the tracks that stuck. Also part of{" "}
          <Link href={`/collect/${y}`} className="text-[var(--color-accent)] hover:underline underline-offset-4">
            Best of {y}
          </Link>
          .
        </p>
      </CollectHeader>

      <Section label={`Songs of ${y}`}>
        {music.spotify_url ? (
          <p className="mb-6">
            <SpotifyLink url={music.spotify_url} />
          </p>
        ) : null}
        <MusicList tracks={music.tracks} />
      </Section>
    </>
  );
}
