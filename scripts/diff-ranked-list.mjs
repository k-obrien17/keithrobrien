// Runs in CI (.github/workflows/watching-changelog.yml) on push to
// content/collect/watching.json or content/collect/watching-annual.json.
// Diffs the previous committed version against the new one to derive
// changelog entries: rank movement for the all-time top-10 lists, entry/exit
// for the per-release-year top-5s, and new "watched" entries for the
// recency feeds.
import { execSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

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

// Returns a tagged result so a genuine git/parse failure can be told apart
// from the expected "no previous commit yet" case. Conflating them (the
// prior behavior) silently treated any failure as "nothing to diff" and
// exited clean -- the same silent-failure shape that let Theseus' Playlist
// run broken for 10 days before anyone noticed.
function loadPreviousFile(relativePath) {
  try {
    const raw = execSync(`git show HEAD^:${relativePath}`, { encoding: "utf-8" });
    return { data: JSON.parse(raw), state: "ok" };
  } catch (err) {
    if (err.message && (err.message.includes("unknown revision") || err.message.includes("bad revision"))) {
      return { data: null, state: "first-run" };
    }
    return { data: null, state: "error", detail: err.message };
  }
}

// Mirrors scripts/snapshot-playlist.mjs's reportResults: prints one summary
// line per domain and, in CI, writes the same lines to the job's step
// summary so a skip or a genuine error is visible without opening raw step
// logs. Only "error" flips the job to a failing exit code.
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

function main() {
  const results = [];
  const newData = JSON.parse(readFileSync(WATCHING_PATH, "utf-8"));
  const newAnnual = JSON.parse(readFileSync(ANNUAL_PATH, "utf-8"));
  const changelog = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));

  const prevWatching = loadPreviousFile("content/collect/watching.json");
  let rankChanges = [];
  if (prevWatching.state === "ok") {
    rankChanges = diffRankedLists(prevWatching.data, newData);
    results.push(
      rankChanges.length > 0
        ? { label: "Movies/TV rankings", state: "diff", detail: `${rankChanges.length} changes` }
        : { label: "Movies/TV rankings", state: "no-op", detail: "no changes" },
    );
  } else if (prevWatching.state === "first-run") {
    results.push({ label: "Movies/TV rankings", state: "skipped", detail: "no previous commit to diff against (first run)" });
  } else {
    results.push({ label: "Movies/TV rankings", state: "error", detail: prevWatching.detail });
  }

  const prevAnnual = loadPreviousFile("content/collect/watching-annual.json");
  let annualChanges = [];
  if (prevAnnual.state === "ok") {
    annualChanges = diffAnnualLists(prevAnnual.data, newAnnual);
    results.push(
      annualChanges.length > 0
        ? { label: "Annual top-5s", state: "diff", detail: `${annualChanges.length} changes` }
        : { label: "Annual top-5s", state: "no-op", detail: "no changes" },
    );
  } else if (prevAnnual.state === "first-run") {
    results.push({ label: "Annual top-5s", state: "skipped", detail: "no previous commit to diff against (first run)" });
  } else {
    results.push({ label: "Annual top-5s", state: "error", detail: prevAnnual.detail });
  }

  const watched = diffWatchedFeeds(newData, changelog.changes ?? []);
  results.push(
    watched.length > 0
      ? { label: "Watched feed", state: "diff", detail: `${watched.length} new entries` }
      : { label: "Watched feed", state: "no-op", detail: "no changes" },
  );

  const newEntries = [...rankChanges, ...annualChanges, ...watched];
  if (newEntries.length > 0) {
    changelog.changes = [...newEntries, ...(changelog.changes ?? [])];
    writeFileSync(CHANGELOG_PATH, `${JSON.stringify(changelog, null, 2)}\n`);
  }

  reportResults(results);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
