import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { PostMeta } from "./types";

const WRITING_DIR = path.join(process.cwd(), "content/writing");

function toMeta(slug: string, raw: string): { meta: PostMeta; content: string } {
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      readingTime: readingTime(content).text,
      draft: data.draft ?? false,
    },
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => toMeta(f.replace(/\.mdx$/, ""), fs.readFileSync(path.join(WRITING_DIR, f), "utf8")).meta)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  const file = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return toMeta(slug, fs.readFileSync(file, "utf8"));
}
