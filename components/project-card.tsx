import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/types";

// Square, mono project card (Total Emphasis design system). The projects index
// uses IndexTable; this card stays available for any standalone use. The
// optional `image` renders a real screenshot above the text (homepage feature
// cards) — omit it for the plain text-only card used elsewhere.
export function ProjectCard({
  project,
  image,
}: {
  project: Project;
  image?: { src: string; alt: string };
}) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
      {image && (
        <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden border border-[var(--color-border)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 420px, 100vw"
          />
        </div>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[14px] font-medium text-[var(--color-fg)]">
          {project.publicName ?? project.name}
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
