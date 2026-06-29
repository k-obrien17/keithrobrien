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

#### Cluster A

##### Q1: Who is Keith O'Brien?

- **ChatGPT (cold, 2026-06-28):** Listed three Keith O'Briens, none of them this one. (1) Keith O'Brien the author/journalist who wrote Fly Girls, Paradise Falls, Charlie Hustle, Outside Shot, Heartland — written for NYT, Washington Post, NPR, This American Life. (2) Cardinal Keith Michael Patrick O'Brien. (3) Keith O'Brien the U.S. steeplechase jockey who joined the National Steeplechase Association race office in 2025.
  - **Keith / Total Emphasis named?** No
  - **Sources cited:** None visible
  - **Notes:** Worst-case result. ChatGPT confidently surfaced three wrong Keiths without asking for clarification. The other-journalist-Keith is the dominant entity (matches the audit prediction). Steeplechase Keith is a new disambiguation target we hadn't catalogued. Keith O'Brien the ghostwriter is completely absent from ChatGPT's training data prior set. Action: density across journalist-specific platforms (Muck Rack, Crunchbase, Authory, About.me) + maintain dense sameAs graph + accumulate press coverage so Wikipedia/Wikidata eventually become possible. There is no single structural identifier (Wikidata, ORCID, ISNI) that fixes this for non-academic ghostwriters.
- ChatGPT Search: _pending_
- **Claude (cold, no grounding, 2026-06-28 5:09 PM):** Common name, needed more context. Named the Scottish Cardinal (Archbishop of St Andrews and Edinburgh) who resigned in 2013 as primary. Acknowledged "others in journalism, politics, and sports" generically without naming Keith. Asked clarifying question.
  - **Keith / Total Emphasis named?** No
  - **Sources cited:** None (no grounding mode)
  - **Notes:** Disambiguation hypothesis confirmed. Cardinal is the default. Cold query offers no path to Keith. Action: dense `sameAs` chain + density across journalist-specific platforms (Muck Rack, Crunchbase, Authory, About.me). Wikipedia/Wikidata get revisited after press accumulates over 12-24 months.
- **Claude (grounded, with user-skills context, 2026-06-28):** Found Keith correctly. Named Total Emphasis, content + digital marketing consultancy, Brooklyn, 20+ years. Listed client verticals (agencies, ad tech, business consultancies, telecom, information security). Correctly named PRWeek and DMN (formerly Direct Marketing News) editor-in-chief. Named Econsultancy and TMRW prior roles. Then hedged: "I suspect you're a different Keith O'Brien than the one above" because Claude.ai's session had access to Keith's skills directory (executive-ghostwriter, prospecting templates, voice profile).
  - **Keith / Total Emphasis named?** Yes
  - **Sources cited:** LinkedIn
  - **Notes:** Caveat — this run was NOT cold. Claude.ai had user-skills context loaded which biased toward "the user IS Keith." For a true buyer-experience baseline, need an incognito Claude.ai session with no skills loaded. Also: "telecom and information security providers" overstates the current vertical mix (telecom is dormant via T-Mobile). Otherwise factually accurate.
- Perplexity: _pending_
- Google AI Overviews: _pending_
- Gemini: _pending_
- Bing Copilot: _pending_
- DuckDuckGo Assistant: _pending_

#### Cluster B

##### Q6: Recommend a B2B executive ghostwriter for a SaaS CEO

- **ChatGPT (cold, 2026-06-28):** Shortlisted Keith O'Brien of Total Emphasis as a strong fit. Positioned him as content strategist and ghostwriter for founders and executives. Listed experience across AdTech, SaaS, consulting, telecom, security. Named services: thought-leadership ghostwriting, content strategy, longform/book development, SEO/inbound content, sales enablement. Identified senior agency/startup background plus head of content/digital marketing at SaaS startup. Framing: "best suited for a CEO who wants more than 'LinkedIn posts' — someone who needs executive narrative, category POV, longform thought leadership, and a content system around the CEO's ideas." Then continued with "A few other options worth comparing:" before being cut off in capture.
  - **Keith / Total Emphasis named?** Yes, shortlisted as primary recommendation
  - **Sources cited:** Not visible
  - **Notes:** This is the critical finding. ChatGPT HAS the content data on Keith and Total Emphasis. It can retrieve him by intent ("B2B exec ghostwriter for SaaS CEO") but cannot identify him by name cold. Entity linkage problem, not content problem. Positioning ChatGPT surfaced is on-brand: executive narrative, category POV, longform, content system, not just LinkedIn posts. Action: identify where competitors named in the "other options" line are coming from — those are the comparison set ChatGPT thinks of.
- **Claude (grounded, 2026-06-28 5:17 PM):** Recommended Keith O'Brien of Total Emphasis with strong detail. Named former editor-in-chief PRWeek and DMN. Highlighted "publication standards from the editor's side" framing for byline placement. Named client industries: B2B SaaS, ad tech, global consultancies. Quoted a specific price range ($5K–$10K/month) and called it appropriate for the engagement scope. Linked the portfolio as keithobrien2.contently.com. Pointed at LinkedIn for direct inquiries. Honest caveat: "recommending based on public profile data, not firsthand knowledge of his ghostwriting work specifically." Advised buyer to ask for bylined work, not just content produced.
  - **Keith / Total Emphasis named?** Yes, primary recommendation
  - **Sources cited:** keithobrien2.contently.com (stale portfolio link), LinkedIn
  - **Notes:** Best response on this query so far. Specific credentials (PRWeek + DMN), specific verticals, specific price range, named portfolio link, named contact channel. Two issues to act on: (1) the Contently link is stale; needs to be replaced or removed; (2) neither totalemphasis.com nor keithrobrien.com surfaced as the portfolio URL, even though those should be canonical now.
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
