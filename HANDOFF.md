# Handoff

## Current task
Building and shipping keithrobrien.com: a warm-dark editorial personal brand hub for Keith O'Brien, separate from totalemphasis.com.

## Status
Site fully BUILT and deployed to Vercel. All pages live (Home, Projects, Writing, About) plus 404, sitemap, robots, OG image. Real copy pulled from the existing live site; brand name is "Keith O'Brien" (no R.) site-wide. All projects set to Active status (tiers flattened, see below). Build + lint green; routes verified locally and on Vercel. Deployed at https://keithrobrien.vercel.app (renders correctly, public). The custom domain keithrobrien.com is NOT attached, so the old live site is still what's at that domain.

## Next concrete step
Decide on the domain cutover. To go live: attach keithrobrien.com (+ www) to the Vercel project `keithrobrien` and set the registrar DNS records Vercel provides. This replaces the current live site and needs Keith's go-ahead + likely his hands on the registrar.

## Open questions
- Attach keithrobrien.com now (the public cutover), or keep reviewing on the vercel.app URL first?
- Connect GitHub repo to Vercel for auto-deploy on push (`vercel git connect`)? Currently deployed via CLI from local, not git-linked.
- Which of the 11 link-less projects in lib/projects.ts get live `url`/`repo` links (only 141 Miles, The Diffraction, Survival Signal have URLs).
- Analytics: Vercel Analytics or none.

## Don't forget
- Global `~/.claude/CLAUDE.md` (outside this repo) was flattened to all-active on 2026-05-21 with a dated marker; it no longer reflects true per-project status until Keith re-tiers. Memory note saved at the project memory dir.
- Copy to revisit: "On hiatus" still on the now-Active Survival Signal card; project group headings are moot now that everything is one Active list.
- Sample post content/writing/hello-world.mdx is a placeholder; swap in a real essay or hide the section.
- Ship was done directly (build merged from feat/site-build earlier). vercel deploy --yes landed on the project's PRODUCTION target (vercel.app), not a preview alias.

## Git state
- Branch: main (== origin/main, all pushed)
- Last commit: a011fb7 chore: set all projects to active status
- Remote: github.com/k-obrien17/keithrobrien (private)
- Uncommitted changes: only HANDOFF.md (this file)
- Stashed: no

## Reason for handoff
pause

## Updated
2026-05-21T15:17:30Z
