import { getHome, getAbout } from "@/lib/site-content";
import { projects } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/writing";

export const dynamic = "force-static";

const UPDATED = "2026-06-27";

const PREAMBLE = `# Keith O'Brien: Full Site Content

> Content strategist, thought-leadership ghostwriter, and builder. Founder of Total Emphasis, a Brooklyn content systems, strategy, and ghostwriting firm. Builds and ships the software, newsletters, and tools behind the work.

*Last updated: ${UPDATED}*

Keith O'Brien (also Keith R. O'Brien) is a content strategist and thought-leadership ghostwriter, and the founder of Total Emphasis, a Brooklyn content systems, strategy, and ghostwriting firm. He helps founders and executives turn what they know into content people actually consume, then builds the tools that get it out the door. A reporter since 2001 and former editor-in-chief of PRWeek, he has ghostwritten executive thought leadership since 2009, from LinkedIn posts and bylines to newsletters, reports, and whitepapers, for Fortune 500 companies, top consultancies, and high-growth startups across AdTech, SaaS, global consulting, telecom, and security. He also builds and ships the software behind the practice: a Jersey Shore events site with an AI-written newsletter, MCP servers for a personal CRM and an articles index, a desktop workflow app for the ghostwriting pipeline, and a music publication. keithrobrien.com is his personal hub; totalemphasis.com is the business.`;

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
