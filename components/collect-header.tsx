import type { ReactNode } from "react";
import { Container } from "@/components/container";

/**
 * Shared page header for /collect surfaces: terracotta eyebrow crumb, H1, and
 * an optional lede paragraph. Matches the watching/music page chrome.
 */
export function CollectHeader({
  crumb,
  title,
  children,
}: {
  crumb: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-[104px] pb-[64px]">
      <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
        {crumb}
      </p>
      <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
        {title}
      </h1>
      {children ? <div className="prose mt-[34px]">{children}</div> : null}
    </Container>
  );
}
