# Handoff

## Current task

Pivot from autonomous SEO/AEO/GEO push to Keith-directed kro.com edits. Keith said "Actually I want to make edits to keithrobrien.com" — the previous wave of session-driven work is done; the next session takes direction from Keith.

## Status

Site fully live at https://www.keithrobrien.com. 37 commits shipped this session, 2 unpushed sitting on main (RSS feed + footer tagline). Vault index sync now clean (16,399 notes, 0 frontmatter errors). 599 canonical works in the archive, 534 PUBLIC tier. Memory entries written for cross-session continuity: client-mention-policy, archive-conventions, seo-aeo-decisions, feedback-pillar-pieces.

## Next concrete step

Push the 2 unpushed commits, then ask Keith what specific edit he wants to make to kro.com:

```
! cd /Users/keithobrien/Desktop/Claude/Projects/keithrobrien && git push origin main
```

## Open questions

- What edits does Keith want to make? (this is the entire pivot — Keith hasn't said yet)
- Newsletter strategy (task #22): Resend vs Beehiiv, name, Survival Signal pivot, Issue 1 topic. Recommend Resend for B2B; need subscriber count + last-send date on Survival Signal to decide repurpose path.

## Don't forget

- **Mention policy is binding.** Never name McKinsey, Sodexo, Google DeepMind, Sleep.ai, You.com, Block, SageSure, Substance Collective, Bloomberg, Kyndryl, Northern Trust, Ball Corporation, Salesforce Venture Funds on public surfaces. See memory `client-mention-policy.md` for the full PUBLIC roster.
- **Canonical bio is FROZEN** at `vault/120-Resources/Keith O'Brien Experience.md`. Pull verbatim; never synthesize.
- **"AI doesn't challenge you" stays parked** as a draft. Keith said the framing isn't right. Don't propose it as pillar/newsletter Issue 1.
- **Footgun guard blocks `git push origin main`** — Keith must run it with `!` prefix in his terminal.
- **Don't touch `~/Desktop/Claude/Projects/portfolio`** — that's totalemphasis.com, read-only design DNA reference.
- **Capture script** for new bylines: `vault/000-OS/Claude/scripts/archive/capture_byline.py <url>`. Auto-regenerates kro.com manifest for PUBLIC entries.
- **`/bylines` page filter** at `app/bylines/page.tsx` (ALLOWED_PUBLICATIONS) currently shows: prweek, ibm, realeyesit, dmnews, medium, econsultancy, whyisthisinteresting. Expand the set to widen the surface.
- **Vault has `archive_stats.py`** at `vault/000-OS/Claude/scripts/archive/` for archive visibility.
- **~140 prospects still untiered** in clients.csv (task #18, needs Keith).

## Files touched this session (kro.com)

Major:

- `app/layout.tsx` — Person schema (knowsAbout, alumniOf, hasOccupation, disambiguatingDescription, sameAs +/bylines), canonical bio descriptions
- `app/bylines/page.tsx` — new page + scope filter + Recent section
- `app/about/keith-obrien/page.tsx` — press kit (ProfilePage + FAQPage + 13-question FAQ)
- `app/writing/page.tsx` — CollectionPage schema + RSS link
- `app/writing/[slug]/page.tsx` — BlogPosting schema enrichment
- `app/writing/feed.xml/route.ts` — NEW RSS feed
- `app/projects/page.tsx` — CollectionPage + SoftwareApplication schema
- `app/sitemap.ts` — added /bylines
- `app/robots.ts` — 20 LLM crawler User-Agents
- `app/llms-full.txt/route.ts` — canonical bio preamble + disambiguation
- `public/llms.txt` — full rewrite with disambiguation
- `components/nav.tsx` — added /bylines link
- `components/footer.tsx` — operator-ghostwriter tagline + bylines/141 miles/muck rack links
- `content/site/home.json` — canonical bio + Brooklyn anchor + bylines facet
- `content/site/about.json` — canonical alignment
- `content/site/now.json` — refresh
- `content/site/recently-shipped.json` — session's artifacts
- `content/bylines-archive.json` — manifest (regenerated multiple times)
- `content/writing/ai-doesnt-challenge-you.mdx` — draft (PARKED per Keith)
- `content/writing/how-id-rank-for-ai-overviews.mdx` — draft
- `docs/seo/profile-checklist.md` — semiannual sweep tracker
- `docs/seo/llm-baseline.md` — empirical baseline framework
- `docs/seo/competitive-entity-audit.md` — competitor scan
- `docs/seo/email-signatures.md` — 3 standardized signatures
- `docs/seo/dmn-byline-recovery.md` — Wayback recovery doc

Vault (separate git):

- `vault/030-Works/canonical/articles/` — 599 canonical works
- `vault/030-Works/_raw/` — preserved HTML + SHA256 sidecars
- `vault/030-Works/_capture-log.md` — audit trail
- `vault/030-Works/README.md` — schema reference
- `vault/120-Resources/Client Mention Policy.md` — 5-tier framework
- `vault/120-Resources/clients.csv` + `clients.xlsx` — 200 orgs
- `vault/020-Organizations/*` — 40+ org files patched with tier frontmatter
- `vault/000-OS/Claude/scripts/archive/capture_byline.py` — new byline ingest helper
- `vault/000-OS/Claude/scripts/archive/archive_stats.py` — visibility tool
- 292 citation files in `vault/030-Evidence/Citations/` — YAML frontmatter repaired
- 40 trade-press canonical files — escaped-apostrophe fix

## Git state

- Branch: main
- Last commit: 08a9799 chore(footer): operator-ghostwriter tagline replaces "content strategy"
- Uncommitted changes: no
- Unpushed commits: 2 (08a9799, 00b1f9e) — push with `! git push origin main`
- Stashed: no
- Vault git: 2 commits this session (d2f499d848 frontmatter repair, 609d72d00a archive_stats script). Vault has heavy pre-existing uncommitted automation output — not session work, leave alone.

## Reason for handoff

Session paused — Keith pivoting to direct edits on keithrobrien.com.

## Updated

2026-06-29T16:05:31Z
