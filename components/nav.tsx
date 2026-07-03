"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Minimal mono nav (Total Emphasis design system). Sticky, translucent, links
// fade on hover. Verb lane on the left; the Total Emphasis proprietorship and
// "say hi" mailto sit in the right-side slot. URL slugs stay put (/writing,
// /projects) while labels read as verbs, so no live URLs move.
const LINKS = [
  { href: "/writing", label: "write" },
  { href: "/projects", label: "build" },
  { href: "/collect", label: "collect" },
  { href: "/about", label: "about" },
];

const EMAIL = "keith@totalemphasis.com";
const TE_URL = "https://totalemphasis.com";

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/[0.88] backdrop-blur-[8px]">
      <nav className="max-w-[940px] mx-auto px-8 py-5 flex items-baseline justify-between">
        <Link
          href="/"
          className="text-[13.5px] font-semibold text-[var(--color-fg)] transition-opacity hover:opacity-55"
        >
          keith o&apos;brien
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-baseline gap-[26px] text-[12.5px]">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-opacity hover:opacity-55 ${
                isActive(link.href)
                  ? "text-[var(--color-fg)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={TE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-muted)] transition-opacity hover:opacity-55"
          >
            total emphasis <span aria-hidden="true">↗</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
          >
            say hi
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? "close" : "menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--color-border)]">
          <div className="max-w-[940px] mx-auto px-8 py-4 flex flex-col gap-3 text-[13.5px]">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-opacity hover:opacity-55 ${
                  isActive(link.href)
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={TE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-muted)] transition-opacity hover:opacity-55"
            >
              total emphasis <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
            >
              say hi
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
