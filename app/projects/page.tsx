import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { IndexTable } from "@/components/index-table";
import { projects } from "@/lib/projects";
import { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · Keith O'Brien",
    description:
      "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    title: "Projects · Keith O'Brien",
    description:
      "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
  },
};

function projectLink(project: Project) {
  if (!project.url && !project.repo) return "";
  return (
    <span className="inline-flex gap-3 justify-end">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
          aria-label={`${project.name} (opens in new window)`}
        >
          Live
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
          aria-label={`${project.name} source code (opens in new window)`}
        >
          Code
        </a>
      )}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <>
      {/* Title + intro */}
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// what I build on the side"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Projects
        </h1>
        <p className="mt-[34px] text-[14.5px] leading-[1.95] text-[var(--color-body)] max-w-[580px]">
          Software, newsletters, and other things I build and run outside the
          content strategy work. Most started as one-night experiments. A few
          became things I use every day.
        </p>
      </Container>

      <Section label="Everything">
        <IndexTable
          columns={[
            { label: "#", className: "w-11", accent: true },
            { label: "PROJECT", className: "flex-1 pr-4" },
            { label: "STACK", className: "w-[170px] pr-4" },
            { label: "", className: "w-[90px] text-right" },
          ]}
          rows={projects.map((project, i) => ({
            cells: [
              String(i + 1).padStart(2, "0"),
              <span key="t" className="flex flex-col gap-[6px]">
                <span className="text-[var(--color-fg)] font-medium">
                  {project.name}
                </span>
                <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
                  {project.description}
                </span>
              </span>,
              project.stack.join(" · "),
              projectLink(project),
            ],
          }))}
        />
      </Section>
    </>
  );
}
