# TinaCMS Live Editing — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a TinaCMS-backed `/admin` editor on keithrobrien.com so Keith can edit every word of the site (page copy, projects list, articles) from a private dashboard, with each save committing to GitHub and triggering a Vercel rebuild in ~1 minute.

**Architecture:** Tina is layered onto the existing Next.js 16 + React 19 site as a Git-backed CMS — content lives as JSON + MDX files in the repo. Hardcoded page copy (`app/page.tsx`, `app/about/page.tsx`) and the projects array (`lib/projects.ts`) are extracted to `content/site/*.json` and read back at build time. Tina builds a static `/admin` editor into `public/admin/`, authenticated by TinaCloud. Phase 2 (click-on-page visual editing with `useTina`) is explicitly deferred.

**Tech Stack:** Next.js 16.2.6 · React 19.2.4 · TypeScript 5 · Tailwind 4 · gray-matter · next-mdx-remote · TinaCMS 2.7.7 · @tinacms/cli 1.9.7 · TinaCloud (free tier) · Vercel · GitHub.

## Global Constraints

- **No test framework.** Project has no Jest/Vitest/Playwright. Per project CLAUDE.md: "Tests: only when asked." Every task verifies via `npm run build`, `npm run lint`, and manual browser/`curl` checks — not unit tests. Do not introduce a test runner.
- **No visible UI change at the moment of extraction.** Spec success criterion 2: "No visible change to the site at the moment of extraction." Every rewired page must render byte-for-byte the same prose as before. The accent-colored "Total Emphasis" span on the home intro must survive (see Task 5 for the structured-field approach).
- **Tina version pins (verified compatible 2026-05-25):** `tinacms@2.7.7`, `@tinacms/cli@1.9.7`. Do not bump unless the executor independently verifies React 19 + Next 16 App Router support on the newer version.
- **Cost ceiling:** $0 recurring. TinaCloud free tier is 2 users. Do not enable paid TinaCloud features.
- **CMS is layer, not store.** Content stays as files in the repo (JSON + MDX). Do not introduce a database, hosted content store, or external API for content.
- **Helper API preserved.** `lib/projects.ts` must continue to export `projects: Project[]` and `featuredProjects(): Project[]`. The home page (`app/page.tsx:3`) consumes `featuredProjects`; do not break that signature.
- **Spec deferrals are off-limits.** No visual editing (`useTina`, `revalidate` wiring), no Obsidian sync, no FAQ/HowTo schema, no redesign. Phase 2 only.
- **macOS-friendly install.** Repo runs on macOS 25.5.0 with npm. Match the project package manager (`package-lock.json` present); do not switch to pnpm/yarn/bun.
- **Don't commit secrets.** `TINA_TOKEN` goes into Vercel env vars and a gitignored `.env.local` only. Never commit to `.env`. Project CLAUDE.md: "Don't commit secrets, API keys, or .env files."
- **CLAUDE.md "Don't" list still applies.** No database. No API routes (Tina admin is a static SPA built into `public/admin/`, not a Next route handler). No vault sync. No light/dark toggle.

---

## File Structure

**Create:**
- `tina/config.ts` — Tina collections, media config, TinaCloud connection
- `tina/__generated__/` — Tina's generated client + schema (gitignored; produced by `tinacms build`)
- `content/site/projects.json` — extracted projects list
- `content/site/home.json` — extracted home page copy
- `content/site/about.json` — extracted about page copy
- `lib/site-content.ts` — typed loaders for `content/site/*.json` (one place to centralize file reads + types so pages stay clean)
- `.env.local` — local-only Tina env vars (gitignored)

**Modify:**
- `lib/projects.ts` — re-export `projects` and `featuredProjects` reading from `content/site/projects.json` instead of inline literals
- `app/page.tsx` — render from `content/site/home.json`
- `app/about/page.tsx` — render from `content/site/about.json`
- `package.json` — add Tina deps; wrap dev/build with Tina
- `.gitignore` — add `public/admin`, `tina/__generated__`, `.env.local`

**Unchanged:**
- `lib/writing.ts` — articles stay as `content/writing/*.mdx`; Tina edits them in place (Phase 1 does not refactor MDX rendering).
- All SEO / structured-data work (`app/layout.tsx`, per-page `metadata`, `app/icon.tsx`, `public/llms.txt`) — Tina extraction does not touch SEO output.
- `lib/types.ts` — `Project` and `PostMeta` types unchanged.
- Component files (`components/fade-in.tsx`, `components/project-card.tsx`, `components/nav.tsx`, `components/footer.tsx`) — unchanged.

---

## Task 1: Connect GitHub → Vercel auto-deploy

**Why first:** TinaCloud commits to GitHub. If Vercel is not connected to the GitHub repo, those commits never trigger a deploy and editing has no effect. This is the only true prerequisite that survived the 2026-06-24 cutover. It is a manual Vercel UI step — no code — but every task after this assumes a push to `main` triggers a Production deploy.

