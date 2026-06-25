import Link from "next/link";
import { Project } from "@/lib/types";

// Square, mono project card (Total Emphasis design system). The projects index
// uses IndexTable; this card stays available for any standalone use.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[14px] font-medium text-[var(--color-fg)]">
          {project.name}
        </h3>
        <span className="text-[11.5px] text-[var(--color-muted)]">
          {project.stack.join(" · ")}
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-[1.8] text-[var(--color-body)]">
        {project.description}
      </p>
      {(project.url || project.repo) && (
        <div className="mt-3 flex gap-4 text-[12.5px]">
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
            >
              Live &rarr;
            </Link>
          )}
          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
            >
              Code &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
