# keithrobrien.com Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build keithrobrien.com, a warm-dark editorial personal brand hub (Home, Projects, Writing, About) on Next.js 16 + Tailwind 4, deployed to Vercel.

**Architecture:** Static-first App Router site. No DB, no API routes, no auth. Projects are a curated typed list (`lib/projects.ts`); writing is MDX files (`content/writing/`) loaded at build time. Design DNA (type pairing, spacing, animations, prose) is borrowed from the portfolio repo but the palette is a warm-dark inversion.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Instrument Serif + DM Sans + Geist Mono (next/font/google), gray-matter, reading-time, next-mdx-remote.

**Verification model:** No unit-test suite (matches Keith's conventions: static design site, tests only on explicit ask). Each task is verified by `npm run build` (must compile), `npm run lint` (must pass), and a dev-server visual check where noted.

---

## File Structure

```
app/
  layout.tsx            # MODIFY: fonts (Instrument Serif/DM Sans/Geist Mono), Nav, Footer, metadata
  globals.css           # MODIFY: warm-dark tokens, base styles, animations, prose
  page.tsx              # MODIFY: Home (hub)
  projects/page.tsx     # CREATE: Projects index, grouped by status
  writing/page.tsx      # CREATE: Writing index
  writing/[slug]/page.tsx  # CREATE: Single post (MDX)
  about/page.tsx        # CREATE: About / resume / links
  not-found.tsx         # CREATE: 404
  sitemap.ts            # CREATE: sitemap
  robots.ts             # CREATE: robots
  opengraph-image.tsx   # CREATE: OG image
components/
  nav.tsx               # CREATE: top nav (client, active link)
  footer.tsx            # CREATE: footer with outbound links
  fade-in.tsx           # CREATE: IntersectionObserver scroll animation (client)
  project-card.tsx      # CREATE: single project card
content/
  writing/hello-world.mdx  # CREATE: one sample post
lib/
  types.ts              # CREATE: Project, ProjectStatus, PostMeta
  projects.ts           # CREATE: curated project data
  writing.ts            # CREATE: MDX loader
CLAUDE.md               # MODIFY: replace boilerplate with house-style project doc
```

---

## Task 1: Install content dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install runtime deps**

Run:
```bash
cd ~/Desktop/Claude/Projects/keithrobrien && npm install gray-matter reading-time next-mdx-remote
```
Expected: packages added, no errors.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add content deps (gray-matter, reading-time, next-mdx-remote)"
```

---

## Task 2: Warm-dark design system

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with the warm-dark token set**

Replace the entire contents of `app/globals.css` with:

```css
@import "tailwindcss";

/* ==========================================================================
   Design Tokens — Warm dark editorial palette
   ========================================================================== */

:root {
  --color-bg: #14120E;
  --color-bg-alt: #1E1B15;
  --color-fg: #F5F1E8;
  --color-body: #C7C1B3;
  --color-muted: #8A8475;
  --color-border: #2C281F;
  --color-accent: #E8843C;
  --color-accent-hover: #F2965A;
  --color-accent-light: #2A2018;

  --color-background: var(--color-bg);
  --color-foreground: var(--color-fg);

  --font-serif: var(--font-instrument-serif), Georgia, serif;
  --font-sans: var(--font-dm-sans), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;

  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}

@theme inline {
  --color-bg: var(--color-bg);
  --color-bg-alt: var(--color-bg-alt);
  --color-fg: var(--color-fg);
  --color-body: var(--color-body);
  --color-muted: var(--color-muted);
  --color-border: var(--color-border);
  --color-accent: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
}

/* ==========================================================================
   Base Styles
   ========================================================================== */

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-body);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 { color: var(--color-fg); }

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
:focus:not(:focus-visible) { outline: none; }

::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* ==========================================================================
   Scroll-triggered entrance animations
   ========================================================================== */

