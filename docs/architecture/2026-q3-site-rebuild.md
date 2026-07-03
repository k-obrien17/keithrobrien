# kro.com Q3 2026 site rebuild — architecture spec

> **Status: strategy only, not built.** This is the recovered architecture spec for the
> planned keithrobrien.com information-architecture reorg. As of 2026-07-02 no reorg
> routes exist in code (current routes remain `about / bylines / now / projects /
> writing`). Execution is gated on the still-open nav decisions listed below.

**Provenance:** Recovered verbatim from the 2026-06-29 design session (delivered in
conversation, never previously committed). Content is unchanged except for punctuation
normalized to house style (em-dashes removed). The source brief and follow-up nav-pattern
research from that session remain in the session transcript and can be appended on request.

---

## Decisions locked since this spec (these override the spec where they conflict)

Captured from the 2026-06-30 handoff. The spec below predates them; where they disagree,
these win.

1. **Polished register**, not lab/raw. Drop the status labels (live / prototype /
   retired) proposed in spec sections 11 and 20. No "Field Notes" as a nav category.
   "Crate" is curated picks, not a weekly diary.
2. **kro.com = irrepressibly curious operator hub, NOT a buyer-funnel.** totalemphasis.com
   owns the buyer-funnel. kro.com soft-links out to it. This confirms and hardens the
   kro/TE split the spec opens with.
3. **Keith's proprietorship of Total Emphasis is a core, visible part of kro.com identity**
   (Level 2 prominence). ~~A dedicated `/total-emphasis` page written in kro.com voice that
   links out to the business.~~ **REVISED 2026-07-03: the `/total-emphasis` page is
   CANCELLED.** A thin interstitial adds click-friction for humans and is a weak SEO asset.
   The proprietorship signal lives instead in two already-shipped places: the `total
   emphasis ↗` nav slot links directly to totalemphasis.com, and `/about` states it in
   Keith's own voice with an inline anchor-text link on the first "Total Emphasis" mention.
   Do not build the interstitial page.
4. **Music page** = text tracklist + Spotify playlist link, no embeds. The Diffraction
   stays a separate publication, linked from the music page.
5. The **"AI doesn't challenge you"** pillar is parked; the framing is not right. Do not
   seed it as issue 1 or a pillar.
6. **Resume** renders from the canonical bio at
   `vault/120-Resources/Keith O'Brien Experience.md`.

## Nav locked (2026-07-02)

The nav is decided. **Verb lane, three content verbs plus utility items:**

```
keith o'brien    write · build · collect · about       total emphasis ↗ · say hi
```

- **write** (`/write`) — essays under Keith's name; **bylines** folds under it (reachable at `/bylines`).
- **build** (`/build`) — projects, renamed. "Build" chosen over "Systems."
- **collect** (`/collect`) — the consumption hub: `/collect/music`, `/collect/reading`, `/collect/watching`. "Collect" chosen over Crate / Shelf / Stack / Consume: it is an active, taste-signaling verb that matches the verb lane without the passive read of "consume" or the tech-collision of "stack."
- **about** (`/about`) — bio; resume + press kit (`/about/keith-obrien`) live inside.
- **total emphasis ↗** (`https://totalemphasis.com`) — right-side nav slot with an external arrow, satisfying the Level-2 "core, visible" decision without cluttering the content verbs. REVISED 2026-07-03: links directly to the external site (no `/total-emphasis` interstitial; see decision 3).
- **say hi** — accent mailto, right-aligned (as today).

