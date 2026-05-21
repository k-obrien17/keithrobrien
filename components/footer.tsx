import Link from "next/link";

const LINKS = [
  { href: "https://www.totalemphasis.com", label: "Total Emphasis" },
  { href: "https://github.com/k-obrien17", label: "GitHub" },
  { href: "https://www.linkedin.com/in/keithrobrien", label: "LinkedIn" },
  { href: "mailto:keith@totalemphasis.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} Keith R. O&apos;Brien
        </p>
        <ul className="flex flex-wrap gap-5 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
