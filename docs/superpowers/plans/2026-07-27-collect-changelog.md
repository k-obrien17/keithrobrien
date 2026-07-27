# Collect Changelog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified, mostly-automated changelog spanning Theseus' Playlist, the Best-of-YYYY playlists, and the movies/TV top-10 lists, per `docs/superpowers/specs/2026-07-27-collect-changelog-design.md`.

**Architecture:** Two independent producers (a Spotify-polling GitHub Action for the playlists, a git-diff GitHub Action for `watching.json`) write append-only static JSON logs. A shared `getMusicChangelog()` merges them at render time. A new `/collect/changelog` page renders the merged feed; the homepage's existing mini-log gets renamed and links to it.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, plain Node `.mjs` scripts (no bundler) for CI tooling, GitHub Actions.

## Global Constraints

- No new npm dependencies, state managers, or build tools. Static content only, no database (project CLAUDE.md).
- No automated test framework exists in this repo, and the standing preference is "tests: only when asked." Every task below verifies with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and concrete manual `node`/`grep` checks instead of a unit-test suite.
- Public repo: never commit secrets. `SPOTIFY_REFRESH_TOKEN` lives only in GitHub Actions secrets, added by Keith by hand. Nothing in this plan writes it to a file.
- File size cap is 300 lines per project convention; every file below stays well under that.
- House style floor applies to user-facing copy written in this plan (page copy, note copy): no em-dashes, no LLM-speak openers/closers.
- Reuse existing `var(--color-*)` tokens and the `Section` / `Container` / `CollectHeader` components. No new design tokens.
- Changelog `date` fields are ISO date strings (`YYYY-MM-DD`), matching the existing `listening-log.json` / `ListeningChange` convention. Not ms epoch; this is static content, not a database row.

---

### Task 1: Changelog data layer

**Files:**
- Create: `content/collect/best-of-changelog.json`
- Create: `content/collect/watching-changelog.json`
- Modify: `lib/site-content.ts`

**Interfaces:**
- Produces: `ChangelogEntry` type and `getMusicChangelog(): ChangelogEntry[]`, exported from `lib/site-content.ts`. Shape:
  ```ts
  interface ChangelogEntry {
    date: string;
    domain: "playlist" | "best-of" | "movies" | "tv";
    type: "added" | "removed" | "entered" | "exited" | "rank-change" | "watched";
    title: string;
    artists?: string;
    year?: number;
    rank?: number;
    previousRank?: number;
  }
  ```
- Consumes: `content/collect/best-of-changelog.json` (shape `{ snapshot: {id,title,artists}[], changes: {date,type:"added"|"removed",title,artists,year?}[] }`, same as existing `listening-log.json` plus an optional `year`), `content/collect/watching-changelog.json` (shape `{ changes: ChangelogEntry[] }`, written directly by Task 2/3).

- [ ] **Step 1: Create the two empty log files**

`content/collect/best-of-changelog.json`:
```json
{
  "snapshot": [],
  "changes": []
}
```

`content/collect/watching-changelog.json`:
```json
{
  "changes": []
}
```

- [ ] **Step 2: Add `ChangelogEntry` and `getMusicChangelog()` to `lib/site-content.ts`**

Add two imports near the top, after the existing `listeningLogJson` import:

```ts
import bestOfLogJson from "@/content/collect/best-of-changelog.json";
import watchingLogJson from "@/content/collect/watching-changelog.json";
```

Add this after `getListeningChanges()`:

```ts
export interface ChangelogEntry {
  date: string;
  domain: "playlist" | "best-of" | "movies" | "tv";
  type: "added" | "removed" | "entered" | "exited" | "rank-change" | "watched";
  title: string;
  artists?: string;
  year?: number;
  rank?: number;
  previousRank?: number;
}

export function getMusicChangelog(): ChangelogEntry[] {
  const playlist: ChangelogEntry[] = getListeningChanges().map((c) => ({
    date: c.date,
    domain: "playlist",
    type: c.type,
    title: c.title,
    artists: c.artists,
  }));

  const bestOf: ChangelogEntry[] = (
    bestOfLogJson as {
      changes: { date: string; type: "added" | "removed"; title: string; artists: string; year?: number }[];
    }
  ).changes.map((c) => ({
    date: c.date,
    domain: "best-of",
    type: c.type,
    title: c.title,
    artists: c.artists,
    year: c.year,
  }));

  const watching = (watchingLogJson as { changes: ChangelogEntry[] }).changes;

  return [...playlist, ...bestOf, ...watching].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add content/collect/best-of-changelog.json content/collect/watching-changelog.json lib/site-content.ts
git commit -m "feat(collect): add unified changelog data layer"
```

