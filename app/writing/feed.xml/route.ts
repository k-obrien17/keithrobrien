import { getAllPosts } from "@/lib/writing";

export const dynamic = "force-static";

const SITE_URL = "https://www.keithrobrien.com";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822(dateStr: string): string {
  if (!dateStr) return new Date().toUTCString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export function GET() {
  const posts = getAllPosts();
  const buildDate = posts[0]?.date
    ? toRFC822(posts[0].date)
    : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/writing/${p.slug}`;
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRFC822(p.date)}</pubDate>
      <description>${escape(p.excerpt || "")}</description>
      <author>keith@totalemphasis.com (Keith O'Brien)</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Keith O'Brien — Writing</title>
    <link>${SITE_URL}/writing</link>
    <atom:link href="${SITE_URL}/writing/feed.xml" rel="self" type="application/rss+xml" />
    <description>Essays and notes by Keith O'Brien on content strategy, ghostwriting, software side-projects, and the work of running an independent practice.</description>
    <language>en-US</language>
    <managingEditor>keith@totalemphasis.com (Keith O'Brien)</managingEditor>
    <webMaster>keith@totalemphasis.com (Keith O'Brien)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
