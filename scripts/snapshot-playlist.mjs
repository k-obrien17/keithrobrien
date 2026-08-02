// Runs in CI (.github/workflows/playlist-snapshot.yml) on a cron. Spotify
// has no playlist-history endpoint, so this snapshots current tracks and
// diffs against the last snapshot to derive added/removed changelog
// entries. Snapshots both Theseus' Playlist and the active year's
// Best-of-YYYY playlist.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

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

export function currentYear() {
  return new Date().getUTCFullYear();
}

export function getActiveYearPlaylistId() {
  const year = currentYear();
  const p = new URL(`../content/collect/year/${year}.json`, import.meta.url);
  if (!existsSync(p)) {
    return { id: null, reason: `no content/collect/year/${year}.json yet` };
  }
  const data = JSON.parse(readFileSync(p, "utf-8"));
  const url = data.music?.spotify_url;
  if (!url) {
    return { id: null, reason: `content/collect/year/${year}.json has no music.spotify_url` };
  }
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (!match) {
    return { id: null, reason: "music.spotify_url doesn't contain a playlist ID" };
  }
  return { id: match[1], reason: null };
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

  const year = currentYear();
  const { id: bestOfId, reason: bestOfSkipReason } = getActiveYearPlaylistId();
  if (bestOfId) {
    results.push(await snapshotPlaylist(token, bestOfId, BEST_OF_LOG_PATH, `Best-of ${year}`, year));
  } else {
    results.push({ label: `Best-of ${year}`, state: "skipped", detail: bestOfSkipReason });
  }

  reportResults(results);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
