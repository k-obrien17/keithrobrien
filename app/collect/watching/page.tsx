import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import data from "@/content/collect/watching.json";

type Entry = {
  title: string;
  year: number | null;
  score: number;
  type: string;
  tmdb_url: string | null;
  logged?: string;
};

export const metadata: Metadata = {
  title: "Watching",
  description:
    "Movies and TV Keith O'Brien is watching: a top 10 of all time and the most recently rated, pulled from a self-hosted media library.",
  alternates: { canonical: "/collect/watching" },
  openGraph: {
    title: "Keith O'Brien — Watching",
    description: "Top 10 films and top 10 TV shows of all time, plus what I've rated most recently.",
    url: "/collect/watching",
    type: "website",
  },
  twitter: {
    title: "Keith O'Brien — Watching",
    description: "Top 10 films and top 10 TV shows of all time, plus what I've rated most recently.",
  },
};

function TitleCell({ entry }: { entry: Entry }) {
  const label = (
    <>
      {entry.title}
      {entry.year ? (
        <span className="text-[var(--color-muted)]"> ({entry.year})</span>
      ) : null}
    </>
  );
  if (!entry.tmdb_url) {
    return <span className="text-[14px] text-[var(--color-fg)]">{label}</span>;
  }
  return (
    <a
      href={entry.tmdb_url}
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

export default function WatchingPage() {
  const top = data.top_movies as Entry[];
  const topTv = data.top_tv as Entry[];
  const recent = data.recently_watched as Entry[];
  const recentTv = data.recent_tv as Entry[];

  return (
    <>
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// collect · watching"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Watching
        </h1>
        <div className="prose mt-[34px]">
          <p>
            Movies and TV, pulled from a self-hosted media library I keep. Scores
            are my own, out of 10. Links go to TMDB. Not a review site, just what
            I&apos;ve actually watched and how it landed.
          </p>
        </div>
      </Container>

      <Section label="Top 10 films">
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
                <Meta>{entry.score.toFixed(1)}</Meta>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Top 10 TV shows">
        <ol className="space-y-3">
          {topTv.map((entry, idx) => (
            <li
              key={`toptv-${idx}`}
              className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-[12px] text-[var(--color-muted)] tabular-nums w-6 shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1">
                  <TitleCell entry={entry} />
                </span>
                <Meta>{entry.score.toFixed(1)}</Meta>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Recently rated">
        <p className="text-[12px] text-[var(--color-muted)] mb-4">
          The last {recent.length} I rated, newest first
        </p>
        <ul className="space-y-3">
          {recent.map((entry, idx) => (
            <li
              key={`recent-${idx}`}
              className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <span className="flex-1">
                  <TitleCell entry={entry} />
                  {entry.type === "tv" ? (
                    <span className="text-[11px] text-[var(--color-muted)] ml-2 uppercase tracking-[0.06em]">
                      tv
                    </span>
                  ) : null}
                </span>
                <Meta>{entry.score.toFixed(1)}</Meta>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Recently rated TV">
        <p className="text-[12px] text-[var(--color-muted)] mb-4">
          The last {recentTv.length} TV shows I rated, newest first
        </p>
        <ul className="space-y-3">
          {recentTv.map((entry, idx) => (
            <li
              key={`recenttv-${idx}`}
              className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <span className="flex-1">
                  <TitleCell entry={entry} />
                </span>
                <Meta>{entry.score.toFixed(1)}</Meta>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
