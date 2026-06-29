import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { IndexTable } from "@/components/index-table";
import { getAllPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and notes by Keith O'Brien on content strategy, ghostwriting, software side-projects, and the work of running an independent practice.",
  alternates: {
    canonical: "/writing",
    types: {
      "application/rss+xml": "/writing/feed.xml",
    },
  },
  openGraph: {
    title: "Writing · Keith O'Brien",
    description:
      "Essays and notes by Keith O'Brien on content strategy, ghostwriting, software side-projects, and the work of running an independent practice.",
    url: "/writing",
    type: "website",
  },
  twitter: {
    title: "Writing · Keith O'Brien",
    description:
      "Essays and notes by Keith O'Brien on content strategy, ghostwriting, software side-projects, and the work of running an independent practice.",
  },
};

const SITE_URL = "https://www.keithrobrien.com";
const PAGE_URL = `${SITE_URL}/writing`;

export default function WritingIndex() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#collectionpage`,
    url: PAGE_URL,
    name: "Writing · Keith O'Brien",
    description:
      "Essays and notes by Keith O'Brien on content strategy, ghostwriting, software side-projects, and the work of running an independent practice.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/writing/${p.slug}#article`,
      headline: p.title,
      url: `${SITE_URL}/writing/${p.slug}`,
      datePublished: p.date || undefined,
      author: { "@id": `${SITE_URL}/#person` },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Title + intro */}
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// essays and notes"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Writing
        </h1>
      </Container>

      <Section label="All posts">
        {posts.length === 0 ? (
          <p className="text-[13.5px] text-[var(--color-muted)]">
            Nothing published yet.
          </p>
        ) : (
          <IndexTable
            columns={[
              { label: "#", className: "w-11", accent: true },
              { label: "TITLE", className: "flex-1 pr-4" },
              { label: "DATE", className: "w-[110px] text-right" },
            ]}
            rows={posts.map((post, i) => ({
              cells: [
                String(i + 1).padStart(2, "0"),
                <span key="t" className="flex flex-col gap-[6px]">
                  <span className="text-[var(--color-fg)] font-medium">
                    {post.title}
                  </span>
                  <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
                    {post.excerpt}
                  </span>
                </span>,
                post.date,
              ],
              href: `/writing/${post.slug}`,
            }))}
          />
        )}
      </Section>
    </>
  );
}
