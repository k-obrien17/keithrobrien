import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { ComingSoon } from "@/components/collect-lists";
import data from "@/content/collect/albums.json";

type Entry = {
  title: string;
  artist: string;
  year: number | null;
  score: number;
  type: string;
  mb_url: string | null;
};

export const metadata: Metadata = {
  title: "Albums",
  description:
    "Keith O'Brien's top-ranked albums, pulled from a personal album-ranking app. Exact order, not a vibe.",
  alternates: { canonical: "/collect/albums" },
  openGraph: {
    title: "Keith O'Brien — Albums",
    description: "Top-ranked albums, out of 10.",
    url: "/collect/albums",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Albums",
    description: "Top-ranked albums, out of 10.",
    images: ["/opengraph-image"],
  },
};

function TitleCell({ entry }: { entry: Entry }) {
  const label = (
    <>
      {entry.artist} — {entry.title}
      {entry.year ? (
        <span className="text-[var(--color-muted)]"> ({entry.year})</span>
      ) : null}
    </>
  );
  if (!entry.mb_url) {
    return <span className="text-[14px] text-[var(--color-fg)]">{label}</span>;
  }
  return (
    <a
      href={entry.mb_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[14px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
    >
      {label}
    </a>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] text-[var(--color-muted)] whitespace-nowrap tabular-nums mt-1 sm:mt-0">
      {children}
    </span>
  );
}

export default function AlbumsPage() {
  const top = data.top_albums as Entry[];

  return (
    <>
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// collect · albums"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Albums
        </h1>
        <div className="prose mt-[34px]">
          <p>
            My top-ranked albums, pulled from a personal album-ranking app I
            built. Every position comes from a direct comparison against its
            neighbors, not a typed-in number — the score here is just that
            position translated to a familiar 1-10 scale. Links go to
            MusicBrainz.
          </p>
        </div>
      </Container>

      <Section label="Top albums">
        {top.length ? (
          <ol className="space-y-3">
            {top.map((entry, idx) => (
              <li
                key={`top-${idx}`}
                className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-[12px] text-[var(--color-muted)] tabular-nums w-6 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1">
                    <TitleCell entry={entry} />
                  </span>
                  <Meta>{entry.score.toFixed(2)}</Meta>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <ComingSoon />
        )}
      </Section>
    </>
  );
}
