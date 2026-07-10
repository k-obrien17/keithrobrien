import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { getYears } from "@/lib/collect";

export const metadata: Metadata = {
  title: "Collect",
  description:
    "What Keith O'Brien is watching, listening to, and reading: all-time top tens, songs of the year, and favorite films by year. Curated picks, not a feed.",
  alternates: { canonical: "/collect" },
  openGraph: {
    title: "Keith O'Brien — Collect",
    description:
      "What I'm watching, listening to, and reading. Curated picks, not a feed.",
    url: "/collect",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Collect",
    description:
      "What I'm watching, listening to, and reading. Curated picks, not a feed.",
    images: ["/opengraph-image"],
  },
};

type Lane = {
  label: string;
  href: string | null;
  blurb: string;
};

const LANES: Lane[] = [
  {
    label: "watching",
    href: "/collect/watching",
    blurb: "A top 10 of all time and the most recently logged, out of 10.",
  },
  {
    label: "music",
    href: "/collect/music",
    blurb: "Songs of the year, ranked, with a Spotify link.",
  },
  {
    label: "reading",
    href: "/collect/reading",
    blurb: "Books and pieces worth keeping. Coming soon.",
  },
];

function LaneRow({ lane }: { lane: Lane }) {
  const inner = (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
      <span className="text-[15px] text-[var(--color-fg)] w-24 shrink-0">
        {lane.label}
      </span>
      <span className="text-[13px] text-[var(--color-muted)] mt-1 sm:mt-0">
        {lane.blurb}
      </span>
    </div>
  );
  if (!lane.href) {
    return (
      <div className="border-b border-[var(--color-border)] pb-3 last:border-b-0 opacity-70">
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={lane.href}
      className="block border-b border-[var(--color-border)] pb-3 last:border-b-0 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
        <span className="text-[15px] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors w-24 shrink-0">
          {lane.label}
        </span>
        <span className="text-[13px] text-[var(--color-muted)] mt-1 sm:mt-0">
          {lane.blurb}
        </span>
      </div>
    </Link>
  );
}

export default function CollectPage() {
  return (
    <>
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// collect"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Collect
        </h1>
        <div className="prose mt-[34px]">
          <p>
            What I&apos;m watching, listening to, and reading. Curated picks, not
            a feed: the handful worth pointing at, kept up to date by hand.
          </p>
        </div>
      </Container>

      <Section label="Lanes">
        <div className="space-y-3">
          {LANES.map((lane) => (
            <LaneRow key={lane.label} lane={lane} />
          ))}
        </div>
      </Section>

      <Section label="By year">
        <p className="text-[12px] text-[var(--color-muted)] mb-4">
          Everything I loved in a given year, gathered on one page.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-3">
          {getYears().map((y) => (
            <li key={y}>
              <Link
                href={`/collect/${y}`}
                className="text-[15px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors tabular-nums"
              >
                {y}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
