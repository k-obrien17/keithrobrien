import type { ReactNode } from "react";

/**
 * Neutralized: the Total Emphasis design system uses no entrance animations.
 * This is now a pass-through wrapper so existing usages keep working but render
 * their children immediately, with no fade/translate. Hover fades on links and
 * rows are handled per-component.
 */
export function FadeIn({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
