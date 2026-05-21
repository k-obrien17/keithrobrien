# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Positioning

keithrobrien.com is a personal brand hub for Keith R. O'Brien the person, distinct from totalemphasis.com (the B2B ghostwriting business). It ties together every facet of Keith: the business, his software side-projects, his personal writing, and an about/resume. It borrows the portfolio site's design DNA but runs as its own repo, Vercel project, and domain. The business does not depend on this site; this site links out to it as one facet. When in doubt, favor static-first and editorial control: files in the repo, hand-curated, no moving parts.

## Current state

- **Stable:** create-next-app scaffold, design spec and implementation plan committed.
- **In-flight:** building from the approved spec. First task is the design system, dark tokens in `app/globals.css` plus fonts in `app/layout.tsx` (both currently modified, uncommitted). No real pages built yet beyond boilerplate.
- **Migrating:** none.

## Commands

```bash
npm run dev      # next dev, localhost:3000
npm run build    # next build (static-first; also the type check)
npm run start    # next start, serve the production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

No test framework is configured.

## Architecture

### Stack

- Next.js 16.2.6, React 19.2.4, TypeScript 5, App Router
- Tailwind CSS 4 (`@tailwindcss/postcss`) + CSS custom properties for design tokens
- Content libs: `gray-matter` (frontmatter), `reading-time`, `next-mdx-remote` (MDX render)
- Fonts: Instrument Serif (headings), DM Sans (body), Geist Mono (labels/tags)
- Hosting: Vercel, auto-deploy from GitHub
- Deliberately absent: database, API routes, auth, admin CMS, vault sync, Sentry, Resend

### Content management

Files in the repo, no DB and no CMS.

- **Projects:** curated, typed list in `lib/projects.ts`. Slow-changing, hand-edited.
- **Writing:** personal essays as MDX in `content/writing/`. Drafted anywhere (including Obsidian), finished `.mdx` pasted into the repo. No live sync.
- Edit a file, push to GitHub, Vercel redeploys.

### Planned structure (per design spec, not all built yet)

```
app/
  layout.tsx          # fonts, Nav, Footer, metadata
  globals.css         # dark design tokens + base styles
  page.tsx            # Home (hub)
  projects/page.tsx   # Projects index, grouped Active/Maintained/Dormant
  writing/page.tsx    # Writing index (lists MDX)
  writing/[slug]/page.tsx
  about/page.tsx
components/            # nav, footer, fade-in, project-card
content/writing/*.mdx
lib/                  # projects.ts, writing.ts, types.ts
public/               # OG image, favicon, headshot
```

Every page server-rendered at build time. `lib/writing.ts` reads the MDX, parses frontmatter, computes reading time, sorts newest-first, hides `draft: true`.

## Conventions

- Path alias `@/*` maps to the repo root (see `tsconfig.json`).
- Design tokens drive color; warm dark palette (`--bg #14120E`, `--accent #E8843C` amber). Accent is for links, CTAs, active nav, and key phrases only, never long body text.
- Carry the portfolio's animation and prose system: `fade-in-up` + stagger on scroll, `:focus-visible` accent rings, `prefers-reduced-motion` guard, 4px spacing scale.
- On dark, shadows read weakly: use a faint border plus a slight `bg-alt` lift instead.

## Don't

- **Don't assume the Next.js you know.** This is Next.js 16 with breaking changes to APIs, conventions, and file structure. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code, and heed deprecation notices.
- **Never modify the portfolio repo** (`~/Desktop/Claude/Projects/portfolio`). It is a read-only reference for design DNA.
- **Don't add a database, API routes, auth, or a CMS.** Static-first is the design, not a gap to fill.
- **Don't sync content from the vault.** Finished MDX is pasted in by hand; there is no pipeline.
- **No light/dark toggle in v1.** Dark only.
- **Ship steps come last:** new GitHub repo, new Vercel project, and DNS for keithrobrien.com are the final phase, after the site is built.

## Reference

| Path | What |
|---|---|
| `docs/superpowers/specs/2026-05-20-keithrobrien-personal-site-design.md` | Approved design spec (palette, pages, data shapes, build sequence) |
| `docs/superpowers/plans/2026-05-20-keithrobrien-personal-site.md` | Step-by-step implementation plan |
| `HANDOFF.md` | Latest session state and open questions |
| `~/Desktop/Claude/Projects/portfolio` | Design DNA reference (read-only) |
