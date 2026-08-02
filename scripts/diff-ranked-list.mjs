// Runs in CI (.github/workflows/watching-changelog.yml) on push to
// content/collect/watching.json or content/collect/watching-annual.json.
// Diffs the previous committed version against the new one to derive
// changelog entries: rank movement for the all-time top-10 lists, entry/exit
// for the per-release-year top-5s, and new "watched" entries for the
// recency feeds.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const WATCHING_PATH = new URL("../content/collect/watching.json", import.meta.url);
const ANNUAL_PATH = new URL("../content/collect/watching-annual.json", import.meta.url);
const CHANGELOG_PATH = new URL("../content/collect/watching-changelog.json", import.meta.url);

function key(entry) {
  return `${entry.title}::${entry.year}`;
}

function diffList(oldList, newList, date, domain) {
  const entries = [];
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

  return entries;
}

export function diffRankedLists(oldData, newData) {
  const date = newData.generated_at;
  return [
    ...diffList(oldData.top_movies ?? [], newData.top_movies ?? [], date, "movies"),
    ...diffList(oldData.top_tv ?? [], newData.top_tv ?? [], date, "tv"),
  ];
}

// Per-release-year top 5 films (content/collect/watching-annual.json).
// A film's own `year` always equals the bucket it lives in, so no separate
// year tag is needed beyond what's already on each entry.
export function diffAnnualLists(oldAnnual, newAnnual) {
  const date = newAnnual.generated_at;
  const oldYears = oldAnnual?.years ?? {};
  const newYears = newAnnual?.years ?? {};
  const allYears = new Set([...Object.keys(oldYears), ...Object.keys(newYears)]);

  const entries = [];
  for (const year of allYears) {
    entries.push(...diffList(oldYears[year]?.film ?? [], newYears[year]?.film ?? [], date, "annual"));
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

function getPreviousFile(relativePath) {
  try {
    const raw = execSync(`git show HEAD^:${relativePath}`, { encoding: "utf-8" });
    return JSON.parse(raw);
  } catch (err) {
    // "unknown revision" / "bad revision" errors are expected on first run (no HEAD^)
    if (err.message && (err.message.includes("unknown revision") || err.message.includes("bad revision"))) {
      return null;
    }
    // Anything else is a real failure worth logging
    console.warn(`Failed to retrieve previous ${relativePath}: ${err.message}`);
    return null;
  }
}

function main() {
  const newData = JSON.parse(readFileSync(WATCHING_PATH, "utf-8"));
  const oldData = getPreviousFile("content/collect/watching.json");
  const newAnnual = JSON.parse(readFileSync(ANNUAL_PATH, "utf-8"));
  const oldAnnual = getPreviousFile("content/collect/watching-annual.json");
  const changelog = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));

  const rankChanges = oldData ? diffRankedLists(oldData, newData) : [];
  const annualChanges = oldAnnual ? diffAnnualLists(oldAnnual, newAnnual) : [];
  const watched = diffWatchedFeeds(newData, changelog.changes ?? []);
  const newEntries = [...rankChanges, ...annualChanges, ...watched];

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
