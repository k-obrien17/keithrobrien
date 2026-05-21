import Link from "next/link";
import { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg text-[var(--color-fg)]">{project.name}</h3>
        <span className="font-mono text-xs text-[var(--color-muted)]">
          {project.stack.join(" · ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--color-body)]">{project.description}</p>
      {(project.url || project.repo) && (
        <div className="mt-3 flex gap-4 text-sm">
          {project.url && (
            <Link href={project.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
              Live →
            </Link>
          )}
          {project.repo && (
            <Link href={project.repo} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
              Code →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
