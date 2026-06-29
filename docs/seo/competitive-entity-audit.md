# Competitive entity-graph audit

Inspecting structured data, sameAs chains, and Person schema across the most-likely competitive set for "B2B ghostwriter" / "executive ghostwriter" / "content strategist for SaaS CEOs" queries.

**Run date:** 2026-06-28
**Method:** Fetched each competitor's home page, parsed JSON-LD blocks, checked for Person schema, sameAs arrays, Wikidata Q-item references.

## Top-line finding

**Almost nobody in the competitive set is doing entity-graph work.** Keith already has more structured data on `/about/keith-obrien` alone than every direct competitor combined. The entity-side of AEO is wide open. But the structural fixes are bleaker than the original draft of this audit suggested: Wikidata requires Wikipedia notability journalist-ghostwriters rarely have. ORCID and ISNI are academic/library identifiers with limited trade-press adoption. The real journalist-relevant moves are density across Muck Rack, Crunchbase, Authory, About.me, and a dense `sameAs` graph linking them all. Keep accumulating press coverage; revisit Wikipedia/Wikidata in 12-24 months.

## Per-competitor results

### Independent ghostwriters / content strategists

| Competitor | URL | Schema | Person Schema | sameAs count | Wikidata |
|---|---|---|---|---|---|
| Erica Schneider | ericaschneider.com | none | ✗ | 0 | no |
| Devin Reed | devinreed.com | none | ✗ | 0 | no |
| Tommy Walker | tommywalker.com | "Coming Soon" | ✗ | 0 | no |
| Camille Trent | camilletrent.com | _DNS fail_ | n/a | n/a | n/a |
| Tom Critchlow | tomcritchlow.com | none | ✗ | 0 | no |
| Justin Welsh | justinwelsh.me | Person + WebSite | ✓ basic | **0** | no |

### Platforms / agencies

| Competitor | URL | Schema | Person Schema | sameAs count | Wikidata |
|---|---|---|---|---|---|
| Letterdrop | letterdrop.com | none | n/a (org) | 0 | no |
| Reedsy | reedsy.com | none | n/a (org) | 0 | no |

## What this means

**The competitive moat on entity-by-name retrieval is essentially undefended.**

Every named competitor has either:
- No schema at all (Erica, Devin, Tom)
- An offline or broken site (Tommy, Camille)
- Minimal schema with no sameAs chain (Justin Welsh, the most successful by content metrics)

Justin Welsh — arguably the highest-revenue content creator in this space — has a `Person` schema with a name field and not much else. No sameAs to LinkedIn, no Wikidata link, no `alumniOf`, no `hasOccupation`, no `disambiguatingDescription`. His audience grew without entity-graph work because his INTENT-side content is overwhelmingly dominant. He's not a model for the entity side; he's a counterexample showing that content-only is possible but probably leaves entity retrieval on the table.

## Keith's current position relative to this set

| Asset | Keith | Justin Welsh | Erica / Devin / Tom |
|---|---|---|---|
| Person schema | ✓ rich (12 properties) | ✓ basic (3 properties) | ✗ |
| disambiguatingDescription | ✓ | ✗ | ✗ |
| alumniOf | ✓ (PRWeek, Haymarket) | ✗ | ✗ |
| hasOccupation | ✓ (2 entries) | ✗ | ✗ |
| sameAs chain | ✓ (7 URLs including /bylines) | ✗ | ✗ |
| ProfilePage schema on press kit | ✓ | ✗ | ✗ |
| FAQPage schema | ✓ (13 questions) | ✗ | ✗ |
| CollectionPage schema on bylines | ✓ | ✗ | ✗ |
| Wikidata Q-item | ✗ (still pending) | ✗ | ✗ |
| llms.txt | ✓ | ✗ (presumed) | ✗ (presumed) |
| Indexable byline archive | ✓ (/bylines, 484 entries) | ✓ (Substack archive) | partial |

Keith is already winning the entity-graph competition by a wide margin. The remaining gap is intent-side: Justin Welsh publishes weekly, Keith has a small public blog.

## Implications for next moves

**1. There is no single structural fix at the identifier layer for non-academic ghostwriters.** Wikidata requires Wikipedia notability. ORCID is academic-oriented with limited trade-press adoption. ISNI is library-oriented and requires a verifying party. None of these is the magic move for a B2B ghostwriter. The real entity-graph density comes from the journalist-specific platforms: Muck Rack (built for journalists), Crunchbase (built for founders), Authory (built for byline aggregation), About.me (lightweight catch-all). Combined with rich Person schema and a dense `sameAs` chain across all of them, that's the practical playbook. Wikipedia/Wikidata become possible only after sustained press coverage accumulates over 12-24 months.

**2. Don't try to outpublish Justin Welsh.** He publishes a Saturday essay every week for 15+ years. The entity-side gap is the asymmetric opportunity. Closing the intent-side gap is a fight Keith probably loses to Justin Welsh on volume.

**3. Maintain the schema lead.** Audit kro.com schema every 6 months (same cadence as the profile sweep). Schema standards evolve. New properties get added. Stay ahead.

**4. Anchor more sameAs nodes.** Currently 7 URLs in the sameAs array. As Crunchbase, Authory, Wikidata, About.me, and Substack accounts come online, add each one. The chain density matters more than any single profile.

**5. Don't bother citing Letterdrop / Reedsy as competitors in comparison content.** They're platforms, not service providers. Different category. Buyers comparing Letterdrop vs Keith are not in the same buying conversation as buyers comparing Erica Schneider vs Keith.

## What this audit missed (acknowledge limitations)

- Only checked home pages. Some competitors may have richer schema on inner pages.
- Didn't look at sitemap.xml depth or content volume per competitor.
- Didn't check sponsored / paid placements or directory rankings.
- Didn't test which competitors actually show up in cold ChatGPT queries (worth a separate run).
- Justin Welsh's email subscriber base and Substack reach aren't captured by entity-graph analysis.

## Suggested follow-up

If you want a fuller picture, the next investigation passes:
1. Run "best B2B executive ghostwriter" cold on ChatGPT, Claude, Perplexity, Google AI Overviews. Who shows up? Compare to this entity-graph baseline.
2. Audit each competitor's Crunchbase, LinkedIn, Muck Rack to see if they have entity work happening OFF their own domain.
3. Check what `site:wikipedia.org` returns for each competitor's name.

These are tractable as a separate research session.

## Maintenance log

- **2026-06-28** — Initial audit. Findings as above. Re-run quarterly to track competitive movement.
