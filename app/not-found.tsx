import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[940px] mx-auto px-8 py-32 text-center">
      <h1 className="text-[48px] font-medium tracking-[-0.015em] text-[var(--color-fg)]">
        404
      </h1>
      <p className="mt-4 text-[13.5px] text-[var(--color-muted)]">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[12.5px] text-[var(--color-accent)] transition-opacity hover:opacity-55"
      >
        &larr; home
      </Link>
    </div>
  );
}
