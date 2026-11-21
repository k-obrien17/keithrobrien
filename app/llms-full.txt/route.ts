import { getHome, getAbout, getLlmsPreamble } from "@/lib/site-content";
import { projects } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/writing";
import watching from "@/content/collect/watching.json";
import albums from "@/content/collect/albums.json";
import albumOfYear from "@/content/collect/album-of-year.json";

export const dynamic = "force-static";

// Baked in at build time; deploys ride on content pushes, so this tracks updates.
const UPDATED = new Date().toISOString().slice(0, 10);

const llms = getLlmsPreamble();

const PREAMBLE = `# Keith O'Brien: Full Site Content

> ${llms.summary}

*Last updated: ${UPDATED}*

${llms.bio}

This Keith O'Brien is not:
${llms.isNot.map((n) => `- ${n}`).join("\n")}`;

export function GET() {
  const home = getHome();
  const about = getAbout();
  const posts = getAllPosts();

  const homeIntro = `${home.introPrefix}${home.introHighlight}${home.introSuffix}`;

  const homeBlock = `## Home

${home.name}. ${home.tagline}.

${homeIntro}

${home.secondary}`;

  const aboutBlock = `## About

${about.bio}

### Newsletters

${about.newsletters}

### Previously

${about.previously}

### Outside of work

${about.outsideOfWork}

### Elsewhere

${about.links.map((l) => `- [${l.label}](${l.href})`).join("\n")}`;

  const projectLines = projects.map((p) => {
    const link = p.url ? ` ([${p.url}](${p.url}))` : "";
    return `- **${p.name}**${link} (${p.stack.join(", ")}): ${p.description}`;
  });

  const projectsBlock = `## Projects

${projectLines.join("\n")}`;

  const postBlocks = posts.map((meta) => {
    const full = getPost(meta.slug);
    return `### ${meta.title}

*${meta.date} · ${meta.readingTime}*

${meta.excerpt}

${(full?.content ?? "").trim()}`;
  });

  const writingBlock = `## Writing

${
  postBlocks.length > 0
    ? postBlocks.join("\n\n")
    : "_No published posts yet._"
}`;

  const topMovies = (watching.top_movies ?? [])
    .map((f: { title: string; year: number; score: number }, i: number) => `${i + 1}. ${f.title} (${f.year}) — ${f.score}`)
    .join("\n");

  const topTv = (watching.top_tv ?? [])
    .map((f: { title: string; year: number; score: number }, i: number) => `${i + 1}. ${f.title} (${f.year}) — ${f.score}`)
    .join("\n");

  const topAlbums = (albums.top_albums ?? [])
    .slice(0, 10)
    .map((a: { title: string; artist: string; year: number; score: number }, i: number) => `${i + 1}. ${a.artist}, *${a.title}* (${a.year}) — ${a.score}`)
    .join("\n");

  const aoty = Object.entries(albumOfYear.by_year ?? {})
    .sort(([a], [b]) => Number(b) - Number(a))
    .slice(0, 10)
    .map(([y, a]: [string, { title: string; artist: string; score: number }]) => `- ${y}: ${a.artist}, *${a.title}* (${a.score})`)
    .join("\n");

  const collectBlock = `## Collect

What Keith is watching, listening to, and reading. Curated personal rankings, not algorithmic.

### Top 10 Films of All Time

${topMovies}

### Top 10 TV Series of All Time

${topTv}

### Top 10 Albums of All Time

${topAlbums}

### Album of the Year (most recent 10)

${aoty}

Best-of-year playlists (25 songs per year) run from 1979 to 2025 at /collect/music. Per-year film and TV rankings at /collect/watching.`;

  const body =
    [PREAMBLE, homeBlock, aboutBlock, projectsBlock, writingBlock, collectBlock].join(
      "\n\n",
    ) + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
