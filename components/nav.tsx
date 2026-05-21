"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-[var(--color-border)]">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-xl text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
        >
          Keith R. O&apos;Brien
        </Link>
        <ul className="flex gap-6 text-sm">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
