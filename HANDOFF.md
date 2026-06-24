# Handoff

## Current task
Subagent-driven execution of the TinaCMS Phase 1 implementation plan (`docs/superpowers/plans/2026-06-24-keithrobrien-tinacms-live-editing.md`) — adding `/admin` live editing to keithrobrien.com.

## Status
10 of 12 tasks complete and committed; site builds clean and renders identically to pre-extraction state. Tasks 2-10 implemented Tina install, content extraction (projects, home, about) to `content/site/*.json`, three Tina singleton collections + an article collection over `content/writing/*.mdx`, and the `tinacms`-wrapped dev/build scripts. Each task passed a per-task spec + quality review. **Paused at Task 11: TinaCloud project creation + Vercel env var setup are manual UI steps Keith has to run.** Until those env vars exist, `npm run build` will fail locally with "missing clientId" (intentional; production Vercel will get the real values).

## Next concrete step
Keith creates the TinaCloud project at `https://app.tina.io`:
1. Sign in with GitHub.
2. Create Project → name `keithrobrien`, repo `k-obrien17/keithrobrien`, branch `main`, authorize the TinaCloud GitHub app.
3. Copy the **Client ID** (public) and **Content Token** (secret) from the dashboard.
4. Paste both into the next session.

The session will then:
- Add `NEXT_PUBLIC_TINA_CLIENT_ID` (Production + Preview + Development) and `TINA_TOKEN` (Production + Preview, marked Sensitive) at `https://vercel.com/keith-obriens-projects/keithrobrien/settings/environment-variables`.
- Create local `.env.local` with `NEXT_PUBLIC_TINA_CLIENT_ID=<value>` (gitignored).
- Run Task 12 (push, watch Vercel auto-deploy, verify `/admin` loads + smoke-test an edit in each collection).

Task briefs for resuming live at `.superpowers/sdd/task-11-brief.md` and `.superpowers/sdd/task-12-brief.md`. The SDD ledger is at `.superpowers/sdd/progress.md`.

## Open questions
- TinaCMS vs self-hosted Decap-style auth — decided TinaCMS (free tier, $0).
- Vercel Analytics: on or off? (Unanswered from earlier today.)
- "Hello, world" placeholder article in `content/writing/hello-world.mdx`: replace, hide writing section, or leave? (Unanswered.)
- Per-project `url`/`repo` links in `content/site/projects.json`: only 4 of 20 have URLs today. (Unanswered.)

## Don't forget
- **Minor carry-forward from Task 7 review:** `lib/site-content.ts` has `import aboutJson from "@/content/site/about.json"` placed mid-file (after `getHome()`) rather than at the top with other imports. Non-blocking style smell. Catch in the final whole-branch review after Task 12, or in any task that touches `lib/site-content.ts` next.
- **`npx tinacms build` invocation:** `tinacms@2.7.7` exits 1 when `clientId` is empty. Locally use `npx tinacms build --local --skip-cloud-checks && npx next build` until Task 11 sets the env vars. After Task 11, plain `npm run build` works.
- The 14 commits today are not yet pushed to origin (last push at task 1 verification was `84a03ed`). Tasks 2-10 commits (`8916314..ed90a34`) are local. Task 12's push triggers the production deploy that lights up `/admin`.
- Survival Signal still says "On hiatus" in `content/site/about.json` newsletters paragraph — intentionally preserved from the original copy; revisit only if Keith wants different framing.

## Files touched this session
Already committed (10 tasks worth of work):
- `lib/projects.ts`, `lib/site-content.ts`, `lib/projects.ts` again — content readers
- `app/page.tsx`, `app/about/page.tsx`, `app/projects/page.tsx` — rewired to read from JSON
- `content/site/projects.json`, `content/site/home.json`, `content/site/about.json` — extracted content
- `tina/config.ts` — 4 collections (projects, pageHome, pageAbout, article)
- `package.json`, `package-lock.json` — Tina deps + wrapped scripts
- `.gitignore` — Tina build artifacts + `.env.local`
- `docs/superpowers/specs/2026-05-25-keithrobrien-live-editing-tinacms-design.md` — patched to reflect deploy + DNS done
- `docs/superpowers/plans/2026-06-24-keithrobrien-tinacms-live-editing.md` — new implementation plan

Uncommitted at handoff time:
- `HANDOFF.md` — this file
- `tina/tina-lock.json` — Tina-generated schema lock; per Tina docs it should be committed

## Git state
- Branch: main
- Last commit: `ed90a34 chore(tina): wrap dev and build scripts with tinacms`
- Local commits ahead of origin: 14 (all from today's work)
- Uncommitted changes: HANDOFF.md and `tina/tina-lock.json` (this commit is staging both)
- Stashed: no

## Reason for handoff
closing computer; mid-SDD execution of TinaCMS plan, paused at Task 11 awaiting TinaCloud Client ID + Content Token

## Updated
2026-06-24T21:33:16Z