**Files:** None (Vercel dashboard configuration).

**Interfaces:**
- Consumes: existing Vercel project `keithrobrien` (id `prj_WcHlbC2EVg9JeYA99JQEIYfZquJO`), existing GitHub repo `k-obrien17/keithrobrien` (private).
- Produces: every push to `main` triggers a Production deploy automatically.

- [ ] **Step 1: Open Vercel project Git settings**

In a browser, open `https://vercel.com/keith-obriens-projects/keithrobrien/settings/git`. Sign in as Keith if prompted.

- [ ] **Step 2: Connect the GitHub repository**

Under "Connected Git Repository", click **Connect Git Repository**. Choose **GitHub**, then select `k-obrien17/keithrobrien` (private). Authorize the Vercel GitHub app for that repo if prompted. Confirm the Production Branch is `main`.

- [ ] **Step 3: Verify auto-deploy fires on push**

In the terminal, make a no-op commit on `main` and push:

```bash
cd /Users/keithobrien/Desktop/Claude/Projects/keithrobrien
git commit --allow-empty -m "chore: verify GitHub->Vercel auto-deploy"
git push origin main
```

- [ ] **Step 4: Confirm Vercel picked it up**

Within ~10 seconds, run:

```bash
vercel ls keithrobrien | head -5
```

Expected: the top row shows a new deployment whose **Username** column is **not** `k-obrien17` (a CLI username) — it'll be a GitHub system actor or blank, indicating the GitHub trigger fired. If the top row still shows `k-obrien17` as username after a minute, the integration didn't activate; re-check Step 2.

- [ ] **Step 5: No commit needed**

Nothing changed in the repo beyond the empty commit, which is already pushed. Continue.

---

## Task 2: Install Tina and add a minimal `tina/config.ts`

**Files:**
- Modify: `package.json` (add `tinacms@2.7.7`, `@tinacms/cli@1.9.7` to deps; no script changes yet)
- Create: `tina/config.ts` (collections empty — added per-task below)
- Modify: `.gitignore` (add Tina build artifacts and `.env.local`)

**Interfaces:**
- Consumes: nothing.
- Produces: `tinacms@2.7.7` available as a Node module; `npx tinacms build` produces `tina/__generated__/client.ts` and `public/admin/index.html`.

- [ ] **Step 1: Install Tina deps**

Run:

```bash
npm install --save-exact tinacms@2.7.7 @tinacms/cli@1.9.7
```

Expected: both packages added to `dependencies` in `package.json` with exact version pins. `package-lock.json` updates.

- [ ] **Step 2: Add `.gitignore` entries**

Append to `.gitignore`:

```
# tinacms
/public/admin
/tina/__generated__
.env.local
```

- [ ] **Step 3: Scaffold `tina/config.ts`**

Create `tina/config.ts` with collections empty for now (each later task adds one):

```ts
import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [],
  },
});
```

- [ ] **Step 4: Confirm Tina build runs (it will warn about empty schema)**

Run:

```bash
npx tinacms build
```

Expected: command completes (exit 0 or a non-fatal warning about empty schema). `tina/__generated__/` is created. `public/admin/index.html` is created.

- [ ] **Step 5: Confirm Next still builds**

Run:

```bash
npm run build
```

