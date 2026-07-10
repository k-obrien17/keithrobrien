import type { Metadata } from "next";
import { Section } from "@/components/section";
import { CollectHeader } from "@/components/collect-header";
import { ComingSoon } from "@/components/collect-lists";

export const metadata: Metadata = {
  title: "Reading",
  description:
    "Books worth keeping, curated by Keith O'Brien: an all-time list and a year-by-year cut of the reading that stuck. Coming soon.",
  alternates: { canonical: "/collect/reading" },
  openGraph: {
    title: "Keith O'Brien — Reading",
    description: "Books worth keeping. Curated, not a feed.",
    url: "/collect/reading",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Reading",
    description: "Books worth keeping. Curated, not a feed.",
    images: ["/opengraph-image"],
  },
};

export default function ReadingPage() {
  return (
    <>
      <CollectHeader crumb="// collect · reading" title="Reading">
        <p>
          Books and pieces worth keeping: an all-time list and a cut by year.
          Hand-curated, not a feed.
        </p>
      </CollectHeader>

      <Section label="By year">
        <ComingSoon />
      </Section>

      <Section label="All time">
        <ComingSoon />
      </Section>
    </>
  );
}