---

### Task 2: Movies/TV ranked-list diff script

**Files:**
- Create: `scripts/diff-ranked-list.mjs`

**Interfaces:**
- Consumes: `content/collect/watching.json` (`top_movies`, `top_tv`, `recently_watched`, `recent_tv`, each item `{title, year, score, type, tmdb_url, logged?}`), `content/collect/watching-changelog.json` (`{ changes: ChangelogEntry[] }` from Task 1).
- Produces: exported pure functions `diffRankedLists(oldData, newData)` and `diffWatchedFeeds(newData, existingChanges)`, both returning arrays shaped like Task 1's `ChangelogEntry` with `domain: "movies" | "tv"`. Also a `main()` entry point (called only when run directly) that updates `content/collect/watching-changelog.json`. Task 3 invokes this script as `node scripts/diff-ranked-list.mjs`.

- [ ] **Step 1: Write the script**

Create `scripts/diff-ranked-list.mjs`:

```js
// Runs in CI (.github/workflows/watching-changelog.yml) on push to
// content/collect/watching.json. Diffs the previous committed version
// against the new one to derive changelog entries: rank movement for the
// ranked top-10 lists, and new "watched" entries for the recency feeds.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const WATCHING_PATH = new URL("../content/collect/watching.json", import.meta.url);
const CHANGELOG_PATH = new URL("../content/collect/watching-changelog.json", import.meta.url);

function key(entry) {
  return `${entry.title}::${entry.year}`;
}

export function diffRankedLists(oldData, newData) {
  const entries = [];
  const date = newData.generated_at;

  for (const [field, domain] of [
    ["top_movies", "movies"],
    ["top_tv", "tv"],
  ]) {
    const oldList = oldData[field] ?? [];
    const newList = newData[field] ?? [];
    const oldIndex = new Map(oldList.map((e, i) => [key(e), i]));
    const newIndex = new Map(newList.map((e, i) => [key(e), i]));

    for (const [k, newI] of newIndex) {
      const entry = newList[newI];
      if (!oldIndex.has(k)) {
        entries.push({ date, domain, type: "entered", title: entry.title, year: entry.year, rank: newI + 1 });
      } else {
        const oldI = oldIndex.get(k);
        if (oldI !== newI) {
          entries.push({
            date,
            domain,
            type: "rank-change",
            title: entry.title,
            year: entry.year,
            rank: newI + 1,
            previousRank: oldI + 1,
          });
        }
      }
    }

    for (const [k, oldI] of oldIndex) {
      if (!newIndex.has(k)) {
        const entry = oldList[oldI];
        entries.push({ date, domain, type: "exited", title: entry.title, year: entry.year, previousRank: oldI + 1 });
      }
    }
  }

  return entries;
}

export function diffWatchedFeeds(newData, existingChanges) {
  const entries = [];
  const seen = new Set(
    existingChanges
      .filter((c) => c.type === "watched")
      .map((c) => `${c.domain}::${c.title}::${c.year}::${c.date}`),
  );

  for (const [field, domain] of [
    ["recently_watched", "movies"],
    ["recent_tv", "tv"],
  ]) {
    for (const entry of newData[field] ?? []) {
      const k = `${domain}::${entry.title}::${entry.year}::${entry.logged}`;
      if (!seen.has(k)) {
        entries.push({ date: entry.logged, domain, type: "watched", title: entry.title, year: entry.year });
      }
    }
  }

  return entries;
}

function getPreviousWatching() {
  try {
    const raw = execSync("git show HEAD^:content/collect/watching.json", { encoding: "utf-8" });
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function main() {
  const newData = JSON.parse(readFileSync(WATCHING_PATH, "utf-8"));
  const oldData = getPreviousWatching();
  const changelog = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));

  const rankChanges = oldData ? diffRankedLists(oldData, newData) : [];
  const watched = diffWatchedFeeds(newData, changelog.changes ?? []);
  const newEntries = [...rankChanges, ...watched];

  if (newEntries.length === 0) {
    console.log("No changes.");
    return;
  }

  changelog.changes = [...newEntries, ...(changelog.changes ?? [])];
  writeFileSync(CHANGELOG_PATH, `${JSON.stringify(changelog, null, 2)}\n`);
  console.log(`${newEntries.length} new changelog entries.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 2: Verify the pure functions with sample data**

