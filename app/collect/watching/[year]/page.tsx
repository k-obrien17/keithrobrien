import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { CollectHeader } from "@/components/collect-header";
import { FilmList, ComingSoon } from "@/components/collect-lists";
import { getFilmYears, getYearData } from "@/lib/collect";

export function generateStaticParams() {
  return getFilmYears().map((y) => ({ year: String(y) }));
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
  if (y === null || !getFilmYears().includes(y)) return {};
  const title = `Films of ${y}`;
  const description = `Keith O'Brien's favorite films released in ${y}, ranked by his own score out of 10 and pulled from a self-hosted media library. Links go to TMDB.`;
  return {
    title,
    description,
    alternates: { canonical: `/collect/watching/${y}` },
    openGraph: {
      title: `Keith O'Brien — ${title}`,
      description,
      url: `/collect/watching/${y}`,
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

export default async function WatchingYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const y = parseYear(year);
  if (y === null || !getFilmYears().includes(y)) notFound();
  const data = getYearData(y);

  return (
    <>
      <CollectHeader crumb={`// collect · watching · ${y}`} title={`Films of ${y}`}>
        <p>
          My favorite films released in {y}, ranked by my own score out of 10,
          pulled from a media library I keep. Also part of{" "}
          <Link href={`/collect/${y}`} className="text-[var(--color-accent)] hover:underline underline-offset-4">
            Best of {y}
          </Link>
          .
        </p>
      </CollectHeader>

      <Section label={`Films of ${y}`}>
        {data.film.length ? <FilmList films={data.film} /> : <ComingSoon />}
      </Section>

      {data.tv.length ? (
        <Section label={`TV of ${y}`}>
          <FilmList films={data.tv} />
        </Section>
      ) : null}
    </>
  );
}
