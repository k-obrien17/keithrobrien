import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { projectsByStatus } from "@/lib/projects";
import type { ProjectStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software Keith R. O'Brien builds on the side.",
};

const GROUPS: { status: ProjectStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "maintained", label: "Maintained" },
  { status: "dormant", label: "Dormant" },
];

export default function ProjectsPage() {
  const grouped = projectsByStatus();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-10">Projects</h1>
      <div className="space-y-14">
        {GROUPS.map(({ status, label }) =>
          grouped[status].length > 0 ? (
            <section key={status}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-5">
                {label}
              </h2>
              <div className="stagger grid gap-4 sm:grid-cols-2">
                {grouped[status].map((p) => (
                  <FadeIn key={p.slug}>
                    <ProjectCard project={p} />
                  </FadeIn>
                ))}
              </div>
            </section>
          ) : null
        )}
      </div>
    </div>
  );
}