Run:
```bash
node --input-type=module -e "
import { diffRankedLists, diffWatchedFeeds } from './scripts/diff-ranked-list.mjs';

const old = {
  top_movies: [{ title: 'A', year: 2000 }, { title: 'B', year: 2001 }],
  top_tv: [],
};
const now = {
  generated_at: '2026-07-27',
  top_movies: [{ title: 'B', year: 2001 }, { title: 'C', year: 2010 }],
  top_tv: [],
  recently_watched: [{ title: 'D', year: 2020, logged: '2026-07-27' }],
  recent_tv: [],
};

console.log(JSON.stringify(diffRankedLists(old, now), null, 2));
console.log(JSON.stringify(diffWatchedFeeds(now, []), null, 2));
"
```

Expected: first array has three entries: `B` as `rank-change` (`rank: 1, previousRank: 2`), `C` as `entered` (`rank: 2`), `A` as `exited` (`previousRank: 1`). Second array has one `watched` entry for `D`.

- [ ] **Step 3: Commit**

```bash
git add scripts/diff-ranked-list.mjs
git commit -m "feat(collect): add ranked-list diff script for watching changelog"
```

---

### Task 3: Watching changelog GitHub Action

**Files:**
- Create: `.github/workflows/watching-changelog.yml`

**Interfaces:**
- Consumes: `scripts/diff-ranked-list.mjs`'s `main()` (Task 2), triggered on push to `content/collect/watching.json`.
- Produces: commits to `content/collect/watching-changelog.json` when the diff finds changes.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/watching-changelog.yml`:

```yaml
name: Watching changelog

on:
  push:
    branches: [main]
    paths:
      - "content/collect/watching.json"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  diff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Diff ranked lists
        run: node scripts/diff-ranked-list.mjs

      - name: Commit if changed
        run: |
          if git diff --quiet -- content/collect/watching-changelog.json; then
            echo "No changes to commit."
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/collect/watching-changelog.json
          git commit -m "chore(collect): update watching changelog"
          git push
```

`fetch-depth: 2` is required so `git show HEAD^:...` in the script can resolve the previous commit; the default checkout is shallow at depth 1.

- [ ] **Step 2: Sanity-check the workflow file**

Run:
```bash
grep -q 'paths:' .github/workflows/watching-changelog.yml && \
grep -q 'contents: write' .github/workflows/watching-changelog.yml && \
grep -q 'fetch-depth: 2' .github/workflows/watching-changelog.yml && \
echo OK
```
Expected: `OK`.

- [ ] **Step 3: Run the script locally against real repo data**

Run: `node scripts/diff-ranked-list.mjs`
Expected: since `content/collect/watching.json` hasn't changed since the last commit, `diffRankedLists` contributes nothing; `diffWatchedFeeds` seeds `watched` entries for the current `recently_watched`/`recent_tv` titles (the changelog started empty in Task 1). Confirm with:
```bash
git diff --stat content/collect/watching-changelog.json
```
Expected: the file now has entries. This is expected one-time seeding of the recency feed from current state, not a backfill of historical rank changes (per the spec, the `e23d93f` swap itself is not reconstructed).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/watching-changelog.yml content/collect/watching-changelog.json
git commit -m "feat(collect): add watching changelog GitHub Action"
```

---

### Task 4: Spotify refresh-token minting helper

**Files:**
- Create: `scripts/mint-spotify-refresh-token.mjs`

**Interfaces:**
- Produces: a one-time local CLI tool. Output is a refresh token string Keith pastes into GitHub Actions secrets as `SPOTIFY_REFRESH_TOKEN`, consumed by Task 5.

