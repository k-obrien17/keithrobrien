import type { ReactNode } from "react";

/**
 * Two-column section from the minimal design system: a fixed 150px uppercase
 * label column + a flexible content column, gap 48px, separated by a 1px top
 * border with vertical padding. Collapses to a single column on mobile.
 *
 * Pass `label` as the section name and an optional `id` for in-page anchors
 * (gets scroll-margin so the sticky nav doesn't overlap).
 */
export function Section({
  label,
  id,
  children,
  className = "",
}: {
  label: ReactNode;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      style={id ? { scrollMarginTop: "80px" } : undefined}
      className="border-t border-[var(--color-border)]"
    >
      <div
        className={`max-w-[940px] mx-auto px-8 py-14 grid grid-cols-1 gap-6 md:grid-cols-[150px_1fr] md:gap-12 ${className}`}
      >
        <h2 className="text-[11.5px] uppercase tracking-[0.1em] text-[var(--color-faint)] leading-[1.5] font-normal">
          {label}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
