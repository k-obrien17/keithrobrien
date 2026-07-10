import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import archive from "@/content/bylines-archive.json";

const SITE_URL = "https://www.keithrobrien.com";
const PAGE_URL = `${SITE_URL}/bylines`;

type Item = {
  title: string;
  date: string;
  publication: string;
  publication_display: string;
  url: string;
  original_url: string;
  wayback_url: string;
  is_keith_byline: boolean;
  ghostwritten_for: string | null;
};

type Archive = {
  generated_at: string;
  total: number;
  by_publication: { slug: string; display: string; count: number }[];
  items: Item[];
};

const rawData = archive as Archive;

// Temporary scope: show only these publications until Keith reviews the rest.
// To re-expand, add slugs here or set to null to show everything.
const ALLOWED_PUBLICATIONS = new Set<string>([
  "prweek",
  "ibm",
  "realeyesit",
  "dmnews",
  "medium",
  "econsultancy",
  "whyisthisinteresting",
]);

const data: Archive = {
  ...rawData,
  items: rawData.items.filter((i) => ALLOWED_PUBLICATIONS.has(i.publication)),
  by_publication: rawData.by_publication.filter((p) =>
    ALLOWED_PUBLICATIONS.has(p.slug)
  ),
  total: rawData.items.filter((i) => ALLOWED_PUBLICATIONS.has(i.publication))
    .length,
};

export const metadata: Metadata = {
  title: "Bylines",
  description: `Archive of ${data.total} bylines and ghostwritten pieces by Keith O'Brien across PRWeek, IBM, Realeyes, UST, Forbes, Fast Company, AdvertisingWeek, DMN, and other publications, 2004 to present.`,
  alternates: { canonical: "/bylines" },
  openGraph: {
    title: "Keith O'Brien — Bylines",
    description: `${data.total} pieces across ${data.by_publication.length} publications, 2004 to present.`,
    url: "/bylines",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Keith O'Brien — Bylines",
    description: `${data.total} pieces across ${data.by_publication.length} publications, 2004 to present.`,
  },
};

const years = (() => {
  const yrs = data.items
    .map((i) => i.date?.slice(0, 4))
    .filter((y): y is string => Boolean(y && /^\d{4}$/.test(y)));
  if (yrs.length === 0) return { min: "", max: "" };
  return {
    min: yrs.reduce((a, b) => (a < b ? a : b)),
    max: yrs.reduce((a, b) => (a > b ? a : b)),
  };
})();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${PAGE_URL}#collectionpage`,
  url: PAGE_URL,
  name: "Bylines — Keith O'Brien",
  description: `Archive of ${data.total} pieces written or ghostwritten by Keith O'Brien across ${data.by_publication.length} publications.`,
  mainEntity: { "@id": `${SITE_URL}/#person` },
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

function formatDate(date: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date || "";
  const [y, m, d] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export default function PressPage() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// bylines"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Bylines
        </h1>
        <div className="prose mt-[34px]">
          <p>
            {data.total} pieces across {data.by_publication.length} publications
            {years.min && years.max ? `, ${years.min} to ${years.max}` : ""}. Lists
            Keith&apos;s own bylines (mostly PRWeek and personal essays) plus
            ghostwritten work that named clients have approved for public credit.
            Pieces under NDA, gated client work, and never-published drafts are
            not surfaced here.
          </p>
          <p>
            For credentialing and verification: every entry links to either the
            live URL or, where the original 404s, to a Wayback Machine snapshot.
            Archive last regenerated {data.generated_at}.
          </p>
        </div>
      </Container>

      <Section label="By publication">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {data.by_publication.map((p) => (
            <li key={p.slug} className="text-[13px] flex justify-between gap-2">
              <a
                href={`#pub-${p.slug}`}
                className="text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
              >
                {p.display}
              </a>
              <span className="text-[var(--color-fg-muted)]">{p.count}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Recent">
        <p className="text-[12px] text-[var(--color-fg-muted)] mb-4">
          Most recent 15 pieces across all publications
        </p>
        <ul className="space-y-3">
          {data.items.slice(0, 15).map((item, idx) => (
            <li
              key={`recent-${idx}`}
              className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors flex-1"
                >
                  {item.title}
                </a>
                <span className="text-[12px] text-[var(--color-fg-muted)] whitespace-nowrap mt-1 sm:mt-0">
                  {item.publication_display} &middot; {formatDate(item.date)}
                </span>
              </div>
              {item.ghostwritten_for ? (
                <p className="text-[11px] text-[var(--color-fg-muted)] mt-1">
                  Ghostwritten for {item.ghostwritten_for}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      {data.by_publication.map((pub) => {
        const items = data.items.filter((i) => i.publication === pub.slug);
        if (items.length === 0) return null;
        return (
          <Section key={pub.slug} label={pub.display}>
            <p
              id={`pub-${pub.slug}`}
              className="text-[12px] text-[var(--color-fg-muted)] mb-4 scroll-mt-24"
            >
              {items.length} {items.length === 1 ? "piece" : "pieces"}
            </p>
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li
                  key={`${pub.slug}-${idx}`}
                  className="border-b border-[var(--color-border)] pb-3 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors flex-1"
                    >
                      {item.title}
                    </a>
                    <span className="text-[12px] text-[var(--color-fg-muted)] whitespace-nowrap mt-1 sm:mt-0">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {item.ghostwritten_for ? (
                    <p className="text-[11px] text-[var(--color-fg-muted)] mt-1">
                      Ghostwritten for {item.ghostwritten_for}
                    </p>
                  ) : null}
                  {item.wayback_url && item.url === item.wayback_url ? (
                    <p className="text-[11px] text-[var(--color-fg-muted)] mt-1">
                      Original URL no longer resolves; link points to Wayback
                      Machine snapshot.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section label="About this archive">
        <div className="prose">
          <p>
            The archive is generated from a preservation-first vault outside this
            site. Source files include an Authory XML export (May 2024, 562
            pieces) and a Wayback Machine recovery of DMN bylines from 2021-2024.
            Every piece is preserved as raw HTML or XML with checksums, plus a
            canonical Markdown file with structured metadata. The list rendered
            here is a filtered view; pieces that name clients without prior
            written approval are hidden by default.
          </p>
          <p>
            If a piece is missing that you believe should be here, or an
            attribution is wrong, email{" "}
            <a href="mailto:keith@totalemphasis.com">
              keith@totalemphasis.com
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
