# Handoff

## Current task
Subagent-driven execution of the TinaCMS Phase 1 implementation plan (`docs/superpowers/plans/2026-06-24-keithrobrien-tinacms-live-editing.md`) — adding `/admin` live editing to keithrobrien.com. Then a layered SEO / AEO / GEO audit and a builder/operator positioning rewrite were applied on top of the same branch while waiting for TinaCloud credentials.

## Status
10 of 12 Tina tasks complete and committed. **Paused at Task 11: TinaCloud project creation + Vercel env var setup are manual UI steps Keith has to run.** Until those env vars exist, `npm run build` will fail locally with "missing clientId" (intentional; production Vercel will get the real values).

On top of the Tina stack, four further commits have landed on `design-system-te`:
- `32cce04 chore(seo)` — SEO audit fixes (Section labels promoted to h2, facet labels to h3, meta descriptions lengthened on /about /projects /writing, robots.ts gained an explicit AI-agent allow-list, about bio gained a third-person lede, hello-world placeholder set to draft).
- `7d0d399 feat(llms)` — llms.txt upgrades (last-updated marker, keyword tokens, linkified email) plus a new `/llms-full.txt` static route handler that emits home + about + projects + every published post as one Markdown bundle.
- `145bdc2 feat(positioning)` — repositioned the brand to lead with builder/operator across tagline, hero intro, about bio, llms.txt + llms-full.txt, layout + /about + /projects metadata, and the OG image subtitle.
- `f6b7c45 feat(now)` — new `/now` page (Sivers convention; Building / Running / Elsewhere sections with a visible last-updated marker), new Recently Shipped section on home, both wired to two new Tina collections (`pageNow` + `recentlyShipped`), plus nav and sitemap updates. `lib/site-content.ts` import order cleaned in passing.

Site builds clean locally on the audit + positioning side (typecheck + targeted lint clean on every touched file). The Tina build is still blocked on the missing clientId — same precondition as before.

## Next concrete step
Keith creates the TinaCloud project at `https://app.tina.io`:
1. Sign in with GitHub.
2. Create Project → name `keithrobrien`, repo `k-obrien17/keithrobrien`, branch `main`, authorize the TinaCloud GitHub app.
3. Copy the **Client ID** (public) and **Content Token** (secret) from the dashboard.
4. Paste both into the next session.

The session will then:
- Add `NEXT_PUBLIC_TINA_CLIENT_ID` (Production + Preview + Development) and `TINA_TOKEN` (Production + Preview, marked Sensitive) at `https://vercel.com/keith-obriens-projects/keithrobrien/settings/environment-variables`.
- Create local `.env.local` with `NEXT_PUBLIC_TINA_CLIENT_ID=<value>` (gitignored).
- Run Task 12 (push, watch Vercel auto-deploy, verify `/admin` loads + smoke-test an edit in each collection). **Smoke test now needs to exercise 6 collections, not 4: projects, pageHome, pageAbout, pageNow, recentlyShipped, article.**

Task briefs for resuming live at `.superpowers/sdd/task-11-brief.md` and `.superpowers/sdd/task-12-brief.md`. The SDD ledger is at `.superpowers/sdd/progress.md`.

## Open questions
- TinaCMS vs self-hosted Decap-style auth — decided TinaCMS (free tier, $0).
- Vercel Analytics: on or off? (Unanswered from earlier today.)
- Twitter / X handle for `twitter:creator` attribution — Keith to provide if he wants it wired into `app/layout.tsx`.
- `www.keithrobrien.com` redirect — surfaced in the SEO audit; needs Keith to set the Vercel dashboard rule (Domains → www → redirect to apex).
- `/now` content review: I seeded `content/site/now.json` from session context (the "Reading on operator-builders and AI agent design" line is a contextual guess, not Keith's actual reading). He should adjust via `/admin` after Task 12 or by editing the JSON directly.
- Recently Shipped seeds: the three items I added (`Personal hub rebuild`, `Live editing`, `AI-readable surface`) describe the work that goes live with the Task 12 push, so they'll be true on the day they ship. Keith can re-curate as new ships land.
- Per-project `url`/`repo` links in `content/site/projects.json`: only 4 of 20 have URLs today. (Unanswered.)

## Don't forget
- **`npx tinacms build` invocation:** `tinacms@2.7.7` exits 1 when `clientId` is empty. Locally use `npx tinacms build --local --skip-cloud-checks && npx next build` until Task 11 sets the env vars. After Task 11, plain `npm run build` works.
- **None of the local commits are pushed.** As of this update there are 18 commits ahead of origin (the original 14 from the Tina arc plus the 4 added in this session). Task 12's push triggers the production deploy that lights up `/admin`, the new positioning, the audit fixes, and the new surfaces all in one go.
- **eslint OOMs** scanning the whole tree (walks into `.next/`, `tina/__generated__/`, etc). Use targeted lint on changed files until that's diagnosed: `npx eslint <file...>`.
- **Task 7 import-order Minor was fixed in passing** as part of `f6b7c45` (`lib/site-content.ts` now imports all JSON at the top). No longer carry-forward; can drop from the final whole-branch review checklist.
- **Survival Signal still says "On hiatus"** in `content/site/about.json` newsletters paragraph — intentionally preserved; revisit only if framing changes.
- **OG image subtitle changed** in `145bdc2` to "Builder · Operator · Big idea tinkerer". If the Vercel cached deploy still serves the old PNG after push, the cache key is in `app/opengraph-image.tsx` itself; a content change forces regeneration on next build.

## Files touched since the prior handoff (4 new commits)
Committed:
- SEO audit: `app/about/page.tsx`, `app/page.tsx`, `app/projects/page.tsx`, `app/robots.ts`, `app/writing/page.tsx`, `components/section.tsx`, `content/site/about.json`, `content/writing/hello-world.mdx`
- llms.txt upgrades: `public/llms.txt`, `app/llms-full.txt/route.ts` (new)
- Positioning: `content/site/home.json`, `content/site/about.json` (bio rewrite), `public/llms.txt`, `app/llms-full.txt/route.ts`, `app/layout.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `app/opengraph-image.tsx`
- Now / Recently Shipped: `app/now/page.tsx` (new), `content/site/now.json` (new), `content/site/recently-shipped.json` (new), `app/page.tsx`, `app/sitemap.ts`, `components/nav.tsx`, `lib/site-content.ts`, `tina/config.ts`

Uncommitted at handoff time:
- `HANDOFF.md` (this update)

## Git state
- Branch: `design-system-te`
- Last commit: `f6b7c45 feat(now): add /now page and Recently Shipped section on home`
- Local commits ahead of origin: 18 (the 14 from the original Tina arc + 4 from this session)
- Uncommitted changes: HANDOFF.md (this commit)
- Stashed: no

## Reason for handoff
Mid-session checkpoint. SEO audit applied, llms upgrades shipped, builder/operator positioning rewritten across every surface, new `/now` page and Recently Shipped surface added. Still paused at Task 11 awaiting TinaCloud Client ID + Content Token.

## Updated
2026-06-26T13:30:00Z
