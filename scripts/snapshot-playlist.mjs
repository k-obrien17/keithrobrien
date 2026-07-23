// Runs in CI (.github/workflows/playlist-snapshot.yml) on a daily cron.
// Spotify's API has no playlist-history endpoint, so this snapshots the
// current track list and diffs it against the last snapshot to derive
// added/removed changelog entries.
import { readFileSync, writeFileSync } from "node:fs";

const PLAYLIST_ID = "7BKBw7iShlGZmp5KZl2FFF";
const LOG_PATH = new URL("../content/site/listening-log.json", import.meta.url);

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.log("Spotify credentials not set, skipping snapshot.");
    return null;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    console.error(`Token request failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data.access_token ?? null;
}

async function getCurrentTracks(token) {
  const fields =
    "tracks.items(track(id,name,external_urls.spotify,artists(name)))";
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}?fields=${encodeURIComponent(fields)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    console.error(`Playlist request failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return (data.tracks?.items ?? [])
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

async function main() {
  const token = await getAccessToken();
  if (!token) return;

  const current = await getCurrentTracks(token);
  if (!current) return;

  const log = JSON.parse(readFileSync(LOG_PATH, "utf-8"));
  const previous = log.snapshot ?? [];
  const isFirstRun = previous.length === 0;

  const previousIds = new Set(previous.map((t) => t.id));
  const currentIds = new Set(current.map((t) => t.id));

  const added = current.filter((t) => !previousIds.has(t.id));
  const removed = previous.filter((t) => !currentIds.has(t.id));

  if (!isFirstRun && (added.length > 0 || removed.length > 0)) {
    const date = todayISO();
    const newEntries = [
      ...added.map((t) => ({ date, type: "added", title: t.title, artists: t.artists })),
      ...removed.map((t) => ({ date, type: "removed", title: t.title, artists: t.artists })),
    ];
    log.changes = [...newEntries, ...(log.changes ?? [])];
    console.log(`${added.length} added, ${removed.length} removed.`);
  } else if (isFirstRun) {
    console.log(`Seeding baseline snapshot with ${current.length} tracks.`);
  } else {
    console.log("No changes.");
  }

  log.snapshot = current;
  writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`);
}

main();
