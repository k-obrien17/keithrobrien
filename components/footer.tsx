import Link from "next/link";

// Full-bleed dark contact footer (Total Emphasis design system).
const EMAIL = "keith@totalemphasis.com";

const LINKS = [
  { href: "https://www.totalemphasis.com", label: "total emphasis", external: true },
  { href: "https://www.141miles.com", label: "141 miles", external: true },
  { href: "/bylines", label: "bylines", external: false },
  { href: "https://muckrack.com/keithobrien", label: "muck rack", external: true },
  { href: "https://github.com/k-obrien17", label: "github", external: true },
  { href: "https://www.linkedin.com/in/keithobrien/", label: "linkedin", external: true },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      style={{ scrollMarginTop: "80px" }}
      className="mt-auto bg-[var(--color-dark-bg)] text-[var(--color-dark-fg)]"
    >
      <div className="max-w-[940px] mx-auto px-8 py-24">
        <div className="text-[12.5px] tracking-[0.04em] text-[var(--color-dark-accent)] mb-6">
          {"// say hi"}
        </div>
        <h2 className="text-[30px] leading-[1.45] font-medium tracking-[-0.015em] max-w-[700px]">
          Building something, reading something, or just want to talk shop?
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-[14px]">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-[13px] px-[22px] py-[13px] bg-[var(--color-accent)] text-white transition-opacity hover:opacity-90"
          >
            &rarr; {EMAIL}
          </a>
        </div>

        {/* Footer rule row */}
        <div className="mt-24 pt-6 border-t border-[var(--color-dark-rule)] flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between text-[11.5px] text-[var(--color-dark-faint)]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span>&copy; {year} Keith O&apos;Brien</span>
            {LINKS.map((link) => (
              <span key={link.href} className="flex items-baseline gap-x-3">
                <span aria-hidden="true">&middot;</span>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-55"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="transition-opacity hover:opacity-55"
                  >
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
          <span>operator-ghostwriter &middot; software &middot; newsletters</span>
        </div>
      </div>
    </footer>
  );
}
