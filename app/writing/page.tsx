import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { getAllPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes by Keith O'Brien.",
};

export default function WritingIndex() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-10">Writing</h1>
      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">Nothing published yet.</p>
      ) : (
        <ul className="stagger space-y-8">
          {posts.map((post) => (
            <FadeIn key={post.slug}>
              <li>
                <Link href={`/writing/${post.slug}`} className="group block">
                  <h2 className="font-serif text-2xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                    {post.date} · {post.readingTime}
                  </p>
                  <p className="mt-2 text-[var(--color-body)]">{post.excerpt}</p>
                </Link>
              </li>
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}