> This task's code is verifiable without live Spotify credentials (see Step 2). Actually minting a real token is a manual step for Keith, called out after Step 3, since it requires his Spotify account and Developer Dashboard access.

- [ ] **Step 1: Write the script**

Create `scripts/mint-spotify-refresh-token.mjs`:

```js
// One-time helper: run locally to mint a Spotify OAuth refresh token.
// Requires SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in the environment,
// and http://127.0.0.1:8888/callback registered as a Redirect URI on the
// app at https://developer.spotify.com/dashboard.
import { createServer } from "node:http";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "playlist-read-private";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", CLIENT_ID);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPE);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing ?code");
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await tokenRes.json();

  if (!tokenRes.ok || !data.refresh_token) {
    res.writeHead(500).end("Token exchange failed, see terminal.");
    console.error("Token exchange failed:", data);
    server.close();
    process.exitCode = 1;
    return;
  }

  res.writeHead(200).end("Done. Refresh token printed in your terminal, you can close this tab.");
  console.log("\nSPOTIFY_REFRESH_TOKEN:");
  console.log(data.refresh_token);
  console.log("\nAdd this as a GitHub Actions secret (SPOTIFY_REFRESH_TOKEN), then clear it from your shell history.");
  server.close();
});

server.listen(8888, () => {
  console.log("Open this URL, log in, and approve access:\n");
  console.log(authorizeUrl.toString());
});
```

- [ ] **Step 2: Smoke-test without live credentials**

Run:
```bash
SPOTIFY_CLIENT_ID=dummy SPOTIFY_CLIENT_SECRET=dummy node scripts/mint-spotify-refresh-token.mjs &
PID=$!
sleep 1
kill $PID
```
Expected: prints "Open this URL, log in, and approve access:" followed by a URL starting with `https://accounts.spotify.com/authorize?client_id=dummy...`, then the process is killed cleanly (no crash before that).

- [ ] **Step 3: Commit**

```bash
git add scripts/mint-spotify-refresh-token.mjs
git commit -m "feat(scripts): add Spotify refresh-token minting helper"
```

- [ ] **Step 4 (manual, Keith only, not agent-executable): mint the real token**

1. In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), open the app tied to `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` and add `http://127.0.0.1:8888/callback` as a Redirect URI.
2. Locally: `SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/mint-spotify-refresh-token.mjs`, open the printed URL, approve access.
3. Copy the printed refresh token, add it as a GitHub Actions secret: `gh secret set SPOTIFY_REFRESH_TOKEN` (or the repo's Settings → Secrets UI).
4. Clear the token from shell history (`history -d <line>` or equivalent).

---

### Task 5: Switch playlist snapshot to refresh-token auth, add Best-of snapshot

**Files:**
- Modify: `scripts/snapshot-playlist.mjs`

**Interfaces:**
- Consumes: `SPOTIFY_REFRESH_TOKEN` env var (Task 4's output, once Keith adds it as a secret), `content/collect/year/<year>.json` (`music.spotify_url`, existing shape from `lib/collect.ts`'s `YearMusic`).
- Produces: writes to both `content/site/listening-log.json` (Theseus' Playlist, unchanged path) and `content/collect/best-of-changelog.json` (Task 1, new).

- [ ] **Step 1: Rewrite the script**

Replace the full contents of `scripts/snapshot-playlist.mjs`:

```js
// Runs in CI (.github/workflows/playlist-snapshot.yml) on a cron. Spotify
// has no playlist-history endpoint, so this snapshots current tracks and
// diffs against the last snapshot to derive added/removed changelog
// entries. Snapshots both Theseus' Playlist and the active year's
// Best-of-YYYY playlist.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const THESEUS_PLAYLIST_ID = "7BKBw7iShlGZmp5KZl2FFF";
const LISTENING_LOG_PATH = new URL("../content/site/listening-log.json", import.meta.url);
const BEST_OF_LOG_PATH = new URL("../content/collect/best-of-changelog.json", import.meta.url);

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.log("Spotify credentials not set, skipping snapshot.");
    return null;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!res.ok) {
    console.error(`Token refresh failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data.access_token ?? null;
}

async function getCurrentTracks(token, playlistId) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`Playlist ${playlistId} request failed: ${res.status}`);
    return null;
  }
  const data = await res.json();
  const rawItems = data.tracks?.items ?? [];
  return rawItems
    .filter((item) => item.track)
    .map((item) => ({
      id: item.track.id,
      title: item.track.name,
      artists: item.track.artists.map((a) => a.name).join(", "),
    }));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function currentYear() {
  return new Date().getUTCFullYear();
}

