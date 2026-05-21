import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "About",
  description: "About Keith R. O'Brien — ghostwriter, builder, writer.",
};

const LINKS = [
  { href: "https://www.totalemphasis.com", label: "Total Emphasis" },
  { href: "https://github.com/k-obrien17", label: "GitHub" },
  { href: "https://www.linkedin.com/in/keithrobrien", label: "LinkedIn" },
  { href: "mailto:keith@totalemphasis.com", label: "keith@totalemphasis.com" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-8">About</h1>
        <div className="prose text-[var(--color-body)]">
          <p>
            I&apos;m Keith R. O&apos;Brien. I run Total Emphasis, a B2B
            ghostwriting practice, where I help executives turn their thinking
            into bylines, posts, and thought leadership.
          </p>
          <p>
            Outside the business, I build software: tools for my own workflows,
            a few things for fun, and the occasional thing that turns into a real
            product. This site is where that work lives.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          What I do
        </h2>
        <ul className="space-y-2 text-[var(--color-body)]">
          <li>Ghostwriting and content strategy for B2B executives</li>
          <li>Building developer tools, MCP servers, and desktop apps</li>
          <li>Writing about the craft of both</li>
        </ul>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Elsewhere
        </h2>
        <ul className="flex flex-wrap gap-5">
          {LINKS.map((link) => (
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
