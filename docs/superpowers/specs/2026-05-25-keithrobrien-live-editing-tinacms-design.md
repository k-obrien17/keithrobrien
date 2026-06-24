# keithrobrien.com — Live Editing with TinaCMS (Design)

**Date:** 2026-05-25
**Status:** Approved (pending spec review)
**Author:** Keith O'Brien + Claude

## Goal

Let Keith edit every piece of text on keithrobrien.com himself, without touching
code, files, or the terminal. He visits a private editor, changes content, hits
save, and the change is live in ~1 minute. No developer in the loop for routine
content edits.

"Everything" means: page copy (home headline, tagline, intro; About bio,
newsletters, previously, outside-of-work, links), the projects list, and
articles.

## Decision

Use **TinaCMS** as a Git-backed CMS layered onto the existing Next.js site.

- Content stays as **files in the repo** (JSON + MDX). The CMS is an editing
  layer, not a database. This preserves the site's static-first design; nothing
  about the current architecture is thrown away.
- Editing happens at **`/admin`**, authenticated via **TinaCloud** (free tier,
  2 users, which covers a solo editor).
- Saving an edit **commits to GitHub**, which triggers a **Vercel rebuild**, so
  the change appears in ~1 minute. The ~1-minute delay is accepted.
- Cost: **$0** (TinaCloud free + Vercel hobby + GitHub free).

### Why TinaCMS over the alternatives
- **vs. Decap CMS:** Tina offers both form-based admin editing *and* (later)
  click-on-page visual editing; Decap is admin-only. Tina has the better editor.
- **vs. Sanity (hosted):** Sanity would move content out of the repo into an
  external cloud store, breaking static-first and adding a data dependency. Not
  worth it for a personal site.

### Compatibility (verified 2026-05-25)
TinaCMS supports React 19 and the Next.js App Router as of `tinacms@2.7.7` /
`@tinacms/cli@1.9.7`. This site runs Next.js 16.2.6 / React 19.2, so the core
admin editing path is supported. The highest-risk piece is **on-page visual
editing on bleeding-edge Next 16**, which is why it is deferred to Phase 2.

Sources: TinaCMS React 19 support, TinaCMS Next.js App Router docs, TinaCMS
pricing (links in the brainstorming thread).

## The key constraint

A CMS can only edit content that lives in a content file. Today:

- **Articles** already live in editable files (`content/writing/*.mdx`). ✓
- **Projects** are a hardcoded TypeScript array in `lib/projects.ts`. ✗ Tina
  cannot edit a `.ts` file.
- **Page copy** (home headline, About bio, etc.) is baked into JSX in
  `app/page.tsx` and `app/about/page.tsx`. ✗ Not editable as-is.

Therefore the bulk of the work is a one-time **content extraction**: lift the
hardcoded projects array and inline page copy out of code and into
Tina-managed content files, then rewire the pages to read from those files.

## Content model (Tina collections)

### 1. `article` (existing files)
- **Location:** `content/writing/*.mdx`
- **Format:** MDX (unchanged)
- **Fields:** `title` (string), `date` (datetime), `excerpt` (string),
  `draft` (boolean), body (rich-text/markdown)
- **Maps to:** existing frontmatter + `PostMeta` in `lib/types.ts`. No file
  migration needed; Tina edits these in place.

