import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { getNow } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What Keith O'Brien is currently building, running, and shipping. Updated when the work changes, not on a schedule.",
  alternates: { canonical: "/now" },
  openGraph: {
    title: "Now · Keith O'Brien",
    description:
      "What Keith O'Brien is currently building, running, and shipping. Updated when the work changes, not on a schedule.",
    url: "/now",
    type: "website",
  },
  twitter: {
    title: "Now · Keith O'Brien",
    description:
      "What Keith O'Brien is currently building, running, and shipping. Updated when the work changes, not on a schedule.",
  },
};

export default function NowPage() {
  const now = getNow();
  return (
    <>
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// what I'm doing right now"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          Now
        </h1>
        <p className="mt-3 text-[12px] text-[var(--color-muted)]">
          Last updated {now.updated}
        </p>
        <div className="prose mt-[34px]">
          <MDXRemote source={now.intro} />
        </div>
      </Container>

      <Section label="Building">
        <div className="prose">
          <MDXRemote source={now.building} />
        </div>
      </Section>

      <Section label="Running">
        <div className="prose">
          <MDXRemote source={now.running} />
        </div>
      </Section>

      <Section label="Elsewhere">
        <div className="prose">
          <MDXRemote source={now.elsewhere} />
        </div>
      </Section>
    </>
  );
}
