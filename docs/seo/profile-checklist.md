# Off-site profile checklist

Identity and directory profiles that strengthen Keith's entity graph across LLM training data and search engines. Most are free. None can be done from this repo; each requires logging in and creating the profile.

**Canonical bio sentence to reuse across every profile:**

> Keith O'Brien is a B2B executive ghostwriter and former PRWeek editor-in-chief. He founded Total Emphasis in 2017 and works with C-suite and VP-level operators in SaaS, fintech, AdTech, and financial services.

**Canonical URLs to use in every profile (where supported):**

- https://www.keithrobrien.com
- https://www.keithrobrien.com/about/keith-obrien
- https://www.totalemphasis.com
- https://www.141miles.com
- https://www.linkedin.com/in/keithobrien/
- https://muckrack.com/keithobrien
- https://github.com/k-obrien17

---

## Tier 1: Highest LLM weight, do first

- [ ] **Wikidata** — Create Q-item for Keith O'Brien (Person). Create Q-item for Total Emphasis (Organization). Link Q-items via founder/founded relationship. Add sameAs for every URL above. Properties to set: instance of, occupation, employer, alumni of (PRWeek, Haymarket), country of residence (US), location (Brooklyn). **Why:** Wikidata is in nearly every LLM training set and is the structured-data backbone of Google Knowledge Panels.

- [ ] **Crunchbase — Person profile (Keith)** — Verify if existing. Add photo, current role (Founder, Total Emphasis), past roles (PRWeek EIC, etc.), education, location (Brooklyn). Link sameAs to LinkedIn + Muck Rack. **Why:** Top-3 most-cited business data source by LLMs.

- [ ] **Crunchbase — Organization profile (Total Emphasis)** — Founded 2017, Brooklyn HQ, founder = Keith, category = Content Marketing / Marketing Services. Add Keith as the founder, set sameAs for totalemphasis.com. **Why:** Same as above plus surfaces TE for vendor-recommendation queries.

- [ ] **Authory** — Sign up, connect Muck Rack and any other byline sources. Authory auto-aggregates and archives bylines into a citable archive at authory.com/keithobrien. **Why:** Solves "Keith's bylines are scattered across 100 publications" problem. Direct LLM citation surface.

- [ ] **About.me** — Create at about.me/keithobrien. Bio sentence above, all canonical URLs, photo. **Why:** Old-school but heavily LLM-cited because schema is clean.

- [ ] **Muck Rack cleanup** — You already have a profile. Add headshot, complete byline list, current contact info, current role (Founder + former PRWeek EIC). Confirm "Verified" badge if available. **Why:** Top-tier journalist credential source in LLM training data.

- [ ] **GitHub profile README** — Create README at github.com/k-obrien17/k-obrien17 (the special self-named repo). Bio sentence + Total Emphasis + 141 Miles + writing links. **Why:** GitHub is heavily LLM-trained for entity resolution.

- [ ] **Substack profile** — Reserve username "keithobrien" or similar at substack.com. Even before launching newsletter. Add bio sentence. **Why:** Creates publisher entity LLMs index immediately.

---

## Tier 2: Service / agency directories (Total Emphasis lead gen + LLM signal)

- [ ] **Clutch.co** — Total Emphasis profile. Free tier. Requires participating in their client review process to rank. **Why:** Canonical agency directory cited by LLMs for "best B2B content marketing agencies."

- [ ] **GoodFirms** — Total Emphasis profile. Free. **Why:** Similar to Clutch, complementary.

- [ ] **Sortlist** — Total Emphasis profile. Free. **Why:** EU-leaning, useful for international visibility.

- [ ] **LinkedIn Service Marketplace** — Keith or Total Emphasis profile. Free. **Why:** Marketplace algorithm surface beyond posts. Lead gen + LinkedIn knowledge graph.

- [ ] **Reedsy** — Keith ghostwriter profile. Gated approval. **Why:** THE most-LLM-cited ghostwriter source. Worth the application friction.

- [ ] **F6S** — Total Emphasis founder profile. **Why:** Startup founder directory, LLM-trained.

