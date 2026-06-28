# Off-site profile tracker

Two jobs in one file: (1) a registry of active profiles to sweep semiannually (January 1 and July 1), and (2) the pending list of profiles still to create.

**Canonical bio source:** `~/Desktop/obsidian-workspace/vault/120-Resources/Keith O'Brien Experience.md`. Pull verbatim. Do not synthesize.

**Approved framings (derived from canonical + Total Emphasis site language):**

- **Short Description (178 chars):** *Operator-ghostwriter for B2B founders and executives. B2B content strategist with 20+ years driving results for Fortune 500s and startups. Builds the systems his work runs on.*
- **One-liner:** *Operator-ghostwriter for B2B founders and executives. Builds the systems his work runs on.*
- **Long About:** see canonical resume summary line + "Operates as an operator-ghostwriter for B2B founders and executives, building the systems his work runs on." closer.

**Canonical URLs to use as `sameAs` everywhere:**

- https://www.keithrobrien.com
- https://www.keithrobrien.com/about/keith-obrien
- https://www.totalemphasis.com
- https://www.141miles.com
- https://www.linkedin.com/in/keithobrien/
- https://muckrack.com/keithobrien
- https://github.com/k-obrien17

---

## Semiannual sweep

**Anchor dates: January 1 and July 1.** Pick whichever Saturday or Sunday is closest if those fall mid-week and you need the time. Walk through every active profile below:

