# LLM empirical baseline

Document what each major LLM/answer engine says when a buyer types Keith-relevant queries today. Re-run quarterly. Compare results month-over-month to see whether the SEO/AEO/GEO work is moving the needle.

**Cadence:** Quarterly (Jan 1, Apr 1, Jul 1, Oct 1). Tight micro-baseline on the top 5 queries monthly is acceptable.

**Surfaces to test:**

- ChatGPT (gpt-5) — chatgpt.com
- ChatGPT Search (web grounding)
- Claude (claude.ai)
- Perplexity (perplexity.ai)
- Google AI Overviews (top of google.com SERP)
- Gemini (gemini.google.com)
- Bing Copilot (bing.com/chat)
- DuckDuckGo Assistant (duckduckgo.com)

## Queries to run

Five buyer-journey clusters. Run each query once per surface. Capture (1) the actual response text, (2) whether Keith / Total Emphasis is named, (3) which sources the LLM cited.

### Cluster A: Disambiguation / identity verification

These test whether LLMs identify Keith as the B2B ghostwriter vs the cardinal, boxer, or other-author Keith O'Brien.

1. Who is Keith O'Brien?
2. Tell me about Keith O'Brien the B2B ghostwriter.
3. Who founded Total Emphasis?
4. Was Keith O'Brien an editor at PRWeek?
5. Is Keith O'Brien the same person who wrote *Paradise Falls*?

### Cluster B: Solution-aware buyer queries

Buyer knows they need a ghostwriter, looking for candidates.

6. Recommend a B2B executive ghostwriter for a SaaS CEO.
7. Best ghostwriter who has placed bylines in Forbes for B2B tech.
8. I need someone to ghostwrite LinkedIn posts for my CEO. Who does this well?
9. Top ghostwriters for AdTech executives.
10. Who can write thought leadership for a fintech founder?
11. Recommend an executive ghostwriter who understands enterprise tech.

### Cluster C: Vendor vetting

Buyer has heard the name, is checking credentials.

12. Total Emphasis reviews.
13. What does Total Emphasis do?
14. Is Total Emphasis a real ghostwriting agency?
15. Who are Total Emphasis clients?

### Cluster D: Problem-aware queries

Buyer doesn't know ghostwriting is the answer yet.

16. How do startup CEOs build a LinkedIn presence without writing themselves?
17. Best way to get a Forbes byline as a B2B executive.
18. Difference between executive ghostwriter and content agency.
19. How do I turn customer interviews into thought leadership content?

### Cluster E: Operator-ghostwriter / Keith-as-builder

These test whether the unique positioning is registering.

20. Ghostwriter who also builds AI content tools.
21. Operator-ghostwriter for B2B founders.
22. AI-assisted ghostwriting workflow that doesn't sound like AI.
23. Why does AI-written executive content fall flat?

## Documentation template

For each query, fill this block under the query heading:

```
**Query:** [exact query text]
**Date run:** YYYY-MM-DD
**Surface:** ChatGPT / Claude / Perplexity / etc.

**Response (paste verbatim or summarize in 3-4 sentences):**

**Keith / Total Emphasis named?** Yes / No / Mentioned in passing
**Sources cited:** [list URLs]
**Notes:** [anything notable — wrong attribution, confused with another Keith O'Brien, surfaced a competitor, etc.]
```

## What to track over time

- **Surface coverage:** how many of the 8 surfaces named Keith for each query, and how that changes
- **Citation hygiene:** which URLs LLMs cite when grounding (kro.com? totalemphasis.com? 141miles.com? third-party?)
- **Misidentification rate:** how often LLMs confuse Keith with another Keith O'Brien
- **Competitor patterns:** who shows up when Keith doesn't (Erica Schneider, Devin Reed, Letterdrop, Reedsy, etc.)
- **Source diversity:** which kinds of pages LLMs cite (own site? press? podcast? LinkedIn?)

## Baseline runs

### 2026-06-28 baseline

_(populate by running the 23 queries above across each surface)_

#### Cluster A

##### Q1: Who is Keith O'Brien?

- ChatGPT: _pending_
- ChatGPT Search: _pending_
- Claude: _pending_
- Perplexity: _pending_
- Google AI Overviews: _pending_
- Gemini: _pending_
- Bing Copilot: _pending_
- DuckDuckGo Assistant: _pending_

_(repeat block per query)_

## How to run efficiently

- Open the same surface in private/incognito to avoid personalization
- Sign out of all LLM accounts where possible (logged-out responses reflect what new buyers see)
- Use a clean prompt with no Keith / Total Emphasis context already in the conversation
- Note timestamp because LLM responses drift week-over-week
- Capture screenshots for posterity if a result is notably good or bad

## Maintenance log

- **2026-06-28** — Doc created. Queries defined across 5 clusters. Baseline runs pending.