### 2. `projects` (migrated from code)
- **New location:** `content/site/projects.json` — a single document with a
  `projects` list field (preserves order; easy to reorder in Tina's list UI).
- **Per-item fields** (mirror `Project` in `lib/types.ts`): `name` (string),
  `slug` (string), `description` (string), `stack` (string list),
  `status` (select: active | maintained | dormant), `url` (string, optional),
  `repo` (string, optional), `featured` (boolean).
- **Migration:** the 14 current projects in `lib/projects.ts` are moved verbatim
  into this JSON. `lib/projects.ts` is rewritten to read from the JSON and keep
  its existing exported helpers (`projectsByStatus`, `featuredProjects`) so
  consuming pages don't change.

### 3. `pageHome` and `pageAbout` (extracted from JSX)
- **New location:** `content/site/home.json`, `content/site/about.json`
- **`home.json` fields:** `name` (string), `tagline` (string), `intro`
  (rich-text), `introSecondary` (rich-text), and a `facets` list (label,
  description, href, external bool). Note: the accent-colored word ("Total
  Emphasis") in the current intro is a styled `<span>`; preserving that exact
  styling through rich-text is a detail for the implementation plan to resolve
  (likely a custom rich-text component or accepting plain emphasis).
- **`about.json` fields:** `bio` (rich-text), `newsletters` (rich-text — keeps
  the current prose-with-inline-links rendering and lets Keith edit it freely),
  `previously` (rich-text), `outsideOfWork` (rich-text), and a `links` list
  (label, href). All prose blocks use rich-text/markdown so rendering is
  unchanged and links remain editable.
- **Rewire:** `app/page.tsx` and `app/about/page.tsx` read these JSON files
  instead of holding hardcoded strings/arrays.

> Note: the home page's "Featured projects" and "Latest writing" sections are
> derived (computed from the projects + articles collections), not separately
> editable. Editing a project or article updates them automatically.

## Architecture changes

### New files
- `tina/config.ts` — defines the four collections above, media config, and the
  TinaCloud connection (client ID / branch via env vars).
- `content/site/projects.json`, `content/site/home.json`,
  `content/site/about.json` — extracted content.
- `app/admin` handling — Tina builds the editor into `public/admin/` (served at
  `/admin/index.html`); add to `.gitignore` as a build artifact.

### Modified files
- `lib/projects.ts` — read from `content/site/projects.json`; keep helper
  signatures.
- `app/page.tsx`, `app/about/page.tsx` — read from `content/site/*.json`.
- `package.json` — dev/build scripts wrapped by Tina:
  `"dev": "tinacms dev -c \"next dev\""`, build runs `tinacms build` before
  `next build`.
- `.env` / Vercel env — `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`,
  `TINA_BRANCH` (or `VERCEL_GIT_COMMIT_REF`).
- `.gitignore` — ignore `public/admin`, `tina/__generated__` as appropriate.

### Unchanged
- The SEO/structured-data work from earlier today keeps working; metadata and
  JSON-LD generation simply read from the new content files instead of inline
  constants. `lib/writing.ts` rendering stays as-is in Phase 1.

## Editing flow (end state)
1. Keith opens `keithrobrien.com/admin`, logs in via TinaCloud.
2. Edits Articles / Projects / Page Copy in forms (Phase 1) or by clicking text
   on the page (Phase 2).
3. Saves → TinaCloud commits to the GitHub repo.
4. Vercel detects the commit and rebuilds → live in ~1 minute.

## Phasing

### Phase 1 — Edit everything via the admin dashboard (the bulk of the value)
- Content extraction (projects + page copy) and page rewiring.
- `tina/config.ts` with all collections.
- `/admin` editor stood up.
- TinaCloud project created; Tina env vars set; GitHub→Vercel auto-deploy wired
  up so editor commits trigger production rebuilds.
- **Outcome:** Keith can edit every word of the site in a dashboard and publish.

### Phase 2 — Click-on-the-page visual editing (layered on later)
- Wire `useTina` + Tina client queries into the page components for live,
  in-context editing and side-by-side preview.
- Add the App Router `revalidate` settings to avoid stale Vercel Data Cache.
- **Outcome:** Keith can click text on the live page and edit it in place.
- Deferred because this is the piece most likely to need iteration on Next 16.

## Prerequisites / coupling with deploy

Live editing **requires** the site to be on GitHub and deployed to Vercel,
because TinaCloud edits the GitHub repo and Vercel rebuilds from it. These were
the deferred "ship" steps. The GitHub repo and the Vercel deploy are done; the
DNS cutover from the old Eleventy site to the new Next site at keithrobrien.com
also completed on 2026-06-24. What still needs to happen before Tina works:
GitHub→Vercel auto-deploy must be connected (today the project deploys from the
CLI, so TinaCloud commits would not trigger a rebuild). Wiring up that
integration is the one real prerequisite that folds into Phase 1.

## Risks & mitigations
- **Next 16 is very new.** Core Tina admin path is supported; visual editing
  (Phase 2) is the risk. → Phase it; verify before committing to it.
- **App Router caching can hide fresh edits.** → Set `revalidate` on Tina
  queries / route segments.
- **Local dev command changes.** → Documented; only affects local work.
- **Content extraction is the real cost.** → One-time; faithful 1:1 migration of
  existing copy so nothing visible changes on the site at extraction time.

## Out of scope
- Obsidian-to-site sync (rejected approach).
- Instant (no-rebuild) updates / hosted content store (rejected: Sanity).
- Multi-author roles / editorial workflow (solo editor).
- FAQ/HowTo schema and other deferred SEO items (tracked separately).
- Any redesign — this is purely about making existing content editable.

## Success criteria
1. Keith can change the home headline, his About bio, a project's description,
   and publish an article — all from `/admin`, no code/terminal — and see each
   change live within ~2 minutes.
2. No visible change to the site at the moment of extraction (faithful
   migration).
3. The site at keithrobrien.com is served from GitHub via Vercel auto-deploy,
   so TinaCloud commits trigger a rebuild without CLI intervention.
4. Existing SEO/structured-data output is preserved after the refactor.
5. Total recurring cost remains $0.
