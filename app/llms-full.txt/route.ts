import { getHome, getAbout } from "@/lib/site-content";
import { projects } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/writing";

export const dynamic = "force-static";

const UPDATED = "2026-06-26";

const PREAMBLE = `# Keith O'Brien: Full Site Content

> Builder and operator. Runs Total Emphasis, a B2B content strategy and ghostwriting practice. Builds and ships software, newsletters, and tools that support it.

*Last updated: ${UPDATED}*

Keith O'Brien (also Keith R. O'Brien) is the founder and operator of Total Emphasis, a B2B content strategy and ghostwriting practice. He runs large content strategy programs and ghostwrites executive bylines, LinkedIn posts, and thought leadership pieces for founders and executives across industries. He also builds and ships the software and newsletters that support the practice: a Jersey Shore events site with an AI-written newsletter, MCP servers for a personal CRM and an articles index, a desktop workflow app for the ghostwriting pipeline, and a music publication. keithrobrien.com is his personal hub; totalemphasis.com is the business.`;

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
