# Handoff

## Current task
Make keithrobrien.com fully editable by Keith (live editing via TinaCMS) and finish the public launch (DNS cutover from the old Eleventy site).

## Status
Site is live on Vercel at https://keithrobrien.vercel.app and on GitHub at github.com/k-obrien17/keithrobrien. Custom domain keithrobrien.com still serves the OLD Eleventy site on Google Cloud Storage (DNS never repointed). Build + lint green. This session shipped a full SEO/structured-data/icons/llms.txt pass and per-page OG, then brainstormed and wrote the design spec for TinaCMS live editing. Spec is committed at fa7519e and awaits Keith's approval before the implementation plan is written. No code yet for TinaCMS.

## Next concrete step
Keith picks one of:
(a) Approve `docs/superpowers/specs/2026-05-25-keithrobrien-live-editing-tinacms-design.md` so the next session runs `superpowers:writing-plans` against it to produce a step-by-step implementation plan (still no code).
(b) Handle the DNS cutover first: have me pull the Vercel domain config and produce the exact A/CNAME records to paste at the registrar.
(c) Both, in that order: spec → plan → cutover folded into Phase 1 of the plan.

## Open questions
- Approve the live-editing spec as-is, or want edits before writing-plans?
- DNS cutover now, after the editor is in, or in parallel?
- Which link-less projects in lib/projects.ts get live `url`/`repo` links? (Only 141 Miles, The Diffraction, Survival Signal have URLs today.)
- Vercel Analytics: on or off?
- "Hello, world" placeholder article: replace with real essay, leave, or hide the writing section until a real one exists?
- Connect GitHub→Vercel for auto-deploy on push (currently CLI deploys)? Required when TinaCMS lands so editor commits trigger rebuilds.
- Visible brand name: keep "Keith O'Brien" site-wide, or restore "Keith R. O'Brien"? (Currently bridged in schema only via `alternateName`.)

## Don't forget
- Spec's "Prerequisites" section assumes deploy is pending — it isn't. Before writing-plans, patch that section: GitHub + Vercel are done; only DNS cutover remains as a true prereq.
- "On hiatus" copy is still on the Survival Signal card; project group headings (Active/Maintained/Dormant) are now moot since all-active.
- When TinaCMS lands, add `public/admin/` and `tina/__generated__/` to `.gitignore`.
- Verify TinaCMS visual editing on Next 16 App Router before Phase 2. Phase 1 (admin-only) is the reliable target.
- Local dev command will change to `tinacms dev -c "next dev"` once Tina is wired up.
- Global `~/.claude/CLAUDE.md` (outside this repo) was flattened to all-active on 2026-05-21 with a dated marker; doesn't reflect true per-project status until re-tiered.

## Files touched this session
- app/layout.tsx — added `alternates.canonical`, `twitter` card, descriptive default title, and a server-rendered `<script type="application/ld+json">` with Person+WebSite schema (React 19 string-child injection, hook-safe, crawler-visible in static HTML).
- app/about/page.tsx — canonical + per-page openGraph + twitter.
- app/projects/page.tsx — canonical + per-page openGraph + twitter.
- app/writing/page.tsx — canonical + per-page openGraph + twitter.
- app/writing/[slug]/page.tsx — canonical, `og:type=article`, `publishedTime`, BlogPosting JSON-LD with author linked to the layout's Person `@id`.
- app/icon.tsx — NEW, code-generated 48px amber-on-dark monogram favicon.
- app/apple-icon.tsx — NEW, 180px dark-on-amber apple-touch-icon.
- public/llms.txt — NEW, bio + canonical links for LLM/GEO grounding.
- content/writing/template.mdx — NEW, draft starter template for new articles.
- docs/superpowers/specs/2026-05-25-keithrobrien-live-editing-tinacms-design.md — NEW, approved-direction design spec for TinaCMS live editing (Git-backed, /admin, two-phase).
- HANDOFF.md — this file (updated).

## Git state
- Branch: main (== origin/main per last push)
- Last commit: fa7519e docs: design spec for TinaCMS live editing
- Remote: github.com/k-obrien17/keithrobrien (private)
- Uncommitted changes: only HANDOFF.md (this file)
- Stashed: no

## Reason for handoff
session paused

## Updated
2026-05-26T14:03:43Z
