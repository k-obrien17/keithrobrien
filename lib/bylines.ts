import bylinesJson from "@/content/bylines-archive.json";

export interface BylineItem {
  title: string;
  date: string;
  publication: string;
  publication_display: string;
  url: string;
  is_keith_byline: boolean;
  ghostwritten_for: string | null;
}

const FEATURED_URL =
  "https://whyisthisinteresting.substack.com/p/the-multi-player-world-cup-ad-edition";

/** The homepage's featured-writing slot: one published byline under Keith's own name. */
export function getFeaturedByline(): BylineItem | null {
  const items = (bylinesJson as { items: BylineItem[] }).items;
  return items.find((item) => item.url === FEATURED_URL) ?? null;
}
