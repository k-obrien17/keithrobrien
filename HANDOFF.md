# Handoff

## Current task
Live. The personal hub is shipping the rebuild, the SEO/AEO/GEO audit fixes, the builder/operator positioning, the `/now` page, the Recently Shipped surface, the llms.txt + llms-full.txt content, and Vercel Analytics wiring. The only piece deferred is `/admin` (TinaCMS live editing), which is blocked at TinaCloud's schema-sync layer, not at the credential or branch-auth layer.

## Status
Production deploy `keithrobrien-mo05gl0r8` (commit `fceaaa5`) is the live one. Curl-confirmed all routes return 200: `/`, `/about`, `/projects`, `/writing`, `/now`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`. `/admin` returns 404 (expected — see Tina note below).

`main` is now at `fceaaa5`. The 24 commits from this push include:
- Original Tina arc 1-10 (`8916314..ed90a34`)
- Design system rebuild (`a1d6947`, `b2c1900`, `60abe40`)
- SEO audit fixes (`32cce04`)
- llms.txt upgrades + new `/llms-full.txt` route (`7d0d399`)
- Builder/operator positioning across home, about, llms, layout, OG image (`145bdc2`)
- `/now` page + Recently Shipped section + 2 new Tina collections (`f6b7c45`)
- HANDOFF refresh (`23ea9cb`)
- Vercel Analytics (`4ac18b8`)
- Keith's content edits during the failed-deploy loop: master bio + dense keyword set (`4d6f6ba`), accurate "tools" language (`5a4813e`), Muck Rack in sameAs (`88bad96`)
- Empty Tina schema-resync trigger (`cfc9026`) — see Tina note
- Build-script bypass to ship without Tina (`fceaaa5`)

## Still on Keith's dashboard
1. **Vercel Analytics enable.** Code is wired (`4ac18b8` imported `@vercel/analytics/next`), but the runtime script doesn't inject until Web Analytics is toggled on at Vercel → Project → Analytics. Right now no data is being collected.
2. **www → apex redirect.** Vercel → Project → Domains → set `www.keithrobrien.com` to redirect to `keithrobrien.com` (308). One click; SEO audit flagged the duplicate-content surface.
3. **Search Console sitemap submission.** Search Console → Sitemaps → paste `sitemap.xml` (Domain property already verified via DNS TXT during this session, so no further verification needed).
4. **Token rotation.** TinaCloud content token has been pasted in chat and visible in a screenshot. Rotate when convenient: TinaCloud → Tokens → delete the current Content (Readonly) token → generate fresh → Vercel → swap `TINA_TOKEN` env var → redeploy.

## Tina — deferred, not abandoned
TinaCloud project is created, GitHub app installed on `keithrobrien` only, `main` is registered as a branch, credentials are correct in Vercel. The remaining blocker: TinaCloud's cached GraphQL schema doesn't match what `tina/config.ts` defines, and the auto-resync via webhook isn't catching. Symptom: `tinacms build` fails with "The local GraphQL schema doesn't match the remote GraphQL schema."

Diagnostic trail this session:
- First failures: "not authorized to access branch" — this was a misleading error masking a missing TINA_TOKEN value mismatch. Fixed by re-pasting the token cleanly into Vercel.
- Next failure: "Branch 'main' is not on TinaCloud." Fixed by adding `main` via TinaCloud Configuration → Refresh Branches.
- Current failure: schema mismatch. An empty commit (`cfc9026`) was pushed to fire Tina's webhook — didn't resync the schema cache. Bypassed the Tina build entirely in `fceaaa5` so the rest of the work could ship.

To restore `/admin` later:
1. TinaCloud → Configuration → look for a "Resync schema" / "Reindex" button (UI not yet inspected from my side; may need a screenshot or doc check at https://tina.io/docs/errors/faq/).
2. Once schema is in sync, edit `package.json`: change `"build": "next build"` back to `"build": "tinacms build && next build"` (or use the existing `build:tina` script, which is already wired).
3. Push, deploy, smoke-test `/admin` and each of the 6 collections: `projects`, `pageHome`, `pageAbout`, `pageNow`, `recentlyShipped`, `article`.

## Open questions
- Twitter / X handle for `twitter:creator` attribution — Keith to provide if he wants it wired into `app/layout.tsx`.
- Per-project `url`/`repo` links in `content/site/projects.json`: only 4 of 20 have URLs today.
- Recently Shipped seeds in `content/site/recently-shipped.json`: the "Live editing" entry is now inaccurate (Tina /admin didn't ship — was bypassed). Replace when convenient with something true, like "Builder/operator positioning" or "Personal hub now-page surface."

## Don't forget
- **eslint OOMs** scanning the whole tree (walks into `.next/`, `tina/__generated__/`). Use targeted lint on changed files: `npx eslint <file...>`.
- **Survival Signal still says "On hiatus"** in `content/site/about.json` newsletters paragraph — intentionally preserved; revisit only if framing changes.
- **`.env.local` exists locally** with `NEXT_PUBLIC_TINA_CLIENT_ID=563908f9-74b9-455f-bc14-efbf56d26ea3`. Gitignored. Safe to leave; needed when Tina is restored for local `npm run dev:tina`.

## Git state
- Branch: `main`
- Last commit: `fceaaa5 chore(build): bypass tinacms build pending schema resync`
- Local commits ahead of origin: 0 (everything pushed; live)
- Uncommitted changes: HANDOFF.md (this commit)
- Stashed: no

## Reason for handoff
Site is live and complete on every workstream except `/admin`. Session end checkpoint.

## Updated
2026-06-27T18:40:00Z