Structural consequences:
- **No `/start` page.** Home is the orientation surface (dropped from the spec's proposal).
- **`now` folds onto home** as a section; keep the `/now` page for the now.page convention.
- **No thesis-shaped nav item.** Six items is the ceiling.
- Do not mix verbs and nouns: the lane is all-verb (write / build / collect), so a noun label like "shelf" is out.

## Writing / bylines content model (locked 2026-07-02)

The organizing axis is **whose name the work is under, not where it was published.**

- **`write` = Keith's own voice only:** on-site essays (MDX) plus his own named bylines
  elsewhere, shown as a curated "published elsewhere" link list. Both are Keith writing as
  Keith; venue is incidental.
- **Ghostwritten work does NOT live on kro.** It becomes a **direct link to Total Emphasis**
  (the business owns that proof). The archive's `ghostwritten_for` entries (164 of 535) drop
  off kro's public surface; a single "ghostwritten work → Total Emphasis" link replaces them.
- **Curated, not exhaustive.** The "published elsewhere" list is a hand-picked selection, not
  all 371 own-byline entries. Note that 261 of the own-bylines are PRWeek news items from the
  EIC years; curation should trim these to highlights so `/write` is not a PRWeek wall.

**Linked number change (do at the same time as the split, never before):** the public byline
count currently reads "400+", which counts own + ghostwritten against the mixed archive. When
ghostwritten leaves kro, the honest figure is the curated own-byline count (roughly "300+"
depending on how deep PRWeek is kept). Update home.json, about.json, recently-shipped.json,
the keith-obrien FAQ, llms.txt, and llms-full together at that moment so nothing contradicts.
Until the split ships, the live `/bylines` still shows the mixed 407, so "400+" stays correct.

## Still-open decisions

1. **Hero copy:** spec section 27 option A / B / C, or another. (The verb-triad identity favors A.)
2. **Content sourcing** for the net-new surfaces, which only Keith can supply:
   - `/collect/music` — playlist titles, tracklists, Spotify links
   - `/collect/reading` and `/collect/watching` — starter picks
   - `/total-emphasis` — the kro-voice page copy

Phase 1 (spec section 35) is now unblocked and can execute on Keith's go: rename `/projects`
to `/build` and `/writing` to `/write` (with redirects), update `components/nav.tsx` to the
locked nav, add the `/total-emphasis` slot. The `/collect` hub and hero rewrite follow once
the content above exists.

---

## The recovered spec (2026-06-29)

## The tension

Earlier you defined the kro.com job clearly: **irrepressible curious operator hub** with builds, writing, and personal passions (music, movies). TE handles the B2B business funnel separately.

This brief includes "Work With Me" + named Offers, which read as buyer-funnel surfaces. That sounds like it contradicts the kro/TE split.

It doesn't, if we resolve it this way:

**kro.com is your public brain.** Workshop, archive, lab, listening post. Work With Me exists but is a soft surface, one door among ten, so peers who land here and want to hire you have a path. TE.com remains the active buyer-funnel for paid ghostwriting work. kro.com soft-funnels to TE for any "yes I want to hire you to ghostwrite" intent. Everything else (research files, systems, music crates, field notes) is for the curious operator, the peer, the journalist, the future collaborator, the next-self you're talking to.

That's the resolution. The brief's Work With Me page becomes lighter (1-2 named engagements + "for ghostwriting, go to TE"), not 6 offers fighting for attention.

OK. Full spec below. I'll mark anything that's a decision-point still needing your call.

---

# kro.com architecture spec

## 1. Deep critique of what this site needs to be

You don't have a content problem. You have a **frame problem**. Your work spans PRWeek + IBM (43% of marketing traffic) + McKinsey/Google DeepMind LinkedIn ghostwriting + 141 Miles full-stack publishing engine + an Obsidian CRM + MCP servers + a music newsletter + an articles-search MCP + soccer trivia + AI-newsletter pipelines for the Jersey Shore. That's not scattered, it's coherent. But it READS scattered because there's no thesis tying it together on the current site.

The fix isn't more content. It's a thesis the site enforces:

> **All of this is the same work: turning messy knowledge into things that work in public.**

Once that thesis exists at the top of every surface, the breadth stops looking like sprawl and starts looking like range with a method.

Your danger: under-frame the breadth, look like a generalist. Your opportunity: over-frame the breadth, become the recognizable operator-ghostwriter category leader.

## 2. Site metaphor

**The Workshop.**

Not a portfolio. Not a blog. A workshop, where Keith writes, builds, archives, listens, notices, and ships. Inside the workshop:

- **Bench** (Systems): where things get built
- **Archive** (Writing + Bylines): where things get preserved
- **Crate** (Stack: music + reading + watching): what's coming through the workshop
- **Field Notes** (short observations): the running commentary
- **Doorbell** (Work With Me): how to engage
- **Colophon** (back room): how the workshop itself is built

This metaphor scales with whatever you add. Mention it once on the Start page, then let the structure do the work.

## 3. Positioning statement

> **I'm Keith O'Brien. I run a workshop where writing, strategy, archives, and lightweight tools become the same kind of work: making complicated knowledge usable in public.**

## 4. Five alternates

1. **I build systems around ideas.** Brief's recommendation. Crisp, abstract.
2. **I write things, build things, notice things.** Three-verb, playful, matches the curious-operator framing exactly.
3. **The workshop of an operator-ghostwriter who builds.** Names the role + the disposition + the verb.
4. **Operator-ghostwriter. Builder. Editor for hire. Reporter since 2001.** Resume-flavored, four-noun.
5. **I make complicated knowledge work in public.** Most accurate to the actual through-line. Single-sentence thesis.

My pick: **#2 as H1 tagline ("// write things, build things, notice things") + #5 as subhead.** They work together: playful identity above the answer-sentence.

## 5. Top nav

```
Start  ·  Write  ·  Build  ·  Stack  ·  Notes  ·  Now  ·  About
```

7 items is one more than ideal, but each is load-bearing. Cuts if needed: drop "Notes" (fold into Write) or "Now" (move to Start page section). Recommended minimum:

```
Start  ·  Write  ·  Build  ·  Stack  ·  About
```

5 items + soft mailto. **Bylines** lives inside Write (or stays as separate sub-nav on /write). **Resume** lives inside About.

`Start` instead of `Home` because the brief is right, Start is the door, Home is the address. Start tells someone "begin here."

## 6. Full sitemap

```
/                          Front door (calm, three doors, a pulse)
/start                     Orientation page, how to read the site, who you are, where to begin
/write                     Writing index, organized by theme + canon/backlist/current
/write/[slug]              Essay
/write/feed.xml            RSS
/bylines                   Ghostwritten + bylined archive (existing, 534 PUBLIC)
/build                     Builds index, flagship, working, prototype, retired, lab
/build/[slug]              Per-build page (template-driven)
/stack                     Stack hub
/stack/music               Playlists + tracklists (text + Spotify links)
/stack/reading             Books, longreads, newsletters
/stack/watching            Movies, TV, docs
/notes                     Short observations / field notes / link blog (Kottke-flavored)
/notes/[slug]              Permalink for any note worth one
/research                  Research Files index (deep crates)
/research/[slug]           Individual research file
/now                       What's on the bench right now
/work-with-me              Soft conversion: 1-2 named engagements + pointer to TE
/about                     Operating system page (how I think, what I notice)
/about/keith-obrien        Press kit (existing, unchanged)
/resume                    Chronological career, rendered from canonical bio
/index                     Catalog view, filterable, taggable, everything
/colophon                  Back room, stack, methods, how the site is built
/llms.txt + /llms-full.txt + /robots.txt + /sitemap.xml   Infra
```

Redirects: `/projects` → `/build`, `/writing` → `/write`, `/press` reserved (not built yet), `/cv` → `/resume`.

## 7. Homepage wireframe

```
+---------------------------------------------------------------+
| // write things, build things, notice things                  |
|                                                               |
| Keith O'Brien                                                 |
|                                                               |
| I make complicated knowledge work in public.                  |
| Operator-ghostwriter, former PRWeek EIC, builder. Brooklyn.   |
|                                                               |
| [ Start here → ]   [ Work with me ]                           |
+---------------------------------------------------------------+
|                                                               |
| // three doors                                                |
|                                                               |
| WRITE              BUILD              STACK                   |
| Essays, bylines,   141 Miles, MCP,    Music, reading,         |
| field notes, the   tools, workflows,  watching, what's        |
| Diffraction.       small experiments. coming through the      |
|                    Status-labeled.    workshop right now.     |
+---------------------------------------------------------------+
|                                                               |
| // on the bench                                               |
|                                                               |
| 1. 141 Miles, building the v3 town pages this week           |
| 2. Operator-ghostwriting newsletter on Resend                 |
| 3. Capturing past bylines for archive search                  |
+---------------------------------------------------------------+
|                                                               |
| // recently shipped                                           |
|                                                               |
| [existing component, unchanged]                               |
+---------------------------------------------------------------+
|                                                               |
| // selected from the workshop                                 |
|                                                               |
| Flagship: 141 Miles                                           |
| Newest writing: How I'd rank for AI Overviews                 |
| Field note: <most recent /notes>                              |
| Crate: <latest music playlist>                                |
+---------------------------------------------------------------+
|                                                               |
| // start with a set                                           |
|                                                               |
| → If you're a founder thinking about LinkedIn                 |
| → If you're an editor or journalist vetting a source          |
| → If you build things and want to see the workshop            |
| → If you came here for the music                              |
| → If you want the weird stuff                                 |
+---------------------------------------------------------------+
|                                                               |
| // colophon · footer (existing)                               |
|                                                               |
+---------------------------------------------------------------+
```

## 8. Start page wireframe

A dedicated orientation page that does NOT live on the home. The home is the front door. Start is the "first read me" for new visitors.

```
# Start

## What this site is
The Workshop. One sentence each on writing / building / archive / listening.

## What I do
Three paragraphs max. Operator-ghostwriter for B2B execs. Builder of tools 
and publications. Reporter since 2001.

## The thesis
"All of this is the same work: turning messy knowledge into things that work 
in public."

## Start here, by who you are
- If you're a founder vetting a ghostwriter → /work-with-me + /bylines
- If you're an editor or journalist → /about/keith-obrien + /bylines
- If you're an operator/builder peer → /build + /notes
- If you came for the music → /stack/music + thediffraction.com
- If you want the weird stuff → /index?tag=weird + retired prototypes
- If you want to see how the site works → /colophon

## Current canon (5 pieces)
Hand-picked: 1 byline, 1 build, 1 essay, 1 research file, 1 field note.

## What's actively on the bench
3 in-progress items.
```

## 9. Work page → renamed Bylines (already exists)

Keep `/bylines` as built. The brief's "Work" page mostly duplicates what's already there. Skip a separate Work page; consolidate everything client/byline into `/bylines` with theme + status filters added.

Within /bylines, add filter tabs:
- **All** (default, 534 entries)
- **My byline** (Keith as author, PRWeek, DMN, Medium, Econsultancy, kro.com)
- **Ghostwritten** (under client-exec byline, IBM, Realeyes, UST, etc.)
- **By industry** (B2B SaaS, AdTech, MarTech, Insurance, etc.)
- **By year** (decade-grouped)

For named case studies that need depth (not just a byline list), use the existing /build template pattern adapted:

```
/case-studies                  Index, 3-5 named case studies, not portfolio grid
/case-studies/ibm-organic-traffic
/case-studies/mckinsey-linkedin
/case-studies/realeyes-content-system
```

This is where the IBM 43% number lives in detail. Optional addition; defer until you have 3 worth writing up.

## 10. Write page structure

```
# Write

A running archive of essays, notes, and bylines under my name.
For ghostwritten work, see /bylines.

## Themes
[Topic hub navigation]

- AI, work, and writing craft
- Media, advertising, attention
- Operator essays / builder notes
- Sports + performance
- Local systems + publishing  
- Music + culture (or → thediffraction.com)
- Personal / Brooklyn / memoir

## Canon
Hand-picked 5-10 best pieces. The shortcut for new readers.

## All posts
Reverse chronological. Each card shows:
  - Title
  - One-line argument (excerpt)
  - Theme tag
  - Date
  - Status: essay / note / field note / canon
```

Each post gets BlogPosting schema (already done) + the new "one-line argument" line as excerpt + theme tag.

## 11. Build page structure

```
# Build

The bench. Things made in the workshop. Some live, some prototype, 
some retired, some private. Status-labeled.

## Flagship
141 Miles, Jersey Shore publishing engine, AI newsletter pipeline, 
beach decision engine, Sand Dollar endorsement mechanic.
[Full page]

## Working
- Vault Chatbot, MCP server for 15K-note Obsidian CRM. [live]
- Article Search, MCP server for indexed source library. [live]
- Total Emphasis Workflow, Tauri desktop app for ghostwriting pipeline. [live]
- Ironlog, Obsidian-native fitness tracker. [live]
- Control Panel, central dashboard for the stack. [live]

## Prototypes + experiments
World Cup Price Tracker, Soccer Trivia, Ideas, Daily 10, Media Library, 
Client Pulse, etc. Smaller things; status labels show what state they're in.

## Retired
8th Chair, Backyard Marquee, etc. Frame as "useful failures", what 
each taught.
```

## 12. Stack page structure

```
# Stack

The crate. What's coming through the workshop right now.
Music, reading, watching, obsessions. Updated when something lands, 
not on a schedule.

## Music
[Playlist title]
Listen on Spotify →
- Track 1, Artist
- Track 2, Artist
- Track 3, Artist
[Why this set, in 1-2 sentences]

[Multiple playlists, newest first]

Also: thediffraction.com, my music publication.

## Reading
- Book / longread / newsletter, 1-line why it landed

## Watching  
- Movie / TV / doc, 1-line why it landed

## Obsessions
- Whatever's grabbing attention this month, 1-line
```

## 13. Research Files page structure

```
# Research Files

Deep crates. Topics I'm actively tracking, organized for reuse.
These are working files, not finished essays.

## Active
- World Cup advertising archive, tracking how brands actually show up 
  during the tournament
- AI/GEO/SEO visibility notes, running observations on what LLMs 
  surface and why
- Local publishing intelligence, patterns from running 141 Miles
- Jersey Shore places + events, operational corpus behind 141 Miles
- Media/AdTech consolidation, who's buying whom, why it matters
- Sports psychology source bank, for client work + personal interest

## Each file shows
What it tracks · Why it exists · Sources · Last updated · 
Best artifact · What I've learned · Related writing
```

Build only after you have 2-3 real ones. Don't fake it.

## 14. Now page structure

Already exists. Restructure slightly:

```
# Now

## On the bench (this week)
3-5 items currently active.

## What I'm writing
Drafts, half-finished, what's about to ship.

## What I'm researching
Active research file topics.

## What I'm reading / listening to
Pulls top 1-2 from Stack.

## What I'm available for
1 sentence. Soft.

## Recently shipped
Last 5 things that landed. (Already exists on home; can mirror here.)

Last updated: [YYYY-MM-DD]
```

## 15. Work With Me page structure

The brief proposed 6 offers. Per the kro/TE split, kro.com hosts maybe 1-2 lightweight engagements and points the rest at TE. Keep it short:

```
# Work With Me

I do most paid work through Total Emphasis (totalemphasis.com), my B2B 
ghostwriting practice. Two engagement modes typically run through here:

## The Executive POV System
For founders and execs who want a sharper public voice. 
Positioning + voice guide + recurring publishing system.
[Soft CTA: email keith@totalemphasis.com]

## The Archive-to-Asset Sprint
For solo operators or companies with a big body of underused material.
Audit + asset map + reusable proof bank + publishing roadmap.
[Soft CTA: email]

## Everything else
For content strategy programs, longform ghostwriting, full retainer work, 
or AI editorial systems → totalemphasis.com.

For collaborations, podcasts, interviews, panels → keith@totalemphasis.com.
```

## 16. About / Operating System page

```
# About

The short version: I'm a B2B content strategist and executive ghostwriter, 
former editor-in-chief of PRWeek, and founder of Total Emphasis. I've been 
a reporter since 2001. I run 141 Miles, build small tools, and write about 
how complicated knowledge becomes useful in public. Brooklyn.

For the press kit / canonical bio → /about/keith-obrien
For the chronological resume → /resume

## What I notice
[3-5 sentences on what catches your attention: gaps between what experts 
know and what gets published, how content stops compounding, how AI is 
changing the editor's seat, etc.]

## How I think
[3-5 sentences on the method: reporter habits, archive-first, systems 
behind sentences, etc.]

## Why writing and building belong together
[2-3 sentences on the through-line, making knowledge usable is the same 
skill whether the output is an essay or a publishing engine.]

## What pulls me in
Complex domains. Founder-led content. Editorial systems. Anything with 
"how does this actually work" buried under noise.

## What I'm unusually good at
Entering a complex domain fast. Finding the argument. Building the system 
around it. Editing executives whose names you'd recognize. Shipping the 
thing.

## What I'm not interested in
Generic content marketing. SEO-first writing. Ghostwriting for people 
who won't do interviews.

## Trust me with...
Messy, high-context work that needs both editorial judgment and 
operational follow-through.
```

## 17. Index page structure (catalog view)

The brief's DJ-discography idea. Build this AFTER the core surfaces work.

```
# Index

Everything. Filterable.

[Filter chips]
Type: writing · build · byline · research · note · stack · case-study
Topic: AI · media · attention · sports · local · music · culture · ops
Status: canon · live · prototype · retired · private · in-progress
Era: 2003-2010 · 2011-2017 · 2018-2024 · current

[Result table]
Date | Type | Title | Topic | Status
```

## 18. Colophon page

```
# Colophon

How the workshop is built.

## Stack
Next.js 16 (App Router), TypeScript, Tailwind 4, IBM Plex Mono + Sans, 
MDX for writing, Vercel for hosting, GitHub for source. JSON-LD + 
llms.txt for LLM discoverability.

## Content model
- Writing → MDX in /content/writing/
- Bylines → manifest at /content/bylines-archive.json, generated from 
  vault/030-Works canonical files
- Builds → typed list in /lib/builds.ts
- Stack → MDX, updated when something lands
- Research files → MDX
- Notes → MDX, lightweight

## How writing becomes archive
1. Drafted anywhere (often in Obsidian)
2. Finished MDX pasted into /content
3. Git push → Vercel deploys

## How bylines flow in
Captured via vault/000-OS/Claude/scripts/archive/capture_byline.py.
One command per new piece. Auto-regenerates the kro.com manifest.

## How AI fits in
Claude Code for editorial + dev. Cron jobs for vault sync. MCP 
servers for retrieval.

## How tags work
Each piece carries a topic tag (one of: ai, media, attention, sports, 
local, music, culture, ops, personal). Index page filters by these.

## What's automated, what's manual
Bylines archive: automated capture + manual review. Writing: manual. 
Stack: manual. Now: manual + occasional Claude refresh.

## What I'm still improving
[Running list of site itself's open items.]
```

## 19. Recurring editorial formats

Six named formats. Each is a content type the site repeatably ships:

1. **Field Note**, Short link + commentary. Kottke-style. 100-400 words. `/notes/`
2. **System Behind the Sentence**, Essay-object that unpacks a build OR a content system. `/build/[slug]` or `/write/`
3. **Content Autopsy**, Postmortem on a piece (yours or someone else's) of public content. `/write/`
4. **AI Visibility Check**, Recurring check on what LLMs say about a topic, brand, or person. `/research/` or `/write/`
5. **Crate Drop**, New music playlist write-up. `/stack/music/`
6. **The Stack This Quarter**, Quarterly "here's what's in the workshop" summary. `/notes/` or quarterly newsletter

## 20. Status taxonomy for projects/builds

```
live          public and working
prototype     functional but rough
private       built for personal use, not public
client        commercial; cannot show
retired       was live, intentionally taken down
archived      preserved but inactive
in-progress   actively being built right now
research      not a product; a working file
prompt        a prompt or workflow system, not a tool
utility       small one-off
playground    pure experiment
```

## 21. Tags + filters (one master taxonomy)

**Type:** writing, build, byline, research, note, case-study, stack
**Topic:** ai, media, attention, sports, local, music, culture, ops, personal, ghostwriting
**Status:** canon, live, prototype, retired, private, in-progress, client, research
**Era:** 2003-2010, 2011-2017, 2018-2024, current

Apply consistently. The Index page filters on all four.

## 22-26. Templates

**Case study template** (`/case-studies/[slug]`):
```
Problem · Context · What I did · Artifact · Outcome · 
What it proves · Related writing · Related system
```

**Build/System template** (`/build/[slug]`):
```
What it is (1 sentence) · Status · Why I built it · Problem it solves · 
Stack/workflow · Screenshots · What I learned · Links · Related writing
```

**Research file template** (`/research/[slug]`):
```
What it tracks · Why it exists · Sources · Last updated · 
Best artifact · What I've learned · Related writing · Potential commercial use
```

**Essay template** (`/write/[slug]`):
```
Frontmatter: title, date, excerpt (= one-line argument), theme, status
Body: MDX
JSON-LD: BlogPosting (already implemented)
```

**Offer template** (`/work-with-me`):
```
Name · Who it's for · Pain it solves · What happens · 
What you leave with · Typical timeline · CTA
```

## 27. Homepage above-the-fold copy (3 candidates to pick from)

**Option A (playful + thesis):**
```
// write things, build things, notice things

Keith O'Brien

I make complicated knowledge work in public.
Operator-ghostwriter, former PRWeek EIC, builder. Brooklyn.

[ Start here → ]   [ Work with me ]
```

**Option B (workshop metaphor lead):**
```
// the workshop of an operator-ghostwriter

Keith O'Brien

I build systems around ideas: essays, executive POVs, research files, 
publishing engines, and tools that help complex companies turn what 
they know into public proof.

[ Start here → ]   [ Work with me ]
```

**Option C (terse builder):**
```
// I write. I build. I notice.

Keith O'Brien

Operator-ghostwriter for B2B founders and executives. Builder. 
Former PRWeek editor-in-chief. Brooklyn.

[ Start → ]
```

Recommend **A**.

## 28. Proof modules to gather

If they exist, surface them. If they don't, prioritize capture:

- [ ] **IBM 43% organic traffic**, already on resume; needs a dedicated case-study page with the context, the team, the system you built
- [ ] **McKinsey/DeepMind/Sodexo LinkedIn doubling**, needs at least one named-with-permission case study (probably McKinsey via Joachim Bleys testimonial)
- [ ] **PRWeek EIC artifact**, front pages, masthead, a piece you're proud of
- [ ] **141 Miles in-app screenshots**, the CMS, the decision engine, the Sand Dollar mechanic
- [ ] **Testimonials**, 3-5 PUBLIC ones from PUBLIC clients, surfaced on home or work-with-me
- [ ] **The IBM 165+ pages in a year**, quantified
- [ ] **Vault scale**, "15,000+ markdown files indexed" as a colophon stat that signals system thinking

## 29. Missing assets to collect

- Professional headshot (consistent across LinkedIn, Crunchbase, Muck Rack, kro.com, TE, same image)
- 141 Miles screenshots in multiple states (desktop, mobile, an example town page)
- Press kit photo + one-line bio variations (short, medium, long)
- Spotify playlist URLs + a few starter tracklists
- 3-5 named case studies written up to the template
- 5-10 essays under your own name (not just the 2 drafts) for /write to feel populated
- Cover photos or visual marks for builds, research files, playlists

## 30. What to hide, merge, retire, elevate

**Elevate:**
- 141 Miles → full Build page with depth
- PRWeek EIC credential → into the hero proof strip + Start page + About
- IBM 43% number → its own case-study page (eventually)
- /bylines → as you already did, into nav

**Merge:**
- /now → Start page section AND a /now page (keep the page for the now.page convention; mirror to Start)
- Diffraction → linked from /stack/music, not a separate top-nav item
- 8th Chair + Backyard Marquee + Daily 10 + Soccer Trivia → "Retired / Playground" subgrid on /build, not flagship treatment

**Retire from public view:**
- /writing/hello-world (placeholder)
- /writing/template (template, shouldn't be public)

**Hide entirely:**
- Anything on the current Projects page that's pure scaffolding (Personal Claude config layer, etc.)

**Rename:**
- /projects → /build
- /writing → /write
- "Projects" in nav → "Build"
- "Survival Signal" newsletter mention in /about → remove (on hiatus per Keith)

## 31. Internal linking strategy

Every piece links across at least 2 of: another piece of writing, a build, a research file, a case study, an offer. The site rewards depth-traversal.

- Builds link to related writing and the case study they support
- Research files link to builds they feed and writing they spawn
- Writing links to the build or research file it came from
- Case studies link to the writing + the build + the offer
- Home Start page recommends one of each: 1 byline, 1 build, 1 essay, 1 research file, 1 note

Topic hubs at /write/?topic=ai bring up everything tagged "ai" across writing, builds, research, and notes. Same for every topic tag.

## 32. SEO / GEO / AEO

Mostly done this session. Outstanding moves specific to the new architecture:

- Person schema gets one more sameAs once /resume goes live
- Each Build gets `SoftwareApplication` schema with creator → Person@id (extends existing)
- Each Research File gets `CreativeWork` schema with topic tag
- Each Case Study gets `Article` schema with mentions of named clients
- Index page gets `CollectionPage` with hasPart enumeration (same pattern as /bylines)
- Footer + colophon repeat the canonical bio sentence one more time
- /start page is the LLM-friendly orientation surface, write its copy with "What is this site / Who is Keith" as snippet-ready answers

## 33. How the site makes writing and building feel like one practice

Three concrete moves:

1. **Cross-link relentlessly.** Every Build page has a "Related writing" section; every essay has a "Built from / built for" section if applicable.
2. **Name the through-line in every section's header.** Workshop, archive, lab, never "blog," "portfolio," "projects."
3. **Show the source.** A piece of writing about content systems gets to point at the actual MCP server it spawned. The MCP server's page links back to the essay that started it. This is the proof.

## 34. How the site converts skeptical buyers

This is TE's job mostly. For the rare buyer who lands on kro.com first:

- /about/keith-obrien press kit answers all the skeptical questions (the 13-Q FAQ)
- /bylines proves output volume
- /build proves operator depth
- /work-with-me names the two engagement modes + points the rest at TE
- Testimonials on home + work-with-me close the trust gap
- The IBM number anchors credibility

The conversion path: Start → /bylines (range + scale) → /build/141-miles (depth + operator) → /work-with-me → email or TE.com.

## 35. Prioritized implementation plan

**Phase 1: Restructure (1-2 sessions)**
1. Rename `/projects` → `/build`, `/writing` → `/write`; add redirects
2. Update nav: `Start · Write · Build · Stack · About`
3. Rewrite homepage with new H1 + thesis + three doors + on-the-bench section
4. Build /start page
5. Build /stack hub (just music + reading to start; watching can wait)
6. Build /resume page from canonical
7. Build /colophon

**Phase 2: New surfaces (1-2 sessions)**
8. Build /build/[slug] template + first 3 build pages (141 Miles, Vault Chatbot, Article Search)
9. Build /notes index + first 3 field notes
10. Build /research index (empty until you have a real one) + first research file (most likely candidate: AI/GEO visibility notes, you've been collecting this already)
11. Build /work-with-me (2 named engagements + TE pointer)

**Phase 3: Catalog (1 session)**
12. Build /index page with type/topic/status/era filters
13. Tag everything that exists
14. Apply consistent topic hubs to /write

**Phase 4: Content gathering (ongoing, you)**
15. Write 5-10 essays under your own name across the theme set
16. Capture screenshots + write up 141 Miles + 2-3 other Build pages
17. Get 3-5 testimonials from PUBLIC clients
18. Build the IBM case study

**Phase 5: Polish + iterate**
19. Run the LLM baseline against the new architecture
20. Sweep with house-style skill before any public push
21. Audit Stack updates monthly

## 36. Handoff-ready architecture (what Claude Code / Cursor / a dev gets)

```
PAGES TO CREATE:
- app/start/page.tsx
- app/build/page.tsx (rename from app/projects/)
- app/build/[slug]/page.tsx (new template)
- app/stack/page.tsx
- app/stack/music/page.tsx
- app/stack/reading/page.tsx
- app/stack/watching/page.tsx (optional, defer)
- app/notes/page.tsx
- app/notes/[slug]/page.tsx
- app/research/page.tsx
- app/research/[slug]/page.tsx
- app/work-with-me/page.tsx
- app/resume/page.tsx
- app/colophon/page.tsx
- app/index-page/page.tsx (note: app/index is reserved for /; use a different slug)
- app/case-studies/page.tsx + [slug]/page.tsx (defer until 3 case studies exist)

PAGES TO RENAME:
- app/projects/ → app/build/
- app/writing/ → app/write/

LIB ADDITIONS:
- lib/builds.ts (typed list with status, tier, problem, stack, learned)
- lib/notes.ts (MDX reader for /notes)
- lib/research.ts (MDX reader for /research)
- lib/stack.ts (MDX reader for /stack/*)

CONTENT TO CREATE:
- content/site/start.json (Start page copy)
- content/site/colophon.json (or .mdx)
- content/builds/141-miles.mdx (first build detail content)
- content/notes/*.mdx (3-5 starter notes)
- content/research/*.mdx (1 starter research file)
- content/stack/music/*.mdx (1-2 starter playlists)

NAV CHANGE:
- components/nav.tsx LINKS array → ['/start', '/write', '/build', '/stack', '/about']

REDIRECTS:
- next.config.ts → add /projects → /build, /writing → /write, /cv → /resume

SCHEMA EXTENSIONS:
- Each /build/[slug] adds SoftwareApplication or CreativeWork JSON-LD
- Each /research/[slug] adds CreativeWork JSON-LD with topic
- /index-page adds CollectionPage with hasPart
- /resume adds Person + WorksFor + EducationalOrganization graph
```

That's the spec.

---

**Decisions you still need to make before I start executing:**

1. **Hero copy:** option A, B, or C from §27 (or another)?
2. **Workshop metaphor:** keep it, drop it, or pick a different one?
3. **Phase order:** Phase 1 first (rename + restructure), or build /stack/music + /resume first since those are the things you specifically named?
4. **Case studies:** defer until you have 3 worth writing, or write the IBM one now while it's fresh?
5. **Notes vs Field Notes naming:** "Notes" feels Kottke-flavored; "Field Notes" is more journalist-y. Either works.
