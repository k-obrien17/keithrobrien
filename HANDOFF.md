# Handoff

## Current task
Make keithrobrien.com fully editable by Keith (live editing via TinaCMS) and finish post-launch cleanup. Domain cutover is complete.

## Status
**keithrobrien.com is live on the new Next.js site.** DNS at Namecheap was swapped today: apex A → `76.76.21.21`, www CNAME → `cname.vercel-dns.com`. Vercel SSL provisioned for both apex and www. Old Eleventy site on Google Cloud Storage is no longer reachable through the domain.

Project descriptions on the personal site now match the polished, public-facing copy from totalemphasis.com. Four overlap entries updated and six new ones added (Article Search, Total Emphasis Portfolio, Control Panel, Ideas, Personal Claude, Writing).

TinaCMS live editing is still un-built. Spec at `docs/superpowers/specs/2026-05-25-keithrobrien-live-editing-tinacms-design.md` still awaits Keith's approval before `superpowers:writing-plans` is run.

## Next concrete step
Keith picks one of:
(a) Approve the TinaCMS spec so the next session runs `superpowers:writing-plans` against it.
(b) Knock out the small cleanup left over: drop or re-tier the all-Active `projectsByStatus` groups, remove "On hiatus" copy on Survival Signal, decide which `lib/projects.ts` entries get live `url` / `repo` links.
(c) Move the placeholder `content/writing/template.mdx` "Hello, world" article off the writing index (replace, hide section, or leave).

## Open questions
- Approve the live-editing spec as-is, or want edits before writing-plans?
- Vercel Analytics: on or off?
- "Hello, world" placeholder article: replace, leave, or hide writing section?
- Connect GitHub→Vercel for auto-deploy on push (currently CLI deploys)? Required when TinaCMS lands so editor commits trigger rebuilds.
- Visible brand name: keep "Keith O'Brien" site-wide, or restore "Keith R. O'Brien"? (Currently bridged in schema only via `alternateName`.)
- Which projects in `lib/projects.ts` get public `url` or `repo` links? Today only 141 Miles, The Diffraction, Survival Signal, and Total Emphasis Portfolio have URLs.

## Don't forget
- Spec's "Prerequisites" section assumes deploy + DNS are pending — both are now done. Patch that section before `writing-plans` runs.
- Project status groups (Active/Maintained/Dormant) are still all-Active in `lib/projects.ts`; heading is dead until items are tiered.
- "On hiatus" copy is still on the Survival Signal card.
- When TinaCMS lands, add `public/admin/` and `tina/__generated__/` to `.gitignore`.
- Verify TinaCMS visual editing on Next 16 App Router before Phase 2. Phase 1 (admin-only) is the reliable target.
- Local dev command will change to `tinacms dev -c "next dev"` once Tina is wired up.
- Global `~/.claude/CLAUDE.md` was flattened to all-active on 2026-05-21 with a dated marker; doesn't reflect true per-project status until re-tiered.

## Files touched this session
- `lib/projects.ts` — adopted totalemphasis.com public-facing descriptions on 4 overlaps; added 6 projects (Article Search, Total Emphasis Portfolio, Control Panel, Ideas, Personal Claude, Writing).
- Vercel project `keithrobrien` — attached `keithrobrien.com` and `www.keithrobrien.com` (no repo changes; admin-side action).
- Namecheap DNS for keithrobrien.com — apex A swapped from `34.36.179.59` → `76.76.21.21`; www CNAME swapped from apex → `cname.vercel-dns.com`. (Done by Keith in the registrar UI.)
- `HANDOFF.md` — this file (updated).

## Git state
- Branch: main
- Last commit: `1008a04 feat(projects): adopt totalemphasis.com public-facing copy`
- Remote: github.com/k-obrien17/keithrobrien (private)
- Uncommitted changes: only `HANDOFF.md` (this file)
- Stashed: no

## Reason for handoff
session paused

## Updated
2026-06-24T19:27:40Z