export function getActiveYearPlaylistId() {
  const year = currentYear();
  const p = new URL(`../content/collect/year/${year}.json`, import.meta.url);
  if (!existsSync(p)) {
    console.log(`No content/collect/year/${year}.json yet, skipping Best-of snapshot.`);
    return null;
  }
  const data = JSON.parse(readFileSync(p, "utf-8"));
  const url = data.music?.spotify_url;
  if (!url) {
    console.log(`content/collect/year/${year}.json has no music.spotify_url, skipping.`);
    return null;
  }
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

async function snapshotPlaylist(token, playlistId, logPath, year) {
  const current = await getCurrentTracks(token, playlistId);
  if (!current) return;

  const log = JSON.parse(readFileSync(logPath, "utf-8"));
  const previous = log.snapshot ?? [];
  const isFirstRun = previous.length === 0;

  const previousIds = new Set(previous.map((t) => t.id));
  const currentIds = new Set(current.map((t) => t.id));

  const added = current.filter((t) => !previousIds.has(t.id));
  const removed = previous.filter((t) => !currentIds.has(t.id));

  if (!isFirstRun && (added.length > 0 || removed.length > 0)) {
    const date = todayISO();
    const yearField = year ? { year } : {};
    const newEntries = [
      ...added.map((t) => ({ date, type: "added", title: t.title, artists: t.artists, ...yearField })),
      ...removed.map((t) => ({ date, type: "removed", title: t.title, artists: t.artists, ...yearField })),
    ];
    log.changes = [...newEntries, ...(log.changes ?? [])];
    console.log(`${playlistId}: ${added.length} added, ${removed.length} removed.`);
  } else if (isFirstRun) {
    console.log(`${playlistId}: seeding baseline snapshot with ${current.length} tracks.`);
  } else {
    console.log(`${playlistId}: no changes.`);
  }

  log.snapshot = current;
  writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
}

async function main() {
  const token = await getAccessToken();
  if (!token) return;

  await snapshotPlaylist(token, THESEUS_PLAYLIST_ID, LISTENING_LOG_PATH);

  const bestOfId = getActiveYearPlaylistId();
  if (bestOfId) {
    await snapshotPlaylist(token, bestOfId, BEST_OF_LOG_PATH, currentYear());
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 2: Verify the credential-missing path is safe**

Run: `node scripts/snapshot-playlist.mjs`
Expected: logs `Spotify credentials not set, skipping snapshot.` and exits cleanly, no files modified (confirm with `git status --short` showing nothing for `content/site/listening-log.json` or `content/collect/best-of-changelog.json`).

- [ ] **Step 3: Verify the active-year lookup handles the missing 2026 file**

Run:
```bash
node --input-type=module -e "
import { getActiveYearPlaylistId } from './scripts/snapshot-playlist.mjs';
console.log(getActiveYearPlaylistId());
"
```
Expected: logs `No content/collect/year/2026.json yet, skipping Best-of snapshot.` and prints `null` (there is no `content/collect/year/2026.json` in the repo yet).

- [ ] **Step 4: Commit**

```bash
git add scripts/snapshot-playlist.mjs
git commit -m "fix(collect): switch playlist snapshot to OAuth refresh-token auth"
```

---

### Task 6: Wire the refresh token into the snapshot workflow

**Files:**
- Modify: `.github/workflows/playlist-snapshot.yml`

**Interfaces:**
- Consumes: `scripts/snapshot-playlist.mjs` (Task 5), the `SPOTIFY_REFRESH_TOKEN` secret (Task 4, added by Keith).

- [ ] **Step 1: Update the workflow**

Replace the `Snapshot playlist` and `Commit if changed` steps in `.github/workflows/playlist-snapshot.yml`:

```yaml
      - name: Snapshot playlists
        env:
          SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
          SPOTIFY_CLIENT_SECRET: ${{ secrets.SPOTIFY_CLIENT_SECRET }}
          SPOTIFY_REFRESH_TOKEN: ${{ secrets.SPOTIFY_REFRESH_TOKEN }}
        run: node scripts/snapshot-playlist.mjs

      - name: Commit if changed
        run: |
          if git diff --quiet -- content/site/listening-log.json content/collect/best-of-changelog.json; then
            echo "No changes to commit."
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/site/listening-log.json content/collect/best-of-changelog.json
          git commit -m "chore(collect): update playlist changelogs"
          git push
```

- [ ] **Step 2: Sanity-check the workflow file**

Run:
```bash
grep -q 'SPOTIFY_REFRESH_TOKEN' .github/workflows/playlist-snapshot.yml && \
grep -q 'best-of-changelog.json' .github/workflows/playlist-snapshot.yml && \
echo OK
```
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/playlist-snapshot.yml
git commit -m "chore(collect): wire refresh token into playlist snapshot workflow"
```

---

### Task 7: `/collect/changelog` page

**Files:**
- Create: `app/collect/changelog/page.tsx`

**Interfaces:**
- Consumes: `getMusicChangelog(): ChangelogEntry[]` and the `ChangelogEntry` type from `lib/site-content.ts` (Task 1), `CollectHeader` (`components/collect-header.tsx`), `Section` (`components/section.tsx`).

- [ ] **Step 1: Write the page**

Create `app/collect/changelog/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CollectHeader } from "@/components/collect-header";
import { Section } from "@/components/section";
import { getMusicChangelog, type ChangelogEntry } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every change to Keith O'Brien's living lists: Theseus' Playlist, the Best-of-YYYY playlists, and the movies/TV top 10s.",
  alternates: { canonical: "/collect/changelog" },
  openGraph: {
    title: "Keith O'Brien — Changelog",
    description: "Every change to the living lists in /collect.",
    url: "/collect/changelog",
    type: "website",
    siteName: "Keith O'Brien",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien — Changelog",
    description: "Every change to the living lists in /collect.",
    images: ["/opengraph-image"],
  },
};

function domainLabel(entry: ChangelogEntry): string {
  switch (entry.domain) {
    case "playlist":
      return "Theseus' Playlist";
    case "best-of":
      return entry.year ? `Best of ${entry.year}` : "Best of";
    case "movies":
      return "Movies";
    case "tv":
      return "TV";
  }
}

function describeEntry(entry: ChangelogEntry): string {
  const withYear = entry.year ? `${entry.title} (${entry.year})` : entry.title;
  switch (entry.type) {
    case "added":
      return `+ ${entry.title}${entry.artists ? ` · ${entry.artists}` : ""}`;
    case "removed":
      return `− ${entry.title}${entry.artists ? ` · ${entry.artists}` : ""}`;
    case "entered":
      return `entered the top 10: ${withYear}, at #${entry.rank}`;
    case "exited":
      return `left the top 10: ${withYear}, was #${entry.previousRank}`;
    case "rank-change":
      return `${withYear} moved #${entry.previousRank} → #${entry.rank}`;
    case "watched":
      return `watched ${withYear}`;
  }
}

function EntryRow({ entry }: { entry: ChangelogEntry }) {
  return (
    <li className="flex items-baseline gap-3 text-[12.5px] border-b border-[var(--color-border)] pb-3 last:border-b-0">
      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--color-faint)] w-[110px] shrink-0">
        {domainLabel(entry)}
      </span>
      <span className="flex-1 text-[var(--color-muted)]">{describeEntry(entry)}</span>
      <span className="text-[var(--color-faint)] w-[60px] text-right shrink-0">
        {new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })}
      </span>
    </li>
  );
}

