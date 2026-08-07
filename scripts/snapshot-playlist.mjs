// Runs in CI (.github/workflows/playlist-snapshot.yml) on a cron. Spotify
// has no playlist-history endpoint, so this snapshots current tracks and
// diffs against the last snapshot to derive added/removed changelog
// entries. Snapshots Theseus' Playlist plus every Best-of-YYYY playlist
// with a music.spotify_url, current year included, so a hand-edit to an
// old year's playlist (e.g. fixing 2003's list) still gets caught.
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const THESEUS_PLAYLIST_ID = "7BKBw7iShlGZmp5KZl2FFF";
const LISTENING_LOG_PATH = new URL("../content/site/listening-log.json", import.meta.url);
const BEST_OF_LOG_PATH = new URL("../content/collect/best-of-changelog.json", import.meta.url);
const YEAR_DIR = new URL("../content/collect/year/", import.meta.url);

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
  // Spotify's February 2026 Dev Mode migration renamed this sub-resource
  // from /tracks to /items (and the per-item `track` field to `item`),
  // dropped the page cap from 100 to 50, and restricted it to playlists
  // the authenticated user owns or collaborates on.
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/items?limit=50`;
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error(`Playlist ${playlistId} items request failed: ${res.status}`);
      console.error(await res.text());
      return null;
    }
    const data = await res.json();
    for (const entry of data.items ?? []) {
      if (!entry.item || entry.item.type !== "track") continue;
      tracks.push({
        id: entry.item.id,
        title: entry.item.name,
        artists: entry.item.artists.map((a) => a.name).join(", "),
      });
    }
    url = data.next;
  }
  return tracks;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Every content/collect/year/<year>.json with a music.spotify_url, not just
// the current year, so edits to old Best-of playlists get diffed too.
export function getAllYearPlaylists() {
  const dirPath = fileURLToPath(YEAR_DIR);
  if (!existsSync(dirPath)) return [];

  const out = [];
  for (const file of readdirSync(dirPath)) {
    if (!file.endsWith(".json")) continue;
    const year = Number(file.slice(0, -".json".length));
    if (!Number.isFinite(year)) continue;

    const data = JSON.parse(readFileSync(new URL(file, YEAR_DIR), "utf-8"));
    const url = data.music?.spotify_url;
    if (!url) continue;
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!match) continue;
    out.push({ year, id: match[1] });
  }
  return out.sort((a, b) => b.year - a.year);
}

// Returns a status object rather than throwing so one producer's failure
// doesn't stop the other from running or from being reported.
async function snapshotPlaylist(token, playlistId, logPath, label, year) {
  const current = await getCurrentTracks(token, playlistId);
  if (!current) {
    return { label, state: "error", detail: "Spotify API request failed, see logs above" };
  }

  const log = JSON.parse(readFileSync(logPath, "utf-8"));
  const previous = log.snapshot ?? [];
  const isFirstRun = previous.length === 0 || log.snapshotPlaylistId !== playlistId;

  const previousIds = new Set(previous.map((t) => t.id));
  const currentIds = new Set(current.map((t) => t.id));

  const added = current.filter((t) => !previousIds.has(t.id));
  const removed = previous.filter((t) => !currentIds.has(t.id));

  let result;
  if (!isFirstRun && (added.length > 0 || removed.length > 0)) {
    const date = todayISO();
    const yearField = year ? { year } : {};
    const newEntries = [
      ...added.map((t) => ({ date, type: "added", title: t.title, artists: t.artists, ...yearField })),
      ...removed.map((t) => ({ date, type: "removed", title: t.title, artists: t.artists, ...yearField })),
    ];
    log.changes = [...newEntries, ...(log.changes ?? [])];
    result = { label, state: "diff", detail: `${added.length} added, ${removed.length} removed` };
  } else if (isFirstRun) {
    result = { label, state: "seeded", detail: `baseline seeded with ${current.length} tracks` };
  } else {
    result = { label, state: "no-op", detail: "no changes" };
  }

  log.snapshot = current;
  log.snapshotPlaylistId = playlistId;
  writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
  return result;
}

// Same diff logic as snapshotPlaylist, but for many playlists sharing one
// log file: content/collect/best-of-changelog.json keeps one snapshot per
// year under `snapshots`, plus a single combined `changes` feed. Self-heals
// the old single-playlist shape (top-level `snapshot`/`snapshotPlaylistId`,
// from when only the current year was tracked) into the new shape on first
// run after this change.
async function snapshotYearPlaylists(token, yearPlaylists, logPath) {
  const log = JSON.parse(readFileSync(logPath, "utf-8"));
  const snapshots = log.snapshots ?? {};
  if (!log.snapshots && log.snapshot && log.snapshotPlaylistId) {
    const legacyYear = yearPlaylists.find((y) => y.id === log.snapshotPlaylistId);
    if (legacyYear) {
      snapshots[legacyYear.year] = { playlistId: log.snapshotPlaylistId, tracks: log.snapshot };
    }
  }

  const results = [];
  const allNewEntries = [];

  for (const { year, id: playlistId } of yearPlaylists) {
    const current = await getCurrentTracks(token, playlistId);
    if (!current) {
      results.push({ label: `Best-of ${year}`, state: "error", detail: "Spotify API request failed, see logs above" });
      continue;
    }

    const prev = snapshots[year];
    const isFirstRun = !prev || prev.playlistId !== playlistId;
    const previousTracks = prev?.tracks ?? [];
    const previousIds = new Set(previousTracks.map((t) => t.id));
    const currentIds = new Set(current.map((t) => t.id));

    const added = current.filter((t) => !previousIds.has(t.id));
    const removed = previousTracks.filter((t) => !currentIds.has(t.id));

    if (!isFirstRun && (added.length > 0 || removed.length > 0)) {
      const date = todayISO();
      allNewEntries.push(
        ...added.map((t) => ({ date, type: "added", title: t.title, artists: t.artists, year })),
        ...removed.map((t) => ({ date, type: "removed", title: t.title, artists: t.artists, year }))
      );
      results.push({ label: `Best-of ${year}`, state: "diff", detail: `${added.length} added, ${removed.length} removed` });
    } else if (isFirstRun) {
      results.push({ label: `Best-of ${year}`, state: "seeded", detail: `baseline seeded with ${current.length} tracks` });
    } else {
      results.push({ label: `Best-of ${year}`, state: "no-op", detail: "no changes" });
    }

    snapshots[year] = { playlistId, tracks: current };
  }

  const changes = [...allNewEntries, ...(log.changes ?? [])];
  writeFileSync(logPath, `${JSON.stringify({ changes, snapshots }, null, 2)}\n`);
  return results;
}

// Prints a summary line per producer and, in CI, writes the same lines to
// the job's step summary so a skip or a genuine error is visible without
// opening raw step logs. Only "error" flips the job to a failing exit code,
// "skipped" covers expected preconditions (missing creds, no year file yet).
function reportResults(results) {
  const lines = results.map((r) => `- **${r.label}**: ${r.state} (${r.detail})`);
  console.log(lines.join("\n"));

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    appendFileSync(summaryPath, `${lines.join("\n")}\n`);
  }

  if (results.some((r) => r.state === "error")) {
    process.exitCode = 1;
  }
}

async function main() {
  const results = [];
  const token = await getAccessToken();
  if (!token) {
    results.push({ label: "Spotify auth", state: "skipped", detail: "credentials not set" });
    reportResults(results);
    return;
  }

  results.push(await snapshotPlaylist(token, THESEUS_PLAYLIST_ID, LISTENING_LOG_PATH, "Theseus' Playlist"));

  const yearPlaylists = getAllYearPlaylists();
  if (yearPlaylists.length === 0) {
    results.push({ label: "Best-of playlists", state: "skipped", detail: "no year files with music.spotify_url" });
  } else {
    results.push(...(await snapshotYearPlaylists(token, yearPlaylists, BEST_OF_LOG_PATH)));
  }

  reportResults(results);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
