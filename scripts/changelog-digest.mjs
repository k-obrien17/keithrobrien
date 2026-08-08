// Runs in CI (.github/workflows/changelog-digest.yml) once a day. Reports
// only entries added to the two changelog feeds since the last digest run,
// tracked via content/collect/digest-state.json (a high-water mark on each
// feed's length, since both feeds only ever prepend new entries). Sends
// nothing on a quiet day, matching the house pattern in
// world-cup-price-tracker-archive/src/notify.ts: silence over noise.
import { readFileSync, writeFileSync } from "node:fs";
import { Resend } from "resend";

const WATCHING_LOG_PATH = new URL("../content/collect/watching-changelog.json", import.meta.url);
const BEST_OF_LOG_PATH = new URL("../content/collect/best-of-changelog.json", import.meta.url);
const STATE_PATH = new URL("../content/collect/digest-state.json", import.meta.url);

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function loadState() {
  try {
    return readJSON(STATE_PATH);
  } catch {
    return { watchingChangelogSeen: 0, bestOfChangelogSeen: 0 };
  }
}

// Both feeds prepend new entries, so "new since last run" is just the
// leading slice past however many entries existed at the last digest.
function newEntriesSince(changes, previouslySeen) {
  const newCount = Math.max(0, changes.length - previouslySeen);
  return changes.slice(0, newCount);
}

function describeWatchingEntry(e) {
  if (e.type === "watched") return `Watched: ${e.title} (${e.year})`;
  if (e.type === "entered") return `${e.title} (${e.year}) entered the ${e.domain} top list at #${e.rank}`;
  if (e.type === "exited") return `${e.title} (${e.year}) dropped out of the ${e.domain} top list`;
  if (e.type === "rank-change")
    return `${e.title} (${e.year}) moved #${e.previousRank} to #${e.rank} in the ${e.domain} top list`;
  return `${e.type}: ${e.title} (${e.year})`;
}

function describeBestOfEntry(e) {
  const verb = e.type === "added" ? "Added" : "Removed";
  return `${verb} from Best-of ${e.year}: ${e.title}, ${e.artists}`;
}

function buildEmail(newWatching, newBestOf) {
  const total = newWatching.length + newBestOf.length;
  const lines = [];

  if (newWatching.length > 0) {
    lines.push("Movies & TV", "-----------");
    for (const e of newWatching) lines.push(`- ${describeWatchingEntry(e)}`);
    lines.push("");
  }

  if (newBestOf.length > 0) {
    lines.push("Best-of Spotify playlists", "-------------------------");
    for (const e of newBestOf) lines.push(`- ${describeBestOfEntry(e)}`);
    lines.push("");
  }

  return {
    subject: `keithrobrien.com changelog: ${total} update${total === 1 ? "" : "s"}`,
    text: lines.join("\n").trim(),
  };
}

async function main() {
  const state = loadState();
  const watching = readJSON(WATCHING_LOG_PATH);
  const bestOf = readJSON(BEST_OF_LOG_PATH);

  const newWatching = newEntriesSince(watching.changes ?? [], state.watchingChangelogSeen);
  const newBestOf = newEntriesSince(bestOf.changes ?? [], state.bestOfChangelogSeen);

  const nextState = {
    watchingChangelogSeen: (watching.changes ?? []).length,
    bestOfChangelogSeen: (bestOf.changes ?? []).length,
  };

  if (newWatching.length === 0 && newBestOf.length === 0) {
    console.log("No new changelog entries since last digest, nothing to send.");
    writeFileSync(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
    return;
  }

  const { subject, text } = buildEmail(newWatching, newBestOf);
  const to = process.env.NOTIFY_TO_EMAIL || "keith@totalemphasis.com";
  const from = process.env.RESEND_FROM_EMAIL || "keithrobrien.com Changelog <onboarding@resend.dev>";

  if (process.env.NOTIFY_DRY_RUN) {
    console.log(`[dry run] would send to ${to} from ${from}`);
    console.log(`Subject: ${subject}\n`);
    console.log(text);
    writeFileSync(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set, skipping send (state not advanced so nothing is lost).");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) {
    console.error("Resend send failed:", error);
    process.exitCode = 1;
    return;
  }

  console.log(`Sent digest to ${to}: ${newWatching.length} watching entries, ${newBestOf.length} best-of entries.`);
  writeFileSync(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
}

main();
