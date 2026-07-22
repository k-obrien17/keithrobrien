# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Positioning

keithrobrien.com is Keith O'Brien's personal site: a static-first hub for his 400+ piece bylines archive, personal writing, side projects, and public profile/press-kit context. When in doubt, keep it static: no database, no auth, no CMS. Content lives in the repo, not in a backend.

## Current state

- **Stable:** bylines archive, writing/essays, about/press-kit, `/collect` (music/film/TV year-based rankings and best-of lists)
- **In-flight:** none
- **Migrating:** none

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Architecture

### Stack

- Next.js 16, App Router
- React 19
- TypeScript
- Tailwind CSS 4
- MDX via `next-mdx-remote`
- `@vercel/analytics`
- Deployed on Vercel (project: `keithrobrien`)

### Key directories

| Path | Purpose |
|---|---|
| `app/` | routes, metadata, feeds (`sitemap.ts`, `robots.ts`), generated text surfaces (`llms-full.txt`) |
| `components/` | shared layout and display components |
| `content/site/` | home/about/projects/now copy (JSON) |
| `content/writing/` | essay source (MDX) |
| `content/bylines-archive.json` | bylines archive data |
| `content/collect/` | music/film/TV collection and year-page data (JSON) |
| `lib/` | typed content loaders (`site-content.ts`, `writing.ts`, `collect.ts`, `projects.ts`) |
| `public/` | static assets, AI-readable files |

## Conventions

- Static content only: no database, auth layer, CMS, or private vault sync. If a feature seems to need one, it belongs in a different project.
- This is a **public repo**: no secrets, no `.env` files, no internal handoff notes, no private strategy docs in the checked-in tree.
- Content edits go through `content/*.json` / `.mdx`, not hardcoded in components.

## Don't

- Don't add a database, auth layer, or CMS. The static content model is deliberate.
- Don't commit secrets, local `.env` files, internal handoff notes, or private strategy docs, this repo is public.
- Don't skip `npm run lint` and `npm run build` before opening a PR.

## Reference

- `README.md`, project overview, content model, structure
- `te-tokens.css` / `app/globals.css`, Total Emphasis design system tokens (adapted for public-site use)
