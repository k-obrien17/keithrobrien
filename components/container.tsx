import type { ReactNode } from "react";

/**
 * Centered content column for the minimal design system.
 * max-width 940px, 32px horizontal padding (Total Emphasis design system).
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[940px] mx-auto px-8 ${className}`}>{children}</div>
  );
}
