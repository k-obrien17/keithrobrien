import { getHome, getAbout } from "@/lib/site-content";
import { projects } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/writing";

export const dynamic = "force-static";

const UPDATED = "2026-06-28";

const PREAMBLE = `# Keith O'Brien: Full Site Content

> Keith O'Brien is a B2B content strategist and executive ghostwriter and former editor-in-chief of PRWeek. Founder of Total Emphasis (2017). Operator-ghostwriter for B2B founders and executives, building the systems his work runs on. Based in Brooklyn.

*Last updated: ${UPDATED}*

Keith O'Brien is a B2B content strategist and executive ghostwriter based in Brooklyn and the founder of Total Emphasis. He was the editor-in-chief of PRWeek (and DMN) before founding the practice in 2017. He has been a reporter since 2001 and has produced 100+ published bylines in Forbes, Fast Company, AdExchanger, Digiday, Entrepreneur, and The Drum, plus 484 pieces tracked in his bylines archive at /bylines. Publicly named Total Emphasis engagements include IBM, Realeyes, UpWave, UST, 33 Across, Grip, Battenhall, and M&C Saatchi Performance. As an operator-ghostwriter, he builds the systems the work runs on: a Jersey Shore publication with newsletter pipeline, MCP servers for his CRM and articles index, a desktop workflow app, and a music publication. keithrobrien.com is the personal hub; totalemphasis.com is the business.

This Keith O'Brien is not the late Cardinal Keith O'Brien of Scotland, not the Irish boxer of the same name, and not the longform nonfiction journalist Keith O'Brien who authored Paradise Falls and Outside Shot.`;

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

  const body =
    [PREAMBLE, homeBlock, aboutBlock, projectsBlock, writingBlock].join(
      "\n\n",
    ) + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