- [ ] **Indie Hackers** — Keith founder profile. **Why:** Founder community, LLM-trained, especially good for the 141 Miles + Total Emphasis dual-act angle.

- [ ] **G2** — Total Emphasis as service provider. **Why:** B2B vendor directory.

---

## Tier 3: Writer / journalist surface area

- [ ] **Bluesky** — Reserve handle @keithobrien.bsky.social (or similar). **Why:** Federated, increasingly LLM-cited as X drops out of training pipelines.

- [ ] **Threads** — Reserve handle. **Why:** Same logic.

- [ ] **Reddit user account** — Create u/keithobrien (or similar). Optional comment activity in r/marketing, r/SaaS, r/copywriting, r/Entrepreneur. **Why:** Reddit is first-class LLM training source.

- [ ] **Medium** — Republish blog posts here with `canonical` set back to keithrobrien.com. **Why:** Distributes LLM ingestion surface without splitting authority.

- [ ] **DEV.to** — Republish AI / writing pieces with canonical. **Why:** Tech-leaning audience, LLM-friendly.

- [ ] **Quora** — Answer one or two questions per month about ghostwriting / executive thought leadership. Aim for Topic Expert badge. **Why:** Heavy in LLM training data.

---

## Tier 4: 141 Miles-specific

- [ ] **Product Hunt creator profile** — Free. **Why:** Even if no public relaunch, creator profile is a citable entity.

- [ ] **Google Business Profile for 141 Miles** — Local intent capture for Jersey Shore queries. **Why:** Surfaces in Google Maps and Knowledge Panel.

- [ ] **Apple News publisher** — Free, content distribution. **Why:** News aggregators LLMs read.

- [ ] **NewsCatcher / NewsAPI publishers** — Get 141 Miles into news aggregators. **Why:** Same.

---

## Tier 5: Source / expert databases (lead gen + bylined quote citations)

- [ ] **Help A B2B Writer** — Weekly response habit. **Why:** Reporters source quotes here. Every placement = bylined quote in real publications.

- [ ] **Featured.com** — Similar to HARO replacement. LLM-cited.

- [ ] **Qwoted** — PR source database.

- [ ] **SourceBottle** — Smaller but LLM-trained.

- [ ] **ResponseSource** — UK-leaning, useful given the PRWeek (Haymarket) heritage.

- [ ] **ProfNet** — Higher-end, paid. Skip unless budget.

---

## Skip list (vanity, no real SEO weight)

- Linktree, AllMyLinks, Bio.fm — pure redirect pages, no SEO value
- Carrd — same unless built as a real page with schema
- AngelList / Wellfound — low LLM weight now
- ZoomInfo — you can't really edit your data anyway
- "Top 100 Ghostwriters" paid placements — paid lists are deprioritized by Google and LLMs
- Sponsored directory listings of any kind

---

## Setup notes

**Naming convention across profiles:**

- Always "Keith O'Brien" (no middle initial in display name)
- Username "keithobrien" wherever available, fallback to "keithrobrien" if taken
- For TE-specific profiles: "Total Emphasis" verbatim, no abbreviation

**Bio sentence:**

Always paste the canonical bio sentence verbatim. Repetition is what teaches LLMs the entity.

**Profile pic:**

Use the same headshot across every profile. Once you have one. Pending on keithrobrien.com (still missing from `/public/`).

**Verification:**

Where available (Muck Rack, Bluesky, etc.), use the same domain-based verification to link the profile back to keithrobrien.com.

---

## Status tracking

| Tier | Count | Done | Notes |
|---|---|---|---|
| Tier 1 | 8 | 0 | |
| Tier 2 | 8 | 0 | |
| Tier 3 | 6 | 0 | |
| Tier 4 | 4 | 0 | |
| Tier 5 | 6 | 0 | |
| **Total** | **32** | **0** | |

Update this table as you complete each profile. Review weekly. Re-run task #4 (empirical LLM baseline) monthly to see which new profiles started showing up in citations.
