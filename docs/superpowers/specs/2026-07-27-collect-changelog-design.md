# Collect changelog system

Status: approved, not yet implemented.

## Problem

`/collect` tracks several living lists: Theseus' Playlist (a rotating Spotify
playlist), the 47 Best-of-YYYY archive playlists, and the movies/TV top-10s
and recency feeds pulled from media-library. None of these currently show
their own history. The homepage has a small "Listening" mini-log of the last
6 playlist changes, but the underlying Spotify snapshot script is broken
(see below), and there's no changelog at all for the Best-of-YYYY playlists
or the movies/TV lists.

Goal: a unified, mostly-automated changelog spanning all three domains,
surfaced both as a small mini-log on the homepage (existing) and a full
history page under `/collect`.

Albums are explicitly out of scope until Keith's top-10 albums list (from
his ranking app) is finalized. The diff mechanics below are designed to be
reused for albums later without rework.

## Architecture

Two independent producers write to static JSON logs. A shared
`getMusicChangelog()` reads and merges them at build/render time; there is
no runtime database.

1. **Spotify-polling producer** (Theseus' Playlist + Best-of-YYYY playlists):
   a scheduled GitHub Action snapshots playlist contents, diffs against the
   last snapshot, and appends added/removed entries.
2. **Git-diff producer** (movies/TV top-10s and recency feeds): a GitHub
   Action triggered on push to `content/collect/watching.json` diffs the
   previous committed version against the new one and appends entries
   describing what changed.

Both producers write append-only JSON logs under `content/collect/` /
`content/site/`. Nothing is deleted or rewritten after the fact; corrections
are handled by editing the canonical source data, not the changelog log.

## Data model

### `ChangelogEntry` (unified shape)

```ts
interface ChangelogEntry {
  date: string; // ISO date, UTC
  domain: "playlist" | "best-of" | "movies" | "tv";
  type: "added" | "removed" | "entered" | "exited" | "rank-change" | "watched";
  title: string;
  artists?: string; // playlist/best-of only
  year?: number; // movies/tv only
  rank?: number; // rank-change / entered only
  previousRank?: number; // rank-change only
}
```

`getMusicChangelog()` in `lib/site-content.ts` reads
`content/site/listening-log.json`, `content/collect/best-of-changelog.json`,
and `content/collect/watching-changelog.json`, maps each to
`ChangelogEntry[]`, concatenates, and sorts descending by `date`.

### `content/site/listening-log.json` (existing, unchanged shape)

Already exists: `{ snapshot: Track[], changes: ListeningChange[] }`. The
`ListeningChange` shape (`date`, `type: "added" | "removed"`, `title`,
`artists`) maps directly onto `ChangelogEntry` with `domain: "playlist"`.

### `content/collect/best-of-changelog.json` (new)

Same shape as `listening-log.json` (`snapshot` + `changes`), one file
covering all Best-of-YYYY playlists collectively. Only the current year's
playlist(s) are realistically live; past years are frozen archives, so in
practice this stays quiet outside the active year.

### `content/collect/watching-changelog.json` (new)

`{ changes: ChangelogEntry[] }` with `domain: "movies" | "tv"`. Populated
only by the git-diff producer, never hand-edited.

## Spotify auth fix

Root cause: Spotify's Nov 2024 API policy change blocks client-credentials
tokens from reading playlist track content, even on public playlists, so
`scripts/snapshot-playlist.mjs` has been silently failing (`listening-log.json`
is currently `{ snapshot: [], changes: [] }`).

Fix: mint a one-time OAuth refresh token via browser auth (not
client-credentials), store it as `SPOTIFY_REFRESH_TOKEN` in GitHub Actions
secrets alongside the existing `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET`.
`snapshot-playlist.mjs` exchanges the refresh token for a short-lived access
token at the start of each run instead of using the client-credentials
grant. `lib/spotify.ts` (currently unused, client-credentials only) is left
as-is for now; it will hit the same 403 if ever wired up and should be
updated to the refresh-token flow whenever it's actually used.

The same fixed snapshot mechanism extends to the Best-of-YYYY playlists:
`snapshot-playlist.mjs` becomes parameterized over playlist ID, run once for
Theseus' Playlist (writing `listening-log.json`) and once for the active
year's Best-of playlist (writing `best-of-changelog.json`). "Active year"
means the current calendar year; its playlist ID is read from
`content/collect/year/<current-year>.json`'s `music.spotify_url`, same
source the `/collect/music` pages already use. Both snapshot runs stay on
the existing `playlist-snapshot.yml` cron cadence (Mon/Thu), just extended
to loop over both playlist IDs in one job.

## Movies/TV git-diff mechanics

- **Trigger:** GitHub Action on push to `main`, `paths:
  content/collect/watching.json`. No polling: media-library already commits
  the refreshed JSON directly, so the push itself is the signal.
- **Script:** `scripts/diff-ranked-list.mjs`, generic over "ranked top-N
  list, keyed by title+year." Reads the previous committed version via `git
  show HEAD^:content/collect/watching.json`, diffs against the new
  working-tree version.
  - `top_movies` / `top_tv` (ranked, all-time top 10): emits `entered` (new
    to the top 10), `exited` (fell out), `rank-change` (moved position).
    Rank movement is the meaningful signal here, not raw text diff.
  - `recently_watched` / `recent_tv` (unranked recency feed): emits
    `watched` for any title not already logged, keyed off the `logged` date
    already present in the source data. Titles aging off the list are not a
    `removed` event, they've just scrolled past.
- **Output:** appends to `content/collect/watching-changelog.json`.
- **Reuse:** the same script becomes the template for the albums changelog
  once that list exists, since it's already generic over ranked-list diffing.
- **Backfill:** none. The `e23d93f` refresh (which swapped several
  `recently_watched`/`recent_tv` entries, e.g. "Free Solo" → "Pressure")
  predates this mechanism and will not be reconstructed. The changelog
  starts clean from whenever the Action first runs.

## UI

- **New route:** `/collect/changelog`. Not a primary lane tile on the
  `/collect` hub grid, since it cuts across the music and watching lanes
  rather than belonging to one. Linked as a small secondary link from the
  hub, plus a "full changelog →" link from `/collect/music` and
  `/collect/watching`.
- **Content:** single reverse-chronological feed from `getMusicChangelog()`.
  Each row shows a domain tag (Playlist / Best of `<year>` / Movies / TV)
  since the page is multi-source, unlike the homepage mini-log.
- **Homepage mini-log:** unchanged in behavior (last 6 Theseus' Playlist
  entries only, via `getListeningChanges().slice(0, 6)`), gains a "full
  changelog →" link at the bottom pointing to `/collect/changelog`.
- **Rename:** homepage `Section label="Listening"` becomes **"Theseus'
  Playlist"**. Note copy in `content/site/listening.json` updates from "A
  living playlist. Songs move in and out as the rotation changes." to:

  > Named for the ship that stayed itself while every plank got replaced.
  > Tracks rotate in and out below; the playlist doesn't.

## Out of scope

- Albums changelog (deferred until the top-10 albums list is finalized).
- Any runtime/database-backed changelog; everything here is static JSON
  regenerated by CI and committed.
- Reworking `lib/spotify.ts` beyond noting it needs the same refresh-token
  fix if it's ever used.
