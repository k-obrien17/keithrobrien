import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { featuredProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/writing";

const FACETS = [
  { href: "https://www.totalemphasis.com", label: "Total Emphasis", desc: "B2B ghostwriting practice", external: true },
  { href: "/projects", label: "Projects", desc: "Software I build on the side" },
  { href: "/writing", label: "Writing", desc: "Essays and thinking" },
  { href: "/about", label: "About", desc: "Who I am, how to reach me" },
];

export default function Home() {
  const featured = featuredProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-20 sm:py-28">
        <FadeIn>
          <h1 className="font-serif text-5xl sm:text-6xl leading-tight text-[var(--color-fg)]">
            Keith R. O&apos;Brien
          </h1>
          <p className="mt-6 text-xl text-[var(--color-body)]">
            I run <span className="text-[var(--color-accent)]">Total Emphasis</span>, a B2B ghostwriting practice, and build software on the side.
          </p>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">
            This is the personal corner: the projects, the writing, and the rest of what I&apos;m working on.
          </p>
        </FadeIn>
      </section>

      <section className="stagger grid gap-4 sm:grid-cols-2 pb-20">
        {FACETS.map((f) => (
          <FadeIn key={f.href}>
            <Link
              href={f.href}
              {...(f.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 hover:border-[var(--color-accent)] transition-colors"
            >
              <h2 className="font-serif text-2xl text-[var(--color-fg)]">{f.label}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{f.desc}</p>
            </Link>
          </FadeIn>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="pb-20">
          <h2 className="font-serif text-3xl text-[var(--color-fg)] mb-6">Featured projects</h2>
          <ul className="space-y-4">
            {featured.map((p) => (
              <li key={p.slug} className="border-b border-[var(--color-border)] pb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[var(--color-fg)]">{p.name}</span>
                  <span className="font-mono text-xs text-[var(--color-muted)]">{p.stack.join(" · ")}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{p.description}</p>
              </li>
            ))}
          </ul>
          <Link href="/projects" className="mt-6 inline-block text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            All projects →
          </Link>
        </section>
      )}

      {posts.length > 0 && (
        <section className="pb-20">
          <h2 className="font-serif text-3xl text-[var(--color-fg)] mb-6">Latest writing</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}`} className="group block">
                  <span className="text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">{post.title}</span>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
