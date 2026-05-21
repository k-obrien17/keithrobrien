import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/writing";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.meta.draft) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/writing" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
        ← Writing
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-[var(--color-fg)] leading-tight">{post.meta.title}</h1>
      <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
        {post.meta.date} · {post.meta.readingTime}
      </p>
      <div className="prose mt-8 text-[var(--color-body)]">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
