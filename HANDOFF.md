# Handoff: keithrobrien.com

**Last session:** 2026-06-28 → 2026-06-29 (continuous overnight)
**Session length:** ~6 hours, 23 commits to main, all deployed to production
**Status:** Site fully live, deploys clean

## Where we left off

Keith was tired and asked to keep pushing forward without writing. Last thing shipped: 3 WITI guest editions ingested + /bylines expanded to 7 publications (PRWeek, Realeyes, IBM, DMN, Econsultancy, Medium, Why Is This Interesting?). Then discussed:

1. **Content architecture** (TE vs kro.com split — codified in conversation, not in a file yet)
2. **Newsletter strategy** — recommended Resend over Beehiiv for B2B; names floated (Emphasis, Built Voice, First Person Plural, The Total Emphasis Brief, Operator's Voice); Survival Signal pivot still TBD
3. **AI doesn't challenge you pillar — KEITH PARKED IT.** Don't push. See memory at `~/.claude/projects/.../memory/feedback-pillar-pieces.md`

Next session pickup: decide newsletter (task #22), or continue ingesting more byline URLs, or attempt the 030-Evidence frontmatter cleanup (task #23).

## What's live on keithrobrien.com

| Surface | Status | Notes |
|---|---|---|
| Homepage | Live | Canonical bio, operator/systems framing, Brooklyn anchor, bylines facet |
| /about/keith-obrien | Live | Press kit, 13-question voice-search FAQ, ProfilePage + FAQPage schema |
| /about | Live | Conversational bio, canonical-aligned |
| /bylines | Live | 403 entries scoped to 7 publications (filter at `app/bylines/page.tsx` ALLOWED_PUBLICATIONS) |
| /writing | Live | 2 draft posts (ai-doesnt-challenge-you, how-id-rank-for-ai-overviews) — both `draft: true` |
| /llms.txt | Live | Rewritten with canonical bio + disambiguation paragraph |
| /llms-full.txt | Live | Same canonical bio in preamble |
| /sitemap.xml | Live | All static routes registered |
| Person schema | Live | sameAs chain of 7 URLs including /bylines |

Live domain: https://www.keithrobrien.com

## What's in the vault

| Location | What | Count |
|---|---|---|
| `vault/030-Works/canonical/articles/` | Canonical byline records | 599 .md files |
| `vault/030-Works/_raw/` | Preserved HTML + SHA256 sidecars | 562 (Authory XML) + 27 (DMN Wayback) + 7 (batch 1) + 2 (Econsultancy) + 3 (WITI) |
| `vault/030-Works/_capture-log.md` | Append-only audit trail | All ingestions logged with checksums |
| `vault/120-Resources/Client Mention Policy.md` | 5-tier framework | Canonical reference |
| `vault/120-Resources/clients.csv` + `.xlsx` | 200 orgs, 12 columns | ~46 tiered, ~140 still pending |
| `vault/020-Organizations/` | Org files with tier frontmatter | 35+ patched, more to do |
| `vault/120-Resources/Keith O'Brien Experience.md` | Canonical bio source | DO NOT MODIFY |
| `vault/000-OS/Claude/scripts/archive/capture_byline.py` | NEW helper script | Ingests new bylines in one command, regenerates kro.com manifest |

## Open items in priority order

1. **Newsletter decision** (task #22) — Resend vs Beehiiv, Survival Signal pivot, name, Issue 1 topic
2. **Off-site profile execution** (task #6) — Crunchbase Person finish, Muck Rack cleanup, About.me setup, LinkedIn About update with canonical sentence, GitHub README
3. **141 Miles "by Keith" credit on 141miles.com** — back-link from 141miles to keithrobrien.com /about/keith-obrien (task #6 sub-item)
4. **PRWeek guest column pitch** (task #2) — alumni angle, needs a pillar topic that ISN'T "AI doesn't challenge you"
5. **More LLM baseline runs** (task #4) — Perplexity, Google AI Overviews, Gemini, Bing, DuckDuckGo on Q1 + Q6 minimum
6. **Vault frontmatter cleanup** (task #23) — 307 files in 030-Evidence/Citations have YAML parse errors blocking the vault index sync
7. **Remaining /writing posts canonical audit** (task #24) — older posts still have drift
8. **Reframe gated portfolio on TE** (task #17) — can't touch TE repo from kro.com session
9. **Finish clients.csv tiering** (task #18) — ~140 prospects still untiered

## How to capture new bylines going forward

One command per byline (replaces the multi-step pipeline):

```bash
~/Desktop/obsidian-workspace/vault/000-OS/Claude/scripts/.venv/bin/python \
  ~/Desktop/obsidian-workspace/vault/000-OS/Claude/scripts/archive/capture_byline.py \
  "https://example.com/byline-url"

# With ghostwritten attribution:
.../capture_byline.py "https://forbes.com/sites/..." --ghostwritten-for "IBM"

# With non-PUBLIC tier:
.../capture_byline.py "https://forbes.com/sites/..." --tier GATED
```

Auto-handles: live or Wayback fetch, raw HTML preservation with SHA256, canonical .md generation, capture log append, and (for PUBLIC entries) regeneration of the kro.com bylines manifest.

After running, deploy:
```bash
cd ~/Desktop/Claude/Projects/keithrobrien && npm run build && git add -A && git commit -m "feat(bylines): add <piece>" && ! git push origin main
```

## Operational notes for next session

- **Vault index sync is broken** — pre-existing pre-session frontmatter parse errors in 030-Evidence/Citations block `bun run src/index.ts index sync` in the vault-chatbot project. Task #23 captures the fix needed. qmd-search MCP server won't see new 030-Works entries until this is resolved.
- **Footgun guard blocks direct `git push` to main** — Keith needs to run with `!` prefix in his terminal, or use PR workflow.
- **Mention policy is binding** — never name McKinsey, Sodexo, Google DeepMind, Sleep.ai, You.com, Block, SageSure, Substance Collective, Bloomberg, Kyndryl, Northern Trust, Ball Corporation, Salesforce Venture Funds on public surfaces. PUBLIC clients only: IBM, Realeyes, UpWave, UST, 33 Across, Grip, Battenhall, M&C Saatchi Performance, BlueWhale, GoodTime, AgendaZoom, ConquestVR, Rasa, TVDataNow, Catch+Release, Factoreal, T-Mobile (dormant), plus partners (M Booth, LaunchSquad, WE Communications, Charts and Leisure, Gather, Pace PR, JMAC, Caliber).
- **Canonical bio is FROZEN** at `vault/120-Resources/Keith O'Brien Experience.md`. Always pull verbatim; never synthesize.

## Things explicitly decided this session

- Wikidata Q-item deprioritized — notability bar too high; revisit after press coverage accumulates in 12-24 months
- ORCID + ISNI deprioritized — academic-leaning, wrong fit for B2B journalist-ghostwriter
- Authory declined — $12/mo not worth it; /bylines on kro.com is the replacement
- /bylines URL pattern (not /press) — /press is reserved for actual press coverage of Keith when accumulated
- "AI doesn't challenge you" parked as draft — DO NOT propose as pillar/newsletter Issue 1
- Operator-ghostwriter framing is the unique positioning to lead with everywhere

## Things to absolutely not do next session

- Don't push "AI doesn't challenge you" as the answer to "what should be the pillar/newsletter Issue 1." Keith said the framing isn't right.
- Don't name GATED-tier clients on public surfaces.
- Don't invent bio language. Pull from canonical.
- Don't push to main without `!` prefix (footgun guard will block).
- Don't touch the portfolio repo (`~/Desktop/Claude/Projects/portfolio` = totalemphasis.com) — read-only reference for design DNA per project CLAUDE.md.
- Don't commit secrets or `.env` files.

## Quick state check on resume

```bash
cd ~/Desktop/Claude/Projects/keithrobrien
git status                                                   # should be clean
git log --oneline -25                                        # ~23 commits this session
vercel ls 2>&1 | head -5                                     # check latest production deploy
ls ~/Desktop/obsidian-workspace/vault/030-Works/canonical/articles/ | wc -l   # ~599 files
cat ~/Desktop/obsidian-workspace/vault/030-Works/_capture-log.md | tail -20   # recent ingestions
```

## Resume cue

> Pick up from HANDOFF.md. Keith just shipped 23 commits on personal-site SEO/AEO/GEO + a byline archive (599 works in vault, 524 PUBLIC on /bylines). Site is live. Next moves: newsletter decision (#22), more byline ingests via capture_byline.py, or vault citations cleanup (#23). Don't propose "AI doesn't challenge you" as a pillar.
