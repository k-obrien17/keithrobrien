# keithrobrien.com — Personal Site Design

**Date:** 2026-05-20
**Status:** Approved design, pre-implementation
**Project folder:** `~/Desktop/Claude/Projects/keithrobrien`

## Purpose

A personal brand hub for Keith R. O'Brien, the person, distinct from totalemphasis.com (the B2B ghostwriting business). It ties together every facet of Keith: the business, his software side-projects, his personal writing, and an about/resume. The business site stays as-is; this links out to it as one facet.

## Relationship to totalemphasis.com

- **Separate everything:** separate folder, separate git repo, separate Vercel project, separate domain (`keithrobrien.com`).
- The portfolio repo (`~/Desktop/Claude/Projects/portfolio`) is a **reference only**, borrowed for its design DNA. This project never modifies it.
- keithrobrien.com links *out* to totalemphasis.com; the business does not depend on this site.

## Stack

- **Framework:** Next.js 16, React 19, TypeScript 5 (scaffolded via `create-next-app`)
- **Styling:** Tailwind CSS 4 + CSS custom properties (design tokens)
- **Fonts:** Instrument Serif (headings), DM Sans (body), Geist Mono (labels/tags)
- **Content libs:** `gray-matter` (frontmatter), `reading-time`, `next-mdx-remote` (MDX render)
- **Hosting:** Vercel, auto-deploy from GitHub (mirrors portfolio flow)
- **No:** database, API routes, auth, admin CMS, vault sync, Sentry, Resend. Static-first.

## Content management

**Files in the repo.** No DB, no CMS, no admin.

- **Projects:** curated, typed list in `lib/projects.ts`. Slow-changing, hand-edited for editorial control.
- **Writing:** personal essays as MDX in `content/writing/`. Drafted anywhere (incl. Obsidian), finished `.mdx` pasted into the repo. No live sync.
- Edit a file, push to GitHub, Vercel redeploys.

## Visual identity — warm dark editorial

Same type pairing, spacing scale, and animation system as the portfolio, but a **warm dark** palette (not cold slate, not pure black) so it reads as a sibling of the business brand, distinctly personal.

| Token | Portfolio (light) | keithrobrien (dark) |
|---|---|---|
| `--bg` | `#FAF9F6` | `#14120E` warm near-black |
| `--bg-alt` | `#F2F0EB` | `#1E1B15` raised panel |
| `--fg` (headings) | `#1C1C1A` | `#F5F1E8` warm off-white |
| `--body` | `#4A4843` | `#C7C1B3` |
| `--muted` | `#6F6B63` | `#8A8475` |
| `--border` | `#E2E0DB` | `#2C281F` |
| `--accent` | `#B85C1E` | `#E8843C` warm amber |
| `--accent-hover` | `#9A4D18` | `#F2965A` |

- Carry over from portfolio: `fade-in-up` + stagger scroll animations, prose styles, `:focus-visible` accent rings, `prefers-reduced-motion` guard, 4px spacing scale.
- Accent (amber) used for links, CTAs, active nav, key phrases. Never for long body text.
- Body `#C7C1B3` on `#14120E` clears WCAG AA.
- On dark, shadows read weakly: use a faint border + slight `bg-alt` lift instead.

## Architecture

```
keithrobrien/
  app/
    layout.tsx            # fonts, <Nav>, <Footer>, metadata
    globals.css           # dark design tokens + base styles
    page.tsx              # Home (hub)
    projects/page.tsx     # Projects index
    writing/
      page.tsx            # Writing index (lists MDX)
      [slug]/page.tsx     # Individual post
    about/page.tsx        # About / resume / links
    not-found.tsx
  components/
    nav.tsx  footer.tsx  fade-in.tsx  project-card.tsx
  content/
    writing/*.mdx
  lib/
    projects.ts  writing.ts  types.ts
  public/                 # OG image, favicon, headshot
```

Static-first: every page server-rendered at build time. No DB, no API routes, no auth.

## Pages

### Home (`/`) — the hub
- Hero: name in Instrument Serif, one-line positioning statement, short intro. Amber accent on a key phrase.
- "Facets" row: 3-4 cards linking to Total Emphasis (external), Projects, Writing, About.
- Featured: 2-3 pinned projects + latest 2 essays.
- Footer: email / GitHub / LinkedIn.

### Projects (`/projects`)
- Grouped by status: Active / Maintained / Dormant (mirrors how Keith already organizes them).
- `ProjectCard`: name, one-line description, mono tech-stack tags, optional live/repo links.
- No filtering UI in v1; grouping is the filter.
- Private projects: list without links, or omit. Keith decides per project.

### Writing (`/writing`)
- Index lists MDX essays (title, date, reading time, excerpt), newest first; `draft: true` hidden.
- `/writing/[slug]` renders post in prose styles with a back link.
- RSS deferred (optional later).

### About (`/about`)
- Bio in prose + compact "what I do" list + outbound links block (business, GitHub, LinkedIn, email).
- Doubles as lightweight resume. No contact form.

## Data shapes

```ts
// lib/types.ts
type ProjectStatus = "active" | "maintained" | "dormant";

interface Project {
  name: string;
  slug: string;
  description: string;   // one-liner
  stack: string[];       // e.g. ["TS", "Next.js", "Tauri 2"]
  status: ProjectStatus;
  url?: string;          // live link, if public
  repo?: string;         // GitHub, if public
  featured?: boolean;    // pin to home
}

interface PostMeta {
  title: string;
  date: string;          // YYYY-MM-DD
  excerpt: string;
  slug: string;
  readingTime: string;
  draft?: boolean;
}
```

MDX frontmatter:
```yaml
---
title: "..."
date: "YYYY-MM-DD"
excerpt: "..."
draft: false
---
```

`lib/writing.ts`: reads `content/writing/*.mdx`, parses frontmatter (`gray-matter`), computes reading time (`reading-time`), sorts newest-first, hides drafts.

## Build sequence

1. Design system — dark tokens in `globals.css`, fonts in `layout.tsx`
2. Primitives — `nav`, `footer`, `fade-in`
3. Home (hub)
4. Projects — `project-card` + seed `projects.ts` from CLAUDE.md project tables
5. Writing — index + `[slug]` + loader + one sample post
6. About
7. SEO/meta — metadata, OG image, favicon, sitemap, robots
8. Polish — responsive + a11y pass
9. Ship — new GitHub repo (`keithrobrien`), new Vercel project, DNS for keithrobrien.com (last)

Also: replace create-next-app's boilerplate `CLAUDE.md`/`AGENTS.md` with a project CLAUDE.md in Keith's house style.

## Out of scope (v1)

- Database, admin CMS, contact form, vault sync
- RSS feed (deferrable)
- Analytics (decide at ship time)
- Light/dark toggle (dark only)

## Open items for ship time

- Confirm GitHub repo name/owner (`k-obrien17/keithrobrien` assumed).
- Decide which projects are public (with links) vs listed-only vs omitted.
- Positioning statement + bio copy (Keith to provide or approve drafts).
- Analytics choice (Vercel Analytics vs none).
