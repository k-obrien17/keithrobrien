import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-serif text-5xl text-[var(--color-fg)]">404</h1>
      <p className="mt-4 text-[var(--color-muted)]">This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 inline-block text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
        ← Home
      </Link>
    </div>
  );
}
