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

  for (const field of ["recently_watched", "recent_tv"]) {
    for (const entry of newData[field] ?? []) {
      const domain = entry.type === "tv" ? "tv" : "movies";
      const k = `${domain}::${entry.title}::${entry.year}::${entry.logged}`;
      if (!seen.has(k)) {
        entries.push({ date: entry.logged, domain, type: "watched", title: entry.title, year: entry.year });
        seen.add(k);
      }
    }
  }

  return entries;
}

function getPreviousWatching() {
  try {
    const raw = execSync("git show HEAD^:content/collect/watching.json", { encoding: "utf-8" });
    return JSON.parse(raw);
  } catch (err) {
    // "unknown revision" / "bad revision" errors are expected on first run (no HEAD^)
    if (err.message && (err.message.includes("unknown revision") || err.message.includes("bad revision"))) {
      return null;
    }
    // Anything else is a real failure worth logging
    console.warn(`Failed to retrieve previous watching.json: ${err.message}`);
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
