# Handoff

## Current task
Reviewed and fixed the llms.txt surfaces: corrected the career-start fact conflict (2001 vs 2004) and single-sourced both llms files.

## Status
Done, deployed, and verified live. `/llms.txt` is now a route sharing one preamble source (`content/site/llms.json`) with `/llms-full.txt`; the build-time date stamp and 2004 career start are confirmed serving on production. Session lessons saved to auto-memory as `llms-txt-playbook`.

## Next concrete step
Run the same llms.txt audit on the portfolio repo (totalemphasis.com): check whether an llms.txt exists, single-source its preamble, build-time date, grep for stale bio facts vs the vault canonical, and pass client names through the PUBLIC-tier check.

## Don't forget
- All four essays in `content/writing/` are `draft: true`; when one publishes, it auto-appears in `/llms.txt` with title and excerpt. "How I'd Rank for AI Overviews" is itself an AEO asset sitting unpublished.
- `/collect/reading` was left out of llms.txt because the page is "coming soon"; add the link when it has content.
- 141miles.com and thediffraction.com need the same llms.txt audit after portfolio.

## Files touched this session
- content/site/llms.json — new shared preamble source (summary, bio, disambiguation)
- app/llms.txt/route.ts — new route replacing static public/llms.txt; build-time date, collect lanes, conditional Writing section
- app/llms-full.txt/route.ts — preamble now pulled from llms.json; build-time date
- lib/site-content.ts — added getLlmsPreamble() (listening-log additions in the working tree are from a parallel workstream, not this session)
- content/site/about.json — career start 2001 → 2004
- public/llms.txt — deleted (replaced by the route)

## Git state
- Branch: main
- Last commit: 7906e64 fix(seo): align career start to 2004 and single-source both llms surfaces (pushed, deployed)
- Uncommitted changes: yes, all from a parallel Listening-log workstream (lib/site-content.ts, content/site/listening-log.json, scripts/snapshot-playlist.mjs) plus pre-existing app/te-tokens.css
- Stashed: no

## Reason for handoff
session paused

## Updated
2026-07-23T21:27:07Z
