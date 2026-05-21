import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "About",
  description:
    "Keith R. O'Brien — content strategist, founder of Total Emphasis, big idea tinkerer.",
};

const LINKS = [
  { href: "https://www.totalemphasis.com", label: "Total Emphasis" },
  { href: "https://www.141miles.com", label: "141 Miles" },
  { href: "https://www.thediffraction.com", label: "The Diffraction" },
  { href: "https://survivalsignal.beehiiv.com", label: "Survival Signal" },
  { href: "https://www.linkedin.com/in/keithobrien/", label: "LinkedIn" },
  { href: "mailto:keith@totalemphasis.com", label: "keith@totalemphasis.com" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-8">About</h1>
        <div className="prose text-[var(--color-body)]">
          <p>
            I&apos;m the founder and head consultant at Total Emphasis, a content
            strategy firm. I specialize in creating and executing large content
            strategy projects and ghostwriting for executives in multiple
            industries.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Newsletters
        </h2>
        <div className="prose text-[var(--color-body)]">
          <p>
            I run several newsletters:{" "}
            <Link
              href="https://www.141miles.com"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              141 Miles
            </Link>
            , a publication about the Jersey Shore, and{" "}
            <Link
              href="https://www.thediffraction.com"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              The Diffraction
            </Link>
            , a music publication. On hiatus:{" "}
            <Link
              href="https://survivalsignal.beehiiv.com"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Survival Signal
            </Link>
            , a newsletter about how to be an independent worker.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Previously
        </h2>
        <div className="prose text-[var(--color-body)]">
          <p>
            I&apos;ve held roles at tmrw life sciences, Haymarket Media, Horizon
            Media, and Attention USA.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Outside of work
        </h2>
        <div className="prose text-[var(--color-body)]">
          <p>
            I&apos;m an avid learner: I read and cook a lot, and I&apos;m trying
            very hard to remain on the soccer pitch and lower my golf handicap.
          </p>
        </div>
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
