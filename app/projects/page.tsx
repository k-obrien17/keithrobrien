import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { IndexTable } from "@/components/index-table";
import { projects } from "@/lib/projects";
import { Project, ProjectGroup } from "@/lib/types";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Builds · Keith O'Brien",
    description:
      "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    title: "Builds · Keith O'Brien",
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

const GROUPS: {
  key: ProjectGroup;
  label: string;
  intro: string;
}[] = [
  {
    key: "public",
    label: "Public",
    intro: "Projects and publications meant to be found by people outside the workshop.",
  },
  {
    key: "practice",
    label: "Practice",
    intro: "Infrastructure for Total Emphasis and the client-writing operation.",
  },
  {
    key: "knowledge",
    label: "Knowledge",
    intro: "Search, archive, logging, and agent tools that make the working system usable.",
  },
];

function displayName(project: Project) {
  return project.publicName ?? project.name;
}

function projectRows(group: ProjectGroup) {
  return projects
    .filter((project) => project.group === group)
    .map((project, i) => ({
      cells: [
        String(i + 1).padStart(2, "0"),
        <span key="t" className="flex flex-col gap-[6px]">
          <span className="text-[var(--color-fg)] font-medium">
            {displayName(project)}
          </span>
          <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
            {project.description}
          </span>
        </span>,
        project.stack.join(" · "),
        projectLink(project),
      ],
    }));
}

const SITE_URL = "https://www.keithrobrien.com";
const PAGE_URL = `${SITE_URL}/projects`;

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#collectionpage`,
    url: PAGE_URL,
    name: "Builds · Keith O'Brien",
    description:
      "Software, MCP servers, newsletters, and tools Keith O'Brien builds and ships in service of Total Emphasis and as standalone projects across the practice.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: projects.filter((p) => p.url).map((p) => ({
      "@type": "SoftwareApplication",
      name: displayName(p),
      description: p.description,
      url: p.url,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      author: { "@id": `${SITE_URL}/#person` },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Title + intro */}
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// what I build on the side"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Builds
        </h1>
        <p className="mt-[34px] text-[14.5px] leading-[1.95] text-[var(--color-body)] max-w-[580px]">
          Software, newsletters, systems, and experiments. Some are public
          projects; some are private infrastructure for the writing practice.
        </p>
      </Container>

      {GROUPS.map((group) => (
        <Section key={group.key} label={group.label}>
          <p className="mb-7 max-w-[580px] text-[13.5px] leading-[1.8] text-[var(--color-muted)]">
            {group.intro}
          </p>
          <IndexTable
            columns={[
              { label: "#", className: "w-11", accent: true },
              { label: "BUILD", className: "min-w-0 flex-1 pr-4" },
              {
                label: "STACK",
                className: "hidden w-[170px] pr-4 sm:block",
              },
              { label: "", className: "w-[64px] text-right sm:w-[90px]" },
            ]}
            rows={projectRows(group.key)}
          />
        </Section>
      ))}
    </>
  );
}