.fade-in-up {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
.stagger.visible > .fade-in-up {
  opacity: 1;
  transform: translateY(0);
}
.stagger > .fade-in-up:nth-child(1) { transition-delay: 0ms; }
.stagger > .fade-in-up:nth-child(2) { transition-delay: 80ms; }
.stagger > .fade-in-up:nth-child(3) { transition-delay: 160ms; }
.stagger > .fade-in-up:nth-child(4) { transition-delay: 240ms; }
.stagger > .fade-in-up:nth-child(5) { transition-delay: 320ms; }
.stagger > .fade-in-up:nth-child(6) { transition-delay: 400ms; }

/* ==========================================================================
   Prose (MDX writing)
   ========================================================================== */

.prose { max-width: 65ch; line-height: 1.75; }
.prose h1 { font-family: var(--font-serif); font-size: 2.5rem; font-weight: 400; margin-bottom: 1rem; line-height: 1.15; }
.prose h2 { font-family: var(--font-serif); font-size: 1.75rem; font-weight: 400; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
.prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.prose p { margin-bottom: 1.25rem; }
.prose a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 2px; transition: opacity var(--transition-fast); }
.prose a:hover { opacity: 0.8; }
.prose ul, .prose ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
.prose li { margin-bottom: 0.5rem; }
.prose code { background: var(--color-bg-alt); padding: 0.125rem 0.375rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-family: var(--font-mono); }
.prose pre { background: #0d0c09; color: #f0ece3; padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; margin-bottom: 1.25rem; border: 1px solid var(--color-border); }
.prose pre code { background: none; padding: 0; color: inherit; }
.prose blockquote { border-left: 3px solid var(--color-accent); padding-left: 1rem; font-style: italic; color: var(--color-muted); margin-bottom: 1.25rem; }
.prose img { border-radius: var(--radius-md); margin: 1.5rem 0; }

/* ==========================================================================
   Utilities
   ========================================================================== */

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles successfully (page.tsx still references old classes but builds; visual fix comes in Task 5).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add warm-dark editorial design tokens"
```

---

## Task 3: Fonts + root layout shell

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

Replace the entire contents of `app/layout.tsx` with (Nav/Footer imports will resolve in Task 4; do Task 4 immediately after so the build is green):

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://keithrobrien.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Keith R. O'Brien",
    template: "%s — Keith R. O'Brien",
  },
  description:
    "Keith R. O'Brien — ghostwriter, builder, writer. Total Emphasis, software side-projects, and essays.",
  openGraph: {
    title: "Keith R. O'Brien",
    description:
      "Ghostwriter, builder, writer. Total Emphasis, software side-projects, and essays.",
    url: SITE_URL,
    siteName: "Keith R. O'Brien",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

(Build deferred to end of Task 4.)

---

## Task 4: Primitives — Nav, Footer, FadeIn

**Files:**
- Create: `components/nav.tsx`, `components/footer.tsx`, `components/fade-in.tsx`

- [ ] **Step 1: Create components/nav.tsx**

```tsx
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
```

- [ ] **Step 2: Create components/footer.tsx**

```tsx
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
```

- [ ] **Step 3: Create components/fade-in.tsx**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-up ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build compiles (Home page.tsx still boilerplate but valid), lint passes.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx components/nav.tsx components/footer.tsx components/fade-in.tsx
git commit -m "feat: add fonts, root layout, nav/footer/fade-in primitives"
```

---

## Task 5: Data layer (types, projects, writing loader, sample post) + Home page

This task builds the full data layer first so the Home page (which reads both projects and posts) builds clean. Writing *pages* come in Task 6.

**Files:**
- Create: `lib/types.ts`, `lib/projects.ts`, `lib/writing.ts`, `content/writing/hello-world.mdx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create lib/types.ts**

```ts
export type ProjectStatus = "active" | "maintained" | "dormant";

export interface Project {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  url?: string;
  repo?: string;
  featured?: boolean;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  draft?: boolean;
}
```

- [ ] **Step 2: Create lib/projects.ts**

Seeded from CLAUDE.md project tables. `url`/`repo` left empty by default; Keith fills public ones. Helper groups by status.

```ts
import { Project, ProjectStatus } from "./types";

export const projects: Project[] = [
  { name: "141 Miles", slug: "141-miles", description: "Jersey Shore events site with an AI-written newsletter.", stack: ["TS", "Next.js", "Drizzle"], status: "maintained", url: "https://www.141miles.com", featured: true },
  { name: "Total Emphasis Workflow", slug: "tew", description: "Desktop project management for the ghostwriting practice.", stack: ["TS", "React", "Tauri 2"], status: "active", featured: true },
  { name: "Ironlog", slug: "ironlog", description: "Obsidian-native fitness tracker: MCP server plus cron scripts.", stack: ["TS", "Node", "MCP"], status: "active", featured: true },
  { name: "Vault Chatbot", slug: "vault-chatbot", description: "CLI chatbot and MCP server over an Obsidian CRM vault.", stack: ["TS", "Tauri 2", "MCP"], status: "active" },
  { name: "Media Library", slug: "media-library", description: "Personal media consumption tracker.", stack: ["TS", "React"], status: "active" },
  { name: "Client Pulse", slug: "client-pulse", description: "Content-fuel pipeline that feeds research to ghostwriting clients.", stack: ["JS", "Node"], status: "active" },
  { name: "World Cup Price Tracker", slug: "wc-price-tracker", description: "Once-a-day SeatPick WC2026 price tracker with an HTML dashboard.", stack: ["TS", "Bun", "SQLite"], status: "active" },
  { name: "Soccer Trivia", slug: "soccer-trivia", description: "Kid-facing Chore Quest and Trivia FC, packaged as a macOS app.", stack: ["Python", "Pygame"], status: "active" },
  { name: "Daily 10", slug: "daily-10", description: "Daily practice app.", stack: ["JS", "React", "Tauri"], status: "active" },
  { name: "8th Chair", slug: "8th-chair", description: "Curated expert Q&A platform.", stack: ["JS", "React"], status: "active" },
  { name: "Backyard Marquee", slug: "backyard-marquee", description: "Concert lineup builder.", stack: ["JS", "React", "Express", "Turso"], status: "maintained" },
  { name: "Obsidian Interface", slug: "obsidian-interface", description: "Desktop interface for an Obsidian vault.", stack: ["JS", "Tauri 2"], status: "maintained" },
];

export function projectsByStatus(): Record<ProjectStatus, Project[]> {
  return {
    active: projects.filter((p) => p.status === "active"),
    maintained: projects.filter((p) => p.status === "maintained"),
    dormant: projects.filter((p) => p.status === "dormant"),
  };
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
```

- [ ] **Step 3: Create lib/writing.ts**

```ts
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
```

- [ ] **Step 4: Create content/writing/hello-world.mdx**

```mdx
---
title: "Hello, world"
date: "2026-05-20"
excerpt: "Why I built a personal corner of the web separate from the business."
draft: false
---

This is the first note on my personal site. More soon.

The business lives at [Total Emphasis](https://www.totalemphasis.com). This is
the rest of it: the software I build, the things I read, and the occasional
essay.
```

- [ ] **Step 5: Replace app/page.tsx with the Home hub**

```tsx
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

      <section className="stagger grid gap-4 sm:grid-cols-2 pb-20" >
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
```

- [ ] **Step 6: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: compiles clean (all imports `featuredProjects`, `getAllPosts` now exist), Home prerenders, lint passes.

- [ ] **Step 7: Commit**

```bash
git add lib/types.ts lib/projects.ts lib/writing.ts content/writing/hello-world.mdx app/page.tsx
git commit -m "feat: add data layer (types, projects, writing loader) and home hub"
```

---

## Task 6: Writing pages — index + post

**Files:**
- Create: `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`

Depends on `lib/writing.ts` and `content/writing/hello-world.mdx` from Task 5.

- [ ] **Step 1: Create app/writing/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { getAllPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes by Keith R. O'Brien.",
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
```

- [ ] **Step 2: Create app/writing/[slug]/page.tsx**

```tsx
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
```

- [ ] **Step 3: Verify build + lint + dev visual check**

Run: `npm run build && npm run lint`
Expected: build compiles, `/writing` and `/writing/hello-world` prerendered, lint passes.
Then: `npm run dev`, open `http://localhost:3000/writing` and `/writing/hello-world`, confirm dark theme + prose render. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/writing
git commit -m "feat: add writing index and post pages"
```

---

## Task 7: Projects page + ProjectCard

**Files:**
- Create: `components/project-card.tsx`, `app/projects/page.tsx`

- [ ] **Step 1: Create components/project-card.tsx**

```tsx
import Link from "next/link";
import { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg text-[var(--color-fg)]">{project.name}</h3>
        <span className="font-mono text-xs text-[var(--color-muted)]">
          {project.stack.join(" · ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--color-body)]">{project.description}</p>
      {(project.url || project.repo) && (
        <div className="mt-3 flex gap-4 text-sm">
          {project.url && (
            <Link href={project.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
              Live →
            </Link>
          )}
          {project.repo && (
            <Link href={project.repo} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
              Code →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create app/projects/page.tsx**

```tsx
import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { projectsByStatus } from "@/lib/projects";
import type { ProjectStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software Keith R. O'Brien builds on the side.",
};

const GROUPS: { status: ProjectStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "maintained", label: "Maintained" },
  { status: "dormant", label: "Dormant" },
];

export default function ProjectsPage() {
  const grouped = projectsByStatus();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-10">Projects</h1>
      <div className="space-y-14">
        {GROUPS.map(({ status, label }) =>
          grouped[status].length > 0 ? (
            <section key={status}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-5">
                {label}
              </h2>
              <div className="stagger grid gap-4 sm:grid-cols-2">
                {grouped[status].map((p) => (
                  <FadeIn key={p.slug}>
                    <ProjectCard project={p} />
                  </FadeIn>
                ))}
              </div>
            </section>
          ) : null
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint + dev visual check**

Run: `npm run build && npm run lint`
Expected: `/projects` prerendered, lint passes.
Then: `npm run dev`, open `http://localhost:3000/projects`, confirm grouped cards render in dark theme. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/project-card.tsx app/projects
git commit -m "feat: add projects page with status-grouped cards"
```

---

## Task 8: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "About",
  description: "About Keith R. O'Brien — ghostwriter, builder, writer.",
};

const LINKS = [
  { href: "https://www.totalemphasis.com", label: "Total Emphasis" },
  { href: "https://github.com/k-obrien17", label: "GitHub" },
  { href: "https://www.linkedin.com/in/keithrobrien", label: "LinkedIn" },
  { href: "mailto:keith@totalemphasis.com", label: "keith@totalemphasis.com" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-8">About</h1>
        <div className="prose text-[var(--color-body)]">
          <p>
            I&apos;m Keith R. O&apos;Brien. I run Total Emphasis, a B2B
            ghostwriting practice, where I help executives turn their thinking
            into bylines, posts, and thought leadership.
          </p>
          <p>
            Outside the business, I build software: tools for my own workflows,
            a few things for fun, and the occasional thing that turns into a real
            product. This site is where that work lives.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          What I do
        </h2>
        <ul className="space-y-2 text-[var(--color-body)]">
          <li>Ghostwriting and content strategy for B2B executives</li>
          <li>Building developer tools, MCP servers, and desktop apps</li>
          <li>Writing about the craft of both</li>
        </ul>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Elsewhere
        </h2>
        <ul className="flex flex-wrap gap-5">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: `/about` prerendered, lint passes.

- [ ] **Step 3: Commit**

```bash
git add app/about
git commit -m "feat: add about page"
```

---

## Task 9: SEO/meta — 404, sitemap, robots, OG image

**Files:**
- Create: `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`

- [ ] **Step 1: Create app/not-found.tsx**

```tsx
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
```

- [ ] **Step 2: Create app/sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/writing";

const SITE_URL = "https://keithrobrien.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/writing", "/about"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));
  return [...staticRoutes, ...posts];
}
```

- [ ] **Step 3: Create app/robots.ts**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://keithrobrien.com/sitemap.xml",
  };
}
```

- [ ] **Step 4: Create app/opengraph-image.tsx**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#14120E",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 80, color: "#F5F1E8", fontFamily: "serif" }}>
          Keith R. O&apos;Brien
        </div>
        <div style={{ fontSize: 36, color: "#E8843C", marginTop: 16 }}>
          Ghostwriter · Builder · Writer
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: routes `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and 404 all build; lint passes.

- [ ] **Step 6: Commit**

```bash
git add app/not-found.tsx app/sitemap.ts app/robots.ts app/opengraph-image.tsx
git commit -m "feat: add 404, sitemap, robots, and OG image"
```

---

## Task 10: Replace boilerplate CLAUDE.md + remove unused scaffold

**Files:**
- Modify: `CLAUDE.md`
- Delete: `app/favicon.ico` only if replaced; otherwise keep. Remove `public/*.svg` Next defaults if unused by pages.

- [ ] **Step 1: Replace CLAUDE.md with a house-style project doc**

```md
# CLAUDE.md

Personal site for Keith R. O'Brien at keithrobrien.com. A warm-dark editorial brand hub: home, projects, writing, about. Separate from totalemphasis.com (the business).

## Stack
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Fonts: Instrument Serif (headings), DM Sans (body), Geist Mono (labels)
- Content libs: gray-matter, reading-time, next-mdx-remote
- Hosting: Vercel, auto-deploy from GitHub

## Content
- Projects: curated typed list in `lib/projects.ts`
- Writing: MDX files in `content/writing/`
- No DB, no API routes, no auth, no admin. Static-first.

## Commands
- `npm run dev` — dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint

## Conventions
- Design tokens are CSS custom properties in `app/globals.css` (warm-dark palette)
- Components in `components/`, page-specific UI in `app/<route>/`
- Imports use `@/*` alias (maps to project root)
- No test suite; don't add one unless asked
- Output style inherits `~/.claude/CLAUDE.md`: no em-dashes, terse

## Don't
- Don't modify the portfolio repo; it is reference-only
- Don't add a database or CMS; content is files in the repo
```

- [ ] **Step 2: Remove unused Next default SVGs**

Run:
```bash
cd ~/Desktop/Claude/Projects/keithrobrien && rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```
Expected: removed (ignore "No such file" for any that don't exist).

- [ ] **Step 3: Sync AGENTS.md to CLAUDE.md**

Run:
```bash
cd ~/Desktop/Claude/Projects/keithrobrien && rm -f AGENTS.md && ln -s CLAUDE.md AGENTS.md
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: clean build, lint passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: add project CLAUDE.md, remove default scaffold assets"
```

---

## Task 11: Full local review

**Files:** none (verification only)

- [ ] **Step 1: Run dev server and walk every route**

Run: `npm run dev`
Open and confirm in browser (dark theme, no console errors, responsive at mobile width):
- `/` — hero, facet cards, featured projects, latest writing
- `/projects` — grouped cards
- `/writing` — post list
- `/writing/hello-world` — prose renders
- `/about` — bio + links
- `/nonexistent` — 404 page

Stop dev server.

- [ ] **Step 2: Production build sanity**

Run: `npm run build`
Expected: all routes prerender, zero errors.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: local review polish"
```
(Skip if nothing changed.)

---

## Task 12: Ship (DEFERRED — requires Keith's go-ahead)

Do NOT run until Keith confirms. Needs his GitHub auth and Vercel account.

- [ ] **Step 1: Create GitHub repo and push**

```bash
cd ~/Desktop/Claude/Projects/keithrobrien
gh repo create keithrobrien --private --source=. --remote=origin --push
```

- [ ] **Step 2: Create Vercel project + deploy**

Use the Vercel CLI or dashboard; link the GitHub repo. Confirm the preview deploy renders.

- [ ] **Step 3: Add domain**

In Vercel project settings, add `keithrobrien.com` and `www.keithrobrien.com`; set DNS records as Vercel instructs at the registrar.

- [ ] **Step 4: Production smoke test**

Open `https://keithrobrien.com`, walk all routes, confirm OG image at `/opengraph-image`.

---

## Open items for Keith (resolve during or before Task 5/12)

- Confirm project list accuracy + which get `url`/`repo` links (Task 5 data)
- Confirm GitHub username `k-obrien17` and LinkedIn URL slug (used in footer/about)
- Positioning statement + bio copy (currently drafted; edit in Tasks 5 and 8)
- Analytics decision (Vercel Analytics or none) — add at ship time if yes