Expected: build succeeds. No new pages added or removed. Tailwind and TS happy.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tina/config.ts .gitignore
git commit -m "chore(tina): install tinacms 2.7.7 and scaffold tina/config.ts"
```

---

## Task 3: Extract the projects list to `content/site/projects.json` and rewire `lib/projects.ts`

**Files:**
- Create: `content/site/projects.json`
- Modify: `lib/projects.ts` (read from JSON; preserve `projects` array export and `featuredProjects()` helper)

**Interfaces:**
- Consumes: nothing.
- Produces: `import { projects, featuredProjects } from "@/lib/projects"` keeps working with **identical shape and order**.

- [ ] **Step 1: Create `content/site/projects.json`**

This is a faithful 1:1 lift of the 20 entries currently in `lib/projects.ts:3-24`. Use the same field names (`name`, `slug`, `description`, `stack`, `status`, `url`, `featured`, `repo`) and **the same order**. The top-level shape is a singleton object with a `list` field so Tina can render a list editor.

```json
{
  "list": [
    { "name": "141 Miles", "slug": "141-miles", "description": "Jersey Shore events site with an AI-written newsletter.", "stack": ["TS", "Next.js", "Drizzle"], "status": "active", "url": "https://www.141miles.com", "featured": true },
    { "name": "The Diffraction", "slug": "the-diffraction", "description": "A music publication and newsletter.", "stack": ["Newsletter"], "status": "active", "url": "https://www.thediffraction.com" },
    { "name": "Survival Signal", "slug": "survival-signal", "description": "A newsletter about how to be an independent worker. On hiatus.", "stack": ["Newsletter"], "status": "active", "url": "https://survivalsignal.beehiiv.com" },
    { "name": "Total Emphasis Workflow", "slug": "tew", "description": "A Tauri desktop app for managing client projects, stages, and deliverables across the ghostwriting practice.", "stack": ["Tauri", "TypeScript", "Workflow"], "status": "active", "featured": true },
    { "name": "Ironlog", "slug": "ironlog", "description": "Obsidian-native fitness tracker: MCP server plus cron scripts.", "stack": ["TS", "Node", "MCP"], "status": "active", "featured": true },
    { "name": "Vault Chatbot", "slug": "vault-chatbot", "description": "An MCP server that lets Claude query the Obsidian vault used as a CRM. Indexes 15,000 markdown files.", "stack": ["MCP", "Bun", "TypeScript", "CRM"], "status": "active" },
    { "name": "Article Search", "slug": "article-search", "description": "An MCP server for searching across indexed article sources by date, organization, publication, tag, or topic.", "stack": ["MCP", "Bun", "TypeScript"], "status": "active" },
    { "name": "Total Emphasis Portfolio", "slug": "total-emphasis-portfolio", "description": "Next.js 16 portfolio site syncing 575+ pieces from the vault, with an admin CMS, deployed on Vercel.", "stack": ["Next.js", "TypeScript", "Vercel"], "status": "active", "url": "https://www.totalemphasis.com" },
    { "name": "Control Panel", "slug": "control-panel", "description": "A central dashboard for managing tools, cron jobs, and quick actions across the Total Emphasis stack.", "stack": ["Bun", "Dashboard"], "status": "active" },
    { "name": "Ideas", "slug": "ideas", "description": "A capture and synthesis tool for ideas, drafts, and one-line riffs that get processed into vault notes.", "stack": ["Bun", "Claude", "Capture"], "status": "active" },
    { "name": "Personal Claude", "slug": "personal-claude", "description": "A configuration layer that personalizes Claude Code's behavior across all my projects.", "stack": ["Claude Code", "Config"], "status": "active" },
    { "name": "Writing", "slug": "writing-env", "description": "A writing-assist environment for drafting bylines and blog posts with vault and source-material context loaded.", "stack": ["TypeScript", "Writing"], "status": "active" },
    { "name": "Media Library", "slug": "media-library", "description": "Personal media consumption tracker.", "stack": ["TS", "React"], "status": "active" },
    { "name": "Client Pulse", "slug": "client-pulse", "description": "A research feed that aggregates client press, market news, and competitor activity into a daily brief.", "stack": ["Tauri", "Bun", "RSS", "Research"], "status": "active" },
    { "name": "World Cup Price Tracker", "slug": "wc-price-tracker", "description": "Once-a-day SeatPick WC2026 price tracker with an HTML dashboard.", "stack": ["TS", "Bun", "SQLite"], "status": "active" },
    { "name": "Soccer Trivia", "slug": "soccer-trivia", "description": "Kid-facing Chore Quest and Trivia FC, packaged as a macOS app.", "stack": ["Python", "Pygame"], "status": "active" },
    { "name": "Daily 10", "slug": "daily-10", "description": "Daily practice app.", "stack": ["JS", "React", "Tauri"], "status": "active" },
    { "name": "8th Chair", "slug": "8th-chair", "description": "Curated expert Q&A platform.", "stack": ["JS", "React"], "status": "active" },
    { "name": "Backyard Marquee", "slug": "backyard-marquee", "description": "Concert lineup builder.", "stack": ["JS", "React", "Express", "Turso"], "status": "active" },
    { "name": "Obsidian Interface", "slug": "obsidian-interface", "description": "A local-first Bun server that exposes the Obsidian vault to other tools via HTTP. Runs under launchd.", "stack": ["Bun", "Server", "Obsidian"], "status": "active" }
  ]
}
```

- [ ] **Step 2: Rewrite `lib/projects.ts` to read from the JSON**

Replace `lib/projects.ts` entirely with:

```ts
import data from "@/content/site/projects.json";
import { Project } from "./types";