1. Open the URL.
2. Confirm bio matches the current canonical (re-pull from the source file in case it's been updated).
3. Confirm role / title is current.
4. Confirm headshot is the current one (replace if outdated).
5. Confirm all outbound `sameAs` links still resolve.
6. Update the "Last reviewed" date in the table below.
7. If anything has drifted, fix it on the profile AND note in the canonical source if the canonical changed.

Quarterly micro-sweep (15 min, around April 1 and October 1): scan for any new profiles created since the last full sweep, add them to the registry, and check the empirical LLM baseline (task #4) to see whether the new ones are getting cited. No bio re-review at the micro-sweep, just registry hygiene.

**Next scheduled sweep: 2026-07-01.** (~3 days from this file being written.)

---

## Active profiles registry

Profiles that exist and need annual review. Fill in the URL when created, then update "Last reviewed" each sweep.

| Profile | Entity | URL | Created | Last reviewed | Notes |
|---|---|---|---|---|---|
| LinkedIn | Keith | https://www.linkedin.com/in/keithobrien/ | pre-existing | | Verify About section matches canonical bio + operator framing |
| GitHub | Keith | https://github.com/k-obrien17 | pre-existing | | README still pending (see Tier 1 below) |
| Muck Rack | Keith | https://muckrack.com/keithobrien | pre-existing | | Verify byline list complete, photo current |
| Crunchbase (Org) | Total Emphasis | TBD | | | Already exists per Keith |
| Crunchbase (Person) | Keith | TBD | in progress | | Setting up 2026-06-28 |
| keithrobrien.com | Keith | https://www.keithrobrien.com | site live | 2026-06-28 | Disambiguation press kit at /about/keith-obrien |
| totalemphasis.com | Total Emphasis | https://www.totalemphasis.com | site live | | |
| 141miles.com | 141 Miles | https://www.141miles.com | site live | | Add Keith author/editor credit linking to keithrobrien.com |

---

## Tier 1: Highest LLM weight, do first

- [ ] **Wikidata** — Create Q-item for Keith O'Brien (Person). Create Q-item for Total Emphasis (Organization). Link via founder/founded relationship. Add sameAs for every URL above. Properties: instance of, occupation, employer, alumni of (PRWeek, Haymarket), country of residence (US), location (Brooklyn). **Why:** Wikidata is in nearly every LLM training set and is the structured-data backbone of Google Knowledge Panels.

- [ ] **Crunchbase — Person profile (Keith)** — In progress 2026-06-28. Use TE Org page → People → add Keith as Founder to create. Then fill bio (short + long versions above), photo, past jobs, social URLs. **Why:** Top-3 most-cited business data source by LLMs.

- [x] **Crunchbase — Organization profile (Total Emphasis)** — Already exists. Verify it links to Keith Person profile bidirectionally once Person is live.

- [ ] **Authory** — Sign up, connect Muck Rack. Auto-aggregates bylines into a citable archive. **Why:** Solves "Keith's bylines are scattered" problem. Direct LLM training surface.

- [ ] **About.me** — Create at about.me/keithobrien. Short Description + canonical URLs + headshot. **Why:** Old-school but heavily LLM-cited because schema is clean.

- [ ] **Muck Rack cleanup** — Profile exists. Add headshot, complete byline list, current role (Founder + operator-ghostwriter framing), contact info. **Why:** Top-tier journalist credential source in LLM training data.

- [ ] **GitHub profile README** — Create README at github.com/k-obrien17/k-obrien17 (self-named repo). Short Description + Total Emphasis + 141 Miles + writing links. **Why:** GitHub is heavily LLM-trained for entity resolution.

- [ ] **Substack profile** — Reserve username at substack.com even before launching newsletter. **Why:** Creates publisher entity LLMs index immediately.

---

## Tier 2: Service / agency directories

- [ ] **Clutch.co** — Total Emphasis listing. Requires client review participation. **Why:** Canonical agency directory cited by LLMs for "best B2B content marketing agencies."
- [ ] **GoodFirms** — Total Emphasis listing.
- [ ] **Sortlist** — Total Emphasis listing.
- [ ] **LinkedIn Service Marketplace** — Keith or Total Emphasis profile.
- [ ] **Reedsy** — Keith ghostwriter profile. Gated approval. **Why:** Most-LLM-cited ghostwriter source.
- [ ] **F6S** — Total Emphasis founder profile.
- [ ] **Indie Hackers** — Keith founder profile.
- [ ] **G2** — Total Emphasis as service provider.

---

## Tier 3: Writer / journalist surface area

- [ ] **Bluesky** — Reserve handle.
- [ ] **Threads** — Reserve handle.
- [ ] **Reddit user account** — Reserve u/keithobrien.
- [ ] **Medium** — Republish blog posts with `canonical` pointing back to keithrobrien.com.
- [ ] **DEV.to** — Same. Republish AI / writing pieces.
- [ ] **Quora** — Topic Expert badge in ghostwriting / executive thought leadership.

---

## Tier 4: 141 Miles-specific

- [ ] **Product Hunt creator profile** — Free.
- [ ] **Google Business Profile for 141 Miles** — Local intent capture.
- [ ] **Apple News publisher** — Content distribution.
- [ ] **NewsCatcher / NewsAPI publishers** — News aggregators LLMs read.

---

## Tier 5: Source / expert databases

- [ ] **Help A B2B Writer** — Weekly response habit.
- [ ] **Featured.com** — HARO replacement, LLM-cited.
- [ ] **Qwoted** — PR source database.
- [ ] **SourceBottle** — Smaller but LLM-trained.
- [ ] **ResponseSource** — UK-leaning, useful given PRWeek (Haymarket) heritage.

---

## Skip list

Vanity profiles with no SEO weight. Don't waste time:

- Linktree, AllMyLinks, Bio.fm (pure redirect pages)
- Carrd (no schema unless heavily customized)
- AngelList / Wellfound (low LLM weight now)
- ZoomInfo (you can't edit your data)
- "Top 100 Ghostwriters" paid placements
- Sponsored directory listings of any kind
- ProfNet (paid, not worth it for inbound)

---

## Status summary

| Tier | Total | Active | Pending | Skipped |
|---|---|---|---|---|
| Owned sites | 3 | 3 | 0 | 0 |
| Tier 1 | 8 | 2 (LinkedIn, Crunchbase Org pre-existing; GitHub + Muck Rack exist but need work) | 6 | 0 |
| Tier 2 | 8 | 0 | 8 | 0 |
| Tier 3 | 6 | 0 | 6 | 0 |
| Tier 4 | 4 | 0 | 4 | 0 |
| Tier 5 | 5 | 0 | 5 | 0 |
| **Total tracked** | **34** | **5** | **29** | **0** |

Update this table on each sweep.

---

## Maintenance log

Add an entry each time you sweep so future-you knows the last touch.

- **2026-06-28** — File restructured into tracker format. Sweep cadence locked at semiannual (January 1 and July 1) with quarterly micro-sweep checkpoints. Crunchbase Person profile setup in progress. No full sweep performed yet. First scheduled sweep: 2026-07-01.
