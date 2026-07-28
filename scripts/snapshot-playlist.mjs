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
  const isFirstRun = previous.length === 0 || log.snapshotPlaylistId !== playlistId;

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
  log.snapshotPlaylistId = playlistId;
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