export const projects: Project[] = (data.list as Project[]);

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
```

`tsconfig.json` already enables `resolveJsonModule` via Next's defaults and the `@/*` alias maps to repo root, so the import resolves. If the type-check complains about the JSON's loose typing, narrow with `as Project[]` (already shown).

- [ ] **Step 3: Build and verify identical render**

Run:

```bash
npm run build
```

Expected: build succeeds with the same page output. The projects index (`/projects`) and home `Featured projects` section must render the same 20 / 3 projects in the same order.

- [ ] **Step 4: Spot-check in dev**

Run `npm run dev`. Open `http://localhost:3000/projects` and `http://localhost:3000`. Visually confirm:
- 20 project cards in the same order on `/projects`.
- 3 featured projects on home (141 Miles, Total Emphasis Workflow, Ironlog).
- All descriptions and stack tags identical.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add content/site/projects.json lib/projects.ts
git commit -m "refactor(content): extract projects list to content/site/projects.json"
```

---

## Task 4: Define the `projects` Tina collection

**Files:**
- Modify: `tina/config.ts` (add the `projects` collection to `schema.collections`)

**Interfaces:**
- Consumes: `content/site/projects.json` from Task 3.
- Produces: a `projects` Tina collection that exposes the list editor in `/admin` once Tina is wired.

- [ ] **Step 1: Replace the empty `schema.collections` array**

In `tina/config.ts`, replace `collections: []` with the block below. This singleton collection edits exactly `content/site/projects.json` and exposes per-item fields matching the `Project` interface in `lib/types.ts`.

```ts
schema: {
  collections: [
    {
      name: "projects",
      label: "Projects",
      path: "content/site",
      format: "json",
      match: { include: "projects" },
      ui: {
        allowedActions: { create: false, delete: false },
      },
      fields: [
        {
          type: "object",
          name: "list",
          label: "Projects",
          list: true,
          ui: {
            itemProps: (item: { name?: string }) => ({ label: item?.name || "Untitled" }),
          },
          fields: [
            { type: "string", name: "name", label: "Name", required: true },
            { type: "string", name: "slug", label: "Slug", required: true },
            { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
            { type: "string", name: "stack", label: "Stack", list: true },
            {
              type: "string",
              name: "status",
              label: "Status",
              options: ["active", "maintained", "dormant"],
              required: true,
            },
            { type: "string", name: "url", label: "URL" },
            { type: "string", name: "repo", label: "Repo" },
            { type: "boolean", name: "featured", label: "Featured" },
          ],
        },
      ],
    },
  ],
},
```

- [ ] **Step 2: Rebuild Tina**

Run:

```bash
npx tinacms build
```

Expected: completes without schema errors. `tina/__generated__/` updates.

- [ ] **Step 3: Confirm Next still builds**

```bash
npm run build
```

Expected: succeeds. The Tina admin SPA (`public/admin/index.html`) is included in the build output.

- [ ] **Step 4: Commit**

```bash
git add tina/config.ts
git commit -m "feat(tina): add projects collection"
```

---

## Task 5: Extract the home page copy to `content/site/home.json` and rewire `app/page.tsx`

**Why structured-fields, not rich-text:** The current home intro contains a span with `text-[var(--color-accent)]` wrapping the words "Total Emphasis." Tina's rich-text rendering does not natively reproduce that exact CSS variable styling. The simplest faithful migration is to split the intro into three fields (`introPrefix`, `introHighlight`, `introSuffix`) and render the highlight inside the existing accent span. This is what the spec called out as a TBD detail and resolves it.

**Files:**
- Create: `content/site/home.json`
- Modify: `app/page.tsx` (remove inline literals; read from JSON)
- Create: `lib/site-content.ts` (typed loader)

**Interfaces:**
- Consumes: `content/site/projects.json` (via `featuredProjects()` already wired in Task 3).
- Produces: `getHome(): Home` from `lib/site-content.ts`. Home type:
  ```ts
  export interface Facet { label: string; desc: string; href: string; external?: boolean; }
  export interface Home {
    name: string;
    tagline: string;
    introPrefix: string;
    introHighlight: string;
    introSuffix: string;
    secondary: string;
    facets: Facet[];
  }
  ```
  `app/about/page.tsx` (Task 7) will reuse `lib/site-content.ts` for `getAbout()`.

- [ ] **Step 1: Create `content/site/home.json`**

Lift the literals from `app/page.tsx:21-36` and the FACETS array at `app/page.tsx:6-11` verbatim:

```json
{
  "name": "Keith O'Brien",
  "tagline": "Content strategist, big idea tinkerer, chill dude",
  "introPrefix": "I'm the founder and head consultant at ",
  "introHighlight": "Total Emphasis",
  "introSuffix": ", a content strategy firm. I create and execute large content strategy projects and ghostwrite for executives across industries.",
  "secondary": "Outside of that, I build software, run a few newsletters, and write. This is where all of it lives.",
  "facets": [
    { "label": "Total Emphasis", "desc": "B2B ghostwriting practice", "href": "https://www.totalemphasis.com", "external": true },
    { "label": "Projects", "desc": "What I build and run on the side", "href": "/projects" },
    { "label": "Writing", "desc": "Essays and thinking", "href": "/writing" },
    { "label": "About", "desc": "Who I am, how to reach me", "href": "/about" }
  ]
}
```

Note: the punctuation in `introPrefix` keeps the trailing space before the highlighted span; `introSuffix` starts with `,` to match the current rendering.

- [ ] **Step 2: Create `lib/site-content.ts`**

```ts
import homeJson from "@/content/site/home.json";

export interface Facet {
  label: string;
  desc: string;
  href: string;
  external?: boolean;
}

export interface Home {
  name: string;
  tagline: string;
  introPrefix: string;
  introHighlight: string;
  introSuffix: string;
  secondary: string;
  facets: Facet[];
}

export function getHome(): Home {
  return homeJson as Home;
}
```

- [ ] **Step 3: Rewire `app/page.tsx`**

Replace `app/page.tsx` entirely:

```tsx
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { featuredProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/writing";
import { getHome } from "@/lib/site-content";

export default function Home() {
  const home = getHome();
  const featured = featuredProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-20 sm:py-28">
        <FadeIn>
          <h1 className="font-serif text-5xl sm:text-6xl leading-tight text-[var(--color-fg)]">
            {home.name}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">
            {home.tagline}
          </p>
          <p className="mt-6 text-xl text-[var(--color-body)]">
            {home.introPrefix}
            <span className="text-[var(--color-accent)]">{home.introHighlight}</span>
            {home.introSuffix}
          </p>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl">{home.secondary}</p>
        </FadeIn>
      </section>

      <section className="stagger grid gap-4 sm:grid-cols-2 pb-20">
        {home.facets.map((f) => (
          <FadeIn key={f.href}>
            <Link
              href={f.href}
              {...(f.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 hover:border-[var(--color-accent)] transition-colors"
            >
              <h2 className="font-serif text-2xl text-[var(--color-fg)]">{f.label}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{f.desc}</p>
            </Link>
          </FadeIn>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="pb-20">
          <h2 className="font-serif text-3xl text-[var(--color-fg)] mb-6">Featured projects</h2>
          <ul className="space-y-4">
            {featured.map((p) => (
              <li key={p.slug} className="border-b border-[var(--color-border)] pb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[var(--color-fg)]">{p.name}</span>
                  <span className="font-mono text-xs text-[var(--color-muted)]">{p.stack.join(" · ")}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{p.description}</p>
              </li>
            ))}
          </ul>
          <Link href="/projects" className="mt-6 inline-block text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            All projects →
          </Link>
        </section>
      )}

      {posts.length > 0 && (
        <section className="pb-20">
          <h2 className="font-serif text-3xl text-[var(--color-fg)] mb-6">Latest writing</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}`} className="group block">
                  <span className="text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">{post.title}</span>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Build and verify identical render**

```bash
npm run build
```

Then run `npm run dev` and open `http://localhost:3000`. Compare the rendered HTML against the git-tracked version of `app/page.tsx` (or just visually): name, tagline, intro paragraph (with "Total Emphasis" in amber accent), secondary paragraph, 4 facet cards, featured projects, latest writing. **Nothing visible should change.** Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add content/site/home.json lib/site-content.ts app/page.tsx
git commit -m "refactor(content): extract home page copy to content/site/home.json"
```

---

## Task 6: Define the `pageHome` Tina collection

**Files:**
- Modify: `tina/config.ts` (append a second collection)

**Interfaces:**
- Consumes: `content/site/home.json` from Task 5.
- Produces: a singleton `pageHome` collection in `/admin`.

- [ ] **Step 1: Append the `pageHome` collection**

Add to the `collections` array in `tina/config.ts` (after the `projects` collection):

```ts
{
  name: "pageHome",
  label: "Home page",
  path: "content/site",
  format: "json",
  match: { include: "home" },
  ui: {
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "name", label: "Name (h1)", required: true },
    { type: "string", name: "tagline", label: "Tagline", required: true },
    { type: "string", name: "introPrefix", label: "Intro — before highlight", ui: { component: "textarea" } },
    { type: "string", name: "introHighlight", label: "Intro — highlighted word(s)" },
    { type: "string", name: "introSuffix", label: "Intro — after highlight", ui: { component: "textarea" } },
    { type: "string", name: "secondary", label: "Secondary paragraph", ui: { component: "textarea" } },
    {
      type: "object",
      name: "facets",
      label: "Facets",
      list: true,
      ui: {
        itemProps: (item: { label?: string }) => ({ label: item?.label || "Untitled" }),
      },
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "desc", label: "Description", required: true },
        { type: "string", name: "href", label: "Link" },
        { type: "boolean", name: "external", label: "Opens in new tab" },
      ],
    },
  ],
},
```

- [ ] **Step 2: Rebuild Tina**

```bash
npx tinacms build
```

Expected: completes without schema errors.

- [ ] **Step 3: Confirm Next still builds**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add tina/config.ts
git commit -m "feat(tina): add pageHome collection"
```

---

## Task 7: Extract the about page copy to `content/site/about.json` and rewire `app/about/page.tsx`

**Why markdown strings for prose blocks:** The four prose sections (bio, newsletters, previously, outsideOfWork) all sit inside `<div className="prose">` already. The current "Newsletters" paragraph has inline links — keeping the editing experience first-class means the executor extracts each prose block as a markdown string and renders it through `next-mdx-remote/rsc` (already a project dep). This preserves inline links, italics, and any future Markdown Keith wants without inventing a custom Tina rich-text renderer.

**Files:**
- Create: `content/site/about.json`
- Modify: `app/about/page.tsx`
- Modify: `lib/site-content.ts` (add `getAbout()` and types)

**Interfaces:**
- Consumes: `MDXRemote` from `next-mdx-remote/rsc` (already used by `app/writing/[slug]/page.tsx`).
- Produces: `getAbout(): About` and About type:
  ```ts
  export interface AboutLink { label: string; href: string; }
  export interface About {
    bio: string;
    newsletters: string;
    previously: string;
    outsideOfWork: string;
    links: AboutLink[];
  }
  ```

- [ ] **Step 1: Create `content/site/about.json`**

Faithfully migrate the four prose paragraphs and the LINKS array. The newsletters paragraph keeps its inline links as Markdown link syntax:

```json
{
  "bio": "I'm the founder and head consultant at Total Emphasis, a content strategy firm. I specialize in creating and executing large content strategy projects and ghostwriting for executives in multiple industries.",
  "newsletters": "I run several newsletters: [141 Miles](https://www.141miles.com), a publication about the Jersey Shore, and [The Diffraction](https://www.thediffraction.com), a music publication. On hiatus: [Survival Signal](https://survivalsignal.beehiiv.com), a newsletter about how to be an independent worker.",
  "previously": "I've held roles at tmrw life sciences, Haymarket Media, Horizon Media, and Attention USA.",
  "outsideOfWork": "I'm an avid learner: I read and cook a lot, and I'm trying very hard to remain on the soccer pitch and lower my golf handicap.",
  "links": [
    { "label": "Total Emphasis", "href": "https://www.totalemphasis.com" },
    { "label": "141 Miles", "href": "https://www.141miles.com" },
    { "label": "The Diffraction", "href": "https://www.thediffraction.com" },
    { "label": "Survival Signal", "href": "https://survivalsignal.beehiiv.com" },
    { "label": "GitHub", "href": "https://github.com/k-obrien17" },
    { "label": "LinkedIn", "href": "https://www.linkedin.com/in/keithobrien/" },
    { "label": "keith@totalemphasis.com", "href": "mailto:keith@totalemphasis.com" }
  ]
}
```

- [ ] **Step 2: Extend `lib/site-content.ts`**

Append to the file from Task 5:

```ts
import aboutJson from "@/content/site/about.json";

export interface AboutLink {
  label: string;
  href: string;
}

export interface About {
  bio: string;
  newsletters: string;
  previously: string;
  outsideOfWork: string;
  links: AboutLink[];
}

export function getAbout(): About {
  return aboutJson as About;
}
```

- [ ] **Step 3: Rewire `app/about/page.tsx`**

Replace `app/about/page.tsx` entirely. The MDXRemote calls render each markdown string; default styling comes from the existing `.prose` class.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FadeIn } from "@/components/fade-in";
import { getAbout } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: "About Keith O'Brien",
    description:
      "Keith O'Brien: content strategist and founder of Total Emphasis, big idea tinkerer.",
  },
};

export default function AboutPage() {
  const about = getAbout();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl text-[var(--color-fg)] mb-8">About</h1>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.bio} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Newsletters
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.newsletters} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Previously
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.previously} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Outside of work
        </h2>
        <div className="prose text-[var(--color-body)]">
          <MDXRemote source={about.outsideOfWork} />
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-serif text-2xl text-[var(--color-fg)] mt-12 mb-4">
          Elsewhere
        </h2>
        <ul className="flex flex-wrap gap-5">
          {about.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify identical render**

```bash
npm run build
```

Then `npm run dev` → `http://localhost:3000/about`. Compare side-by-side with the previous render:
- Bio paragraph same.
- "Newsletters" paragraph: same prose, **inline links to 141 Miles, The Diffraction, Survival Signal are accent-colored** (the `.prose` styles wire `a` to the accent var, OR Tailwind 4 prose may render them as default — if links lose color, add an explicit `a` styling override to `.prose` in `app/globals.css`; the spec's "no visible change" criterion is hard).
- "Previously", "Outside of work" same.
- Elsewhere link list: 7 entries in the same order.

If newsletter links lose their accent color, that is a real regression and must be fixed before commit. Check `app/globals.css` for any `.prose a` rule; if missing, add `.prose a { color: var(--color-accent); }` to globals as part of this task.

- [ ] **Step 5: Commit**

```bash
git add content/site/about.json lib/site-content.ts app/about/page.tsx
# include app/globals.css if you added the .prose a override
git commit -m "refactor(content): extract about page copy to content/site/about.json"
```

---

## Task 8: Define the `pageAbout` Tina collection

**Files:**
- Modify: `tina/config.ts`

**Interfaces:**
- Consumes: `content/site/about.json`.
- Produces: singleton `pageAbout` collection in `/admin`.

- [ ] **Step 1: Append `pageAbout` to collections**

Add after `pageHome` in `tina/config.ts`:

```ts
{
  name: "pageAbout",
  label: "About page",
  path: "content/site",
  format: "json",
  match: { include: "about" },
  ui: {
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
    { type: "string", name: "newsletters", label: "Newsletters (Markdown)", ui: { component: "textarea" } },
    { type: "string", name: "previously", label: "Previously", ui: { component: "textarea" } },
    { type: "string", name: "outsideOfWork", label: "Outside of work", ui: { component: "textarea" } },
    {
      type: "object",
      name: "links",
      label: "Elsewhere links",
      list: true,
      ui: {
        itemProps: (item: { label?: string }) => ({ label: item?.label || "Untitled" }),
      },
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "href", label: "URL", required: true },
      ],
    },
  ],
},
```

- [ ] **Step 2: Rebuild Tina and confirm Next still builds**

```bash
npx tinacms build && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat(tina): add pageAbout collection"
```

---

## Task 9: Define the `article` Tina collection over `content/writing/*.mdx`

**Files:**
- Modify: `tina/config.ts`

**Interfaces:**
- Consumes: existing `content/writing/*.mdx` files.
- Produces: an `article` collection in `/admin` for editing articles.

- [ ] **Step 1: Append `article` to collections**

Add after `pageAbout`:

```ts
{
  name: "article",
  label: "Articles",
  path: "content/writing",
  format: "mdx",
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "datetime", name: "date", label: "Date", required: true },
    { type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
    { type: "boolean", name: "draft", label: "Draft" },
    { type: "rich-text", name: "body", label: "Body", isBody: true },
  ],
},
```

- [ ] **Step 2: Rebuild Tina and confirm Next still builds**

```bash
npx tinacms build && npm run build
```

Expected: Tina ingests `content/writing/hello-world.mdx` and `content/writing/template.mdx`. Tina may warn about `template.mdx` if its frontmatter is incomplete — that's OK; it stays in the repo as a stub for Keith.

- [ ] **Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat(tina): add article collection over content/writing"
```

---

## Task 10: Wrap dev and build scripts with Tina

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: `tinacms@2.7.7` from Task 2.
- Produces: `npm run dev` starts Tina then Next; `npm run build` builds Tina then Next.

- [ ] **Step 1: Update scripts**

Replace the `scripts` block in `package.json`:

```json
"scripts": {
  "dev": "tinacms dev -c \"next dev\"",
  "build": "tinacms build && next build",
  "start": "next start",
  "lint": "eslint"
},
```

- [ ] **Step 2: Smoke-test dev**

Run `npm run dev`. Expected output includes a Tina admin URL (e.g. `http://localhost:4001/admin`) and the standard Next dev URL (`http://localhost:3000`). Open both. The Tina admin should load the local schema (collections list visible). The Next site should render unchanged. Stop the dev server.

- [ ] **Step 3: Smoke-test build**

```bash
npm run build
```

Expected: `tinacms build` runs first, then `next build`. Both succeed. `public/admin/index.html` is present in the output.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore(tina): wrap dev and build scripts with tinacms"
```

---

## Task 11: Create the TinaCloud project and wire env vars

**Why this is its own task:** Steps 1–3 happen in the TinaCloud web UI; the executor cannot do them via CLI. The plan documents what to click and where the secret values land.

**Files:**
- Create: `.env.local` (gitignored, holds the public client ID for local dev)
- Modify: nothing in version control

**Interfaces:**
- Consumes: GitHub repo `k-obrien17/keithrobrien` (private); Vercel project `keithrobrien` connected to that repo via Task 1.
- Produces: env vars `NEXT_PUBLIC_TINA_CLIENT_ID` (public, in `.env.local` and Vercel), `TINA_TOKEN` (secret, Vercel only). `TINA_BRANCH` is auto-derived via the `VERCEL_GIT_COMMIT_REF` fallback already in `tina/config.ts`.

- [ ] **Step 1: Create the TinaCloud project**

Open `https://app.tina.io`. Sign in (GitHub OAuth as Keith). Click **Create Project**:
- Project name: `keithrobrien`
- Repository: `k-obrien17/keithrobrien`
- Default branch: `main`
- Authorize TinaCloud's GitHub app for that repo.

After creation, TinaCloud shows the **Client ID** (public) and a **Read-Only Token** + a **Content Token**. Use the **Content Token** as `TINA_TOKEN`.

- [ ] **Step 2: Add env vars in Vercel**

`https://vercel.com/keith-obriens-projects/keithrobrien/settings/environment-variables` → Add:

- `NEXT_PUBLIC_TINA_CLIENT_ID` = (Client ID from Step 1) — Production + Preview + Development
- `TINA_TOKEN` = (Content Token from Step 1) — Production + Preview (mark Sensitive)

- [ ] **Step 3: Create local `.env.local`**

In the repo root, create `.env.local` (this file is gitignored from Task 2). Add:

```
NEXT_PUBLIC_TINA_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

`TINA_TOKEN` is NOT needed locally — Tina dev mode uses an unauthenticated local proxy.

- [ ] **Step 4: Verify `.env.local` is not tracked**

```bash
git status --short
```

Expected: `.env.local` does not appear (because of the `.gitignore` entry from Task 2). If it does, confirm `.gitignore` includes `.env.local`.

- [ ] **Step 5: No commit needed**

`.env.local` is local only; Vercel env vars are admin-side. Continue.

---

## Task 12: Deploy and verify end-to-end editing

**Files:** None (deploy + verify).

**Interfaces:**
- Consumes: all prior tasks landed and pushed to `main`; GitHub→Vercel connected (Task 1); TinaCloud project + env vars set (Task 11).
- Produces: A working `/admin` editor at `https://keithrobrien.com/admin`. Editing any field commits to GitHub, Vercel rebuilds, site is live in ~2 minutes.

- [ ] **Step 1: Push the branch**

```bash
git push origin main
```

Expected: Vercel auto-deploy fires (Task 1's connection). Watch the build:

```bash
vercel ls keithrobrien | head -3
```

Top row should be a fresh deployment, status `● Ready` within ~90s.

- [ ] **Step 2: Verify production site renders unchanged**

```bash
curl -s https://keithrobrien.com | grep -oE "<title>[^<]+</title>"
curl -s https://keithrobrien.com/about | grep -oE "<h1[^>]*>About</h1>"
curl -s https://keithrobrien.com/projects | grep -c "rounded-\[var(--radius-lg)\]"
```

Expected:
- Title is `<title>Keith O'Brien</title>`.
- About h1 present.
- Projects page renders 20 project cards (`grep -c` returns 20).

- [ ] **Step 3: Confirm `/admin` loads**

In a browser, open `https://keithrobrien.com/admin/index.html`. Sign in via TinaCloud (GitHub OAuth). Expected: editor loads. Left sidebar shows four collections — **Projects**, **Home page**, **About page**, **Articles**.

- [ ] **Step 4: Smoke-test an edit on each collection**

Make a tiny, easily-revertable edit in each:
1. **Home page**: change the `tagline` field, save.
2. **About page**: change the trailing sentence of `outsideOfWork`, save.
3. **Projects**: change one project's description, save.
4. **Articles**: change the `excerpt` field on `hello-world`, save.

Each save should produce a commit on `main` (visible at `https://github.com/k-obrien17/keithrobrien/commits/main`). Vercel auto-deploys each commit. Confirm changes are live within ~2 minutes at the corresponding URL.

- [ ] **Step 5: Revert the test edits**

Either revert from Tina (edit the field back) or `git revert` the test commits. Goal: end the verification with the public site looking exactly as it did before Task 12 started.

- [ ] **Step 6: No code commit**

All commits in this task were either Tina-driven (and possibly reverted) or pushes of prior tasks. Verification complete.

---

## Self-Review (run after writing)

**1. Spec coverage**

| Spec requirement | Task |
|---|---|
| TinaCMS chosen, Git-backed, $0 cost | Tasks 2, 11 (TinaCloud free tier) |
| Editing at `/admin` via TinaCloud OAuth | Tasks 11, 12 |
| Save → GitHub commit → Vercel rebuild → ~1 min live | Tasks 1, 11, 12 |
| `article` collection over existing `.mdx` | Task 9 |
| `projects` extracted to JSON, helpers preserved | Tasks 3, 4 |
| `pageHome` extracted, accent-span preserved | Tasks 5, 6 |
| `pageAbout` extracted with rich-text-ish prose | Tasks 7, 8 |
| `tina/config.ts` with collections and TinaCloud env | Tasks 2, 4, 6, 8, 9, 11 |
| `dev`/`build` wrapped by `tinacms` | Task 10 |
| `.gitignore` entries for admin + generated | Task 2 |
| Env vars: NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN, branch fallback | Tasks 2, 11 |
| GitHub→Vercel auto-deploy as Phase 1 prereq | Task 1 |
| No visible change at extraction (success criterion 2) | Verification steps in Tasks 3, 5, 7, 12 |
| SEO/structured-data unchanged | Out of scope of touched files (Task 7 keeps about's metadata block intact; Task 5 keeps home's; layout untouched) |
| Phase 2 deferred (visual editing) | Out of scope by design — note in plan header |

**2. Placeholder scan**

No "TBD", "implement later", "add validation", "similar to Task N", or empty code blocks. Every code block contains the actual file contents to write. The accent-span TBD in the spec is resolved concretely in Task 5 via structured fields.

**3. Type consistency**

- `Home` and `About` interfaces declared in `lib/site-content.ts` (Tasks 5, 7) match the JSON shapes in Tasks 5 and 7 exactly.
- `Project` interface (`lib/types.ts`) is unchanged; `lib/projects.ts` rewrite preserves `projects: Project[]` and `featuredProjects(): Project[]` so home consumes the same API.
- Tina field names in `tina/config.ts` (Tasks 4, 6, 8, 9) match the JSON keys (Tasks 3, 5, 7) one-for-one.
- `tinacms@2.7.7` and `@tinacms/cli@1.9.7` pinned in Task 2 and never bumped.

No gaps found.
