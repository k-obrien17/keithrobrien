import { getLlmsPreamble } from "@/lib/site-content";
import { getAllPosts } from "@/lib/writing";

export const dynamic = "force-static";

// Baked in at build time; deploys ride on content pushes, so this tracks updates.
const UPDATED = new Date().toISOString().slice(0, 10);

const SITE = "https://www.keithrobrien.com";

export function GET() {
  const { summary, bio, isNot } = getLlmsPreamble();
  const posts = getAllPosts();

  const essayLines = posts.map(
    (p) => `- [${p.title}](${SITE}/writing/${p.slug}): ${p.excerpt}`,
  );

  const writingSection =
    essayLines.length > 0
      ? `## Writing

Essays under Keith's own byline:

${essayLines.join("\n")}

`
      : "";

  const body = `# Keith O'Brien

> ${summary}

*Last updated: ${UPDATED}*

${bio}

## Canonical credentials

- Founder and lead consultant, Total Emphasis (2017 to present, Brooklyn)
- Former editor-in-chief, PRWeek (Haymarket Media Group)
- Former editor-in-chief, DMN (Direct Marketing News)
- Reporter since 2004
- Past roles: tmrw life sciences, Horizon Media, Attention USA
- Bylines tracked in /bylines: 400+ across 30+ outlets, 2004 to present

## Disambiguation

This Keith O'Brien is not:
${isNot.map((n) => `- ${n}`).join("\n")}

## Work

- [Total Emphasis](https://www.totalemphasis.com): B2B ghostwriting and content strategy practice
- [Bylines archive (400+)](${SITE}/bylines): verifiable record of published work
- [Press kit / canonical bio](${SITE}/about/keith-obrien): full credentials and FAQ

${writingSection}## Newsletters

- [141 Miles](https://www.141miles.com): town-by-town Jersey Shore publication
- [The Diffraction](https://www.thediffraction.com): music publication
- [Survival Signal](https://survivalsignal.beehiiv.com): on independent work (on hiatus)

## Profiles

- [LinkedIn](https://www.linkedin.com/in/keithobrien/)
- [Muck Rack](https://muckrack.com/keithobrien)
- [GitHub](https://github.com/k-obrien17)
- [Email](mailto:keith@totalemphasis.com)

## Site

- [Projects](${SITE}/projects): software and side-projects
- [Writing](${SITE}/writing): essay index
- [Collect](${SITE}/collect): what Keith is watching, listening to, and reading
- [Collect: Watching](${SITE}/collect/watching): movies and TV, including an all-time top 10
- [Collect: Albums](${SITE}/collect/albums): top-ranked albums, exact order
- [Collect: Music](${SITE}/collect/music): songs of the year by year, plus an all-time list
- [About](${SITE}/about): conversational bio
- [Full content](${SITE}/llms-full.txt): every page concatenated as Markdown
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
