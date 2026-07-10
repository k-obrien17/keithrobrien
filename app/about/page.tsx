import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { getAbout } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Keith O'Brien is the founder and operator of Total Emphasis, a B2B content strategy practice. Previously: tmrw life sciences, Haymarket, Horizon, Attention USA.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien is the founder and operator of Total Emphasis, a B2B content strategy practice. Previously: tmrw life sciences, Haymarket, Horizon, Attention USA.",
    url: "/about",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien is the founder and operator of Total Emphasis, a B2B content strategy practice. Previously: tmrw life sciences, Haymarket, Horizon, Attention USA.",
  },
};

export default function AboutPage() {
  const about = getAbout();
  return (
    <>
      {/* Intro */}
      <Container className="pt-[104px] pb-[64px]">
        <p className="text-[12.5px] text-[var(--color-accent)] tracking-[0.04em] mb-7">
          {"// about"}
        </p>
        <h1 className="text-[34px] leading-[1.42] font-medium tracking-[-0.015em] max-w-[760px] text-[var(--color-fg)]">
          About
        </h1>
        <div className="prose mt-[34px]">
          <MDXRemote source={about.bio} />
        </div>
      </Container>

      <Section label="Newsletters">
        <div className="prose">
          <MDXRemote source={about.newsletters} />
        </div>
      </Section>

      <Section label="Previously">
        <div className="prose">
          <MDXRemote source={about.previously} />
        </div>
      </Section>

      <Section
        label={
          <>
            Outside
            <br />
            of work
          </>
        }
      >
        <div className="prose">
          <MDXRemote source={about.outsideOfWork} />
        </div>
      </Section>

      <Section label="Elsewhere">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {about.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] text-[var(--color-accent)] transition-opacity hover:opacity-55"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
