import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software, newsletters, and other things Keith O'Brien builds on the side.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · Keith O'Brien",
    description: "Software, newsletters, and other things Keith O'Brien builds on the side.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    title: "Projects · Keith O'Brien",
    description: "Software, newsletters, and other things Keith O'Brien builds on the side.",
  },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-10">Projects</h1>
      <div className="stagger grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <FadeIn key={p.slug}>
            <ProjectCard project={p} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
