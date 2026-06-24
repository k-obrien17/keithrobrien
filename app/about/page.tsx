import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FadeIn } from "@/components/fade-in";
import { getAbout } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
  },
};

export default function AboutPage() {
  const about = getAbout();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-8">About</h1>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.bio} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Newsletters
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.newsletters} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Previously
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.previously} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Outside of work
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.outsideOfWork} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Elsewhere
        </h2>
        <ul className="flex flex-wrap gap-5">
          {about.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
