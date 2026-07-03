# Handoff

## Current task

kro.com architecture reorg. The 36-deliverable spec is committed at
`docs/architecture/2026-q3-site-rebuild.md`. Nav is LOCKED and now WIRED (commit
`f8a8b47`). Remaining Phase 1 work is content-gated on Keith.

## Status

Nav wired this session (2026-07-03, commit `f8a8b47`). **Live verb lane:**

```
keith o'brien    write · build · collect · now · about       total emphasis ↗ · say hi
```

- **Decision revised 2026-07-03:** `now` KEPT as its own nav item (Keith wants it as the
  live "what I'm working on right now" surface), not folded onto home. 5-item lane, one more
  than the originally locked 4.
- **No URL renames.** Keith chose to save the redirects: labels read as verbs but slugs stay
  (`write`→`/writing`, `build`→`/projects`). No live URLs moved. This supersedes spec §35's
  `/projects`→`/build` / `/writing`→`/write` rename step — do NOT rename.
- `total emphasis ↗` points straight at `https://totalemphasis.com` (external, new tab).
  **The `/total-emphasis` interstitial page is CANCELLED (2026-07-03)** — thin page, weak
  SEO, adds friction. Proprietorship signal now lives in the nav slot's direct link plus an
  inline anchor-text link on the first "Total Emphasis" mention in the `/about` bio
  (`content/site/about.json`). Do not build the interstitial. Spec decision 3 updated.
- `write` (bylines fold under it), `build` (chosen over "systems"), `collect`
  (music/reading/watching hub), `about` (resume + press kit inside), `say hi` mailto.

**`/collect` hub shipped** (`app/collect/page.tsx`): minimal index listing three lanes —
`watching` (live link to `/collect/watching`), `music` + `reading` (stubbed "coming soon").
`/collect` and `/collect/watching` registered in sitemap; Collect line added to llms.txt.

Three load-bearing decisions still stand from the 2026-06-30 session: polished register;
kro.com = curious-operator hub NOT buyer-funnel (TE owns funnel); TE proprietorship is
Level-2 visible via `/total-emphasis`. Full decision log + still-open items are in the
architecture doc.

Also shipped this session (unrelated to the reorg): a full ship-check audit (report in
`~/.claude/ship-check-reports/2026-07-02-*`) plus its blocker fixes (TinaCMS removed, byline
count reconciled to 400+, WCAG contrast, OG tagline, llms.txt www, CLAUDE.md drift), and a
new WITI byline added to the archive. All committed, tree clean, nothing pushed.

## Next concrete step

Nav is wired. Remaining Phase 1 is content-gated — nothing mechanical left to do without
Keith's input. Waiting on Keith to supply, then execute:
1. `/collect` music + reading content (tracklists + Spotify link; reading picks) → fills the
   two stubbed lanes in `app/collect/page.tsx`.
2. Hero rewrite (spec §27 A/B/C; verb-triad favors A) once Keith picks.
(`/total-emphasis` interstitial cancelled — see Status. Nav links direct to the external site.)
Still open, unrelated: the empty Writing-section call on the current live site, and optional
vault upstream-capture of the WITI byline.

## Open questions

- Nav: RESOLVED + WIRED 2026-07-03 (write · build · collect · now · about + total emphasis ↗ + say hi). `now` kept as its own item; no URL renames. See Status.
- Hero copy: A (playful three-verb), B (workshop metaphor), C (terse builder), or something else. Verb-triad nav favors A.
- Content Keith must supply before /collect lanes can be built: playlists/tracklists/Spotify links, reading picks (watching already shipped). (/total-emphasis interstitial cancelled 2026-07-03 — no copy needed.)
- Newsletter direction (task #22): revive Survival Signal on Beehiiv as monthly "dispatches from the workshop," or different path
- Resume page format and source (assumed: page rendered from canonical bio at `vault/120-Resources/Keith O'Brien Experience.md`)
- The seven personal-gap questions Keith hasn't answered yet:
  - What pulls you in that you've never gotten paid to do
  - What you've stopped doing on purpose
  - What you think your unfair advantage actually is in your own words
  - What you want a peer/operator/journalist to feel after 60 seconds on kro.com
  - Whether soccer/golf/sports surface publicly or stay private background
  - What you're actually proudest of vs. what's just on the resume
  - What you'd write about if no one were paying you to ghostwrite anything

## Don't forget

- **Writing/bylines content model (2026-07-02):** `write` = Keith's own voice only (on-site essays + a CURATED "published elsewhere" list of his own bylines). Ghostwritten work does NOT live on kro — it's a direct link to Total Emphasis. Axis = whose name it's under, not venue.
- **Byline-number footgun:** public count currently "400+" (counts own + ghostwritten vs mixed 407-item view). When ghostwritten splits out to TE, the honest number becomes the curated own-byline count (~"300+"; own = 371 total, 261 of them PRWeek). Change the number in the SAME commit as the split (home.json, about.json, recently-shipped.json, keith-obrien FAQ, llms.txt, llms-full) so nothing contradicts. Until then, "400+" is correct.
- Keith confirmed: music page = text tracklist + Spotify playlist link (not embeds). Diffraction stays as separate publication, linked from music.
- TE.com is read-only from this session — cross-link only, never edit
- Polished register decided — drop status labels (live/prototype/retired), no Field Notes nav category, Crate is curated picks not weekly diary
- The 36-deliverable architecture spec is now committed at `docs/architecture/2026-q3-site-rebuild.md` (recovered from the 2026-06-29 transcript). No longer at-risk.
- 6 memory entries written this multi-session: keith-canonical-bio, feedback-pillar-pieces, client-mention-policy, archive-conventions, seo-aeo-decisions, keith-primary-focus-141-miles. Pre-load with /resume on session start.
- "AI doesn't challenge you" pillar stays parked — Keith said the framing isn't right. Do not propose it as Issue 1 or pillar.
- Backlog through `ffa566f` (nav wiring + `/collect` hub) was pushed to `origin/main` 2026-07-03; site is auto-deploying. Push new local commits with `! cd /Users/keithobrien/Desktop/Claude/Projects/keithrobrien && git push origin main`.
- **Spec §35 is partly superseded:** the `/projects`→`/build` and `/writing`→`/write` rename step is CANCELLED (Keith chose to keep slugs, save the redirects). Nav labels are verbs; URLs unchanged.

## Git state

- Branch: main
- Last commit: ffa566f (pushed) + this cancellation commit on top
- Uncommitted changes: no
- Unpushed: 1 commit (the /total-emphasis cancellation) until next push
- Stashed: no

## Reason for handoff

nav wired; remaining Phase 1 content-gated on Keith

## Updated

2026-07-03