export default function ChangelogPage() {
  const entries = getMusicChangelog();

  return (
    <>
      <CollectHeader crumb="// collect · changelog" title="Changelog">
        <p>
          Every change to the living lists above: tracks moving in and out of
          Theseus&apos; Playlist and the Best-of-YYYY playlists, and titles
          entering, leaving, or reshuffling the movies and TV top 10s.
        </p>
      </CollectHeader>

      <Section label="History">
        {entries.length ? (
          <ul className="flex flex-col gap-0">
            {entries.map((entry, i) => (
              <EntryRow key={`${entry.domain}-${entry.type}-${entry.date}-${i}`} entry={entry} />
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-[var(--color-muted)]">
            Nothing logged yet. Check back after the next update.
          </p>
        )}
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succeeds, `/collect/changelog` appears in the route list Next prints.

- [ ] **Step 3: Commit**

```bash
git add app/collect/changelog/page.tsx
git commit -m "feat(collect): add unified changelog page"
```

---

### Task 8: Link the changelog from the hub, music, and watching pages

**Files:**
- Modify: `app/collect/page.tsx`
- Modify: `app/collect/music/page.tsx`
- Modify: `app/collect/watching/page.tsx`

**Interfaces:**
- Consumes: the `/collect/changelog` route from Task 7. No new exports.

- [ ] **Step 1: Add a secondary changelog link to the `/collect` hub**

In `app/collect/page.tsx`, inside the `<Section label="Lanes">` block, add a small secondary link after the closing `</div>` of the `LANES.map` rows, still inside `<Section>`:

```tsx
      <Section label="Lanes">
        <div className="space-y-3">
          {LANES.map((lane) => (
            <LaneRow key={lane.label} lane={lane} />
          ))}
        </div>
        <Link
          href="/collect/changelog"
          className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          Changelog &rarr;
        </Link>
      </Section>
```

- [ ] **Step 2: Add a "full changelog" link to `/collect/music`**

In `app/collect/music/page.tsx`, inside the `<Section label="All time">` block, replace:

```tsx
      <Section label="All time">
        <ComingSoon />
      </Section>
```

with:

```tsx
      <Section label="All time">
        <ComingSoon />
      </Section>

      <Section label="Changelog">
        <Link
          href="/collect/changelog"
          className="text-[13px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
        >
          Full changelog &rarr;
        </Link>
      </Section>
```

- [ ] **Step 3: Add a "full changelog" link to `/collect/watching`**

In `app/collect/watching/page.tsx`, after the last `</Section>` (the "Recently rated TV" one), add:

```tsx
      <Section label="Changelog">
        <Link
          href="/collect/changelog"
          className="text-[13px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
        >
          Full changelog &rarr;
        </Link>
      </Section>
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors.

- [ ] **Step 5: Commit**

```bash
git add app/collect/page.tsx app/collect/music/page.tsx app/collect/watching/page.tsx
git commit -m "feat(collect): link changelog from hub, music, and watching"
```

---

### Task 9: Rename homepage "Listening" to "Theseus' Playlist"

**Files:**
- Modify: `app/page.tsx`
- Modify: `content/site/listening.json`

**Interfaces:**
- Consumes: `getListening()`, `getListeningChanges()` (unchanged signatures from `lib/site-content.ts`), the `/collect/changelog` route from Task 7.

- [ ] **Step 1: Update the note copy**

Replace the contents of `content/site/listening.json`:

```json
{
  "playlistId": "7BKBw7iShlGZmp5KZl2FFF",
  "note": "Named for the ship that stayed itself while every plank got replaced. Tracks rotate in and out below; the playlist doesn't."
}
```

- [ ] **Step 2: Rename the section and add the changelog link**

In `app/page.tsx`, change the comment and label:

```tsx
      {/* Theseus' Playlist */}
      {listening.playlistId && (
        <Section label="Theseus' Playlist">
```

(was `{/* Listening */}` and `<Section label="Listening">`)

Then, immediately after the closing `)}` of the `{listeningChanges.length > 0 && (...)}` block and before the closing `</Section>`, add:

```tsx
          <Link
            href="/collect/changelog"
            className="inline-block mt-8 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
          >
            full changelog &rarr;
          </Link>
```

- [ ] **Step 3: Confirm the rename landed**

Run: `grep -n "Theseus' Playlist" app/page.tsx`
Expected: one match on the `<Section label=...>` line.

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx content/site/listening.json
git commit -m "feat(collect): rename Listening to Theseus' Playlist, link changelog"
```
