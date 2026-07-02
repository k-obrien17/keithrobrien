# Handoff

## Current task

kro.com architecture reorg. The 36-deliverable spec is now committed at
`docs/architecture/2026-q3-site-rebuild.md` (recovered from the 2026-06-29 transcript,
punctuation house-styled). Nav is now LOCKED. Next is Phase 1 execution on Keith's go.

## Status

Nav decided this session (2026-07-02). **Verb lane:**

```
keith o'brien    write · build · collect · about       total emphasis ↗ · say hi
```

- `write` (bylines fold under it), `build` (chosen over "systems"), `collect` (the
  music/reading/watching hub, chosen over Crate/Shelf/Stack/Consume), `about` (resume +
  press kit inside), `total emphasis ↗` (right-side slot, external arrow, Level-2 visible),
  `say hi` mailto.
- No `/start` page (home is orientation). `now` folds onto home, keep `/now` page. No
  thesis-shaped nav item. All-verb lane, no noun labels.

Three load-bearing decisions still stand from the 2026-06-30 session: polished register;
kro.com = curious-operator hub NOT buyer-funnel (TE owns funnel); TE proprietorship is
Level-2 visible via `/total-emphasis`. Full decision log + still-open items are in the
architecture doc.

Also shipped this session (unrelated to the reorg): a full ship-check audit (report in
`~/.claude/ship-check-reports/2026-07-02-*`) plus its blocker fixes (TinaCMS removed, byline
count reconciled to 400+, WCAG contrast, OG tagline, llms.txt www, CLAUDE.md drift), and a
new WITI byline added to the archive. All committed, tree clean, nothing pushed.

## Next concrete step

Phase 1 execution (spec section 35), on Keith's go: rename `/projects` → `/build` and
`/writing` → `/write` (with redirects + update all internal links, sitemap, llms.txt),
rewrite `components/nav.tsx` to the locked nav, add the `/total-emphasis` slot. The
`/collect` hub and hero rewrite follow once Keith supplies content (playlists/tracklists/
Spotify links, reading + watching picks, `/total-emphasis` copy) and picks hero copy
(spec §27 A/B/C; verb-triad favors A). Still open, unrelated: the empty Writing-section
call on the current live site, and optional vault upstream-capture of the WITI byline.

## Open questions

- Nav: RESOLVED 2026-07-02 (write · build · collect · about + total emphasis ↗ + say hi). See Status.
- Hero copy: A (playful three-verb), B (workshop metaphor), C (terse builder), or something else. Verb-triad nav favors A.
- Content Keith must supply before /collect + /total-emphasis can be built: playlists/tracklists/Spotify links, reading + watching picks, /total-emphasis copy
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

- Keith confirmed: music page = text tracklist + Spotify playlist link (not embeds). Diffraction stays as separate publication, linked from music.
- TE.com is read-only from this session — cross-link only, never edit
- Polished register decided — drop status labels (live/prototype/retired), no Field Notes nav category, Crate is curated picks not weekly diary
- The brief Keith pasted (36-point architecture spec) is captured in conversation but NOT yet committed as a doc. Could become `docs/architecture/2026-q3-site-rebuild.md` if useful.
- 6 memory entries written this multi-session: keith-canonical-bio, feedback-pillar-pieces, client-mention-policy, archive-conventions, seo-aeo-decisions, keith-primary-focus-141-miles. Pre-load with /resume on session start.
- "AI doesn't challenge you" pillar stays parked — Keith said the framing isn't right. Do not propose it as Issue 1 or pillar.
- Three commits unpushed since previous handoff: RSS feed, footer tagline, prior handoff doc. Push with `! cd /Users/keithobrien/Desktop/Claude/Projects/keithrobrien && git push origin main`

## Git state

- Branch: main
- Last commit: 719b083 chore: update handoff — pivoting to Keith-directed kro.com edits
- Uncommitted changes: no
- Unpushed: 3 commits (719b083, 08a9799, 00b1f9e)
- Stashed: no

## Reason for handoff

session paused

## Updated

2026-06-30T14:08:26Z
