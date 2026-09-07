import fs from "node:fs";
import path from "node:path";
import annual from "@/content/collect/watching-annual.json";

export type Film = {
  title: string;
  year: number | null;
  score: number;
  type: string;
  tmdb_url: string | null;
};

export type Track = {
  track: string;
  artist: string;
  album: string;
};

export type Book = {
  title: string;
  author: string;
  note?: string;
  link?: string;
};

export type YearMusic = { spotify_url: string; tracks: Track[]; ranked: boolean };

export type YearData = {
  year: number;
  music: YearMusic | null;
  film: Film[];
  tv: Film[];
  reading: Book[];
};

const YEAR_DIR = path.join(process.cwd(), "content/collect/year");
const annualYears = annual.years as Record<string, { film: Film[]; tv: Film[] }>;

type HandYear = { music?: YearMusic; reading?: Book[] };

function readHandYear(year: number): HandYear {
  const p = path.join(YEAR_DIR, `${year}.json`);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8")) as HandYear;
}

/** Every year that has any data, from either source, newest first. */
export function getYears(): number[] {
  const set = new Set<number>();
  Object.keys(annualYears).forEach((y) => set.add(Number(y)));
  if (fs.existsSync(YEAR_DIR)) {
    for (const f of fs.readdirSync(YEAR_DIR)) {
      if (f.endsWith(".json")) set.add(Number(f.replace(".json", "")));
    }
  }
  return [...set].sort((a, b) => b - a);
}

export function getYearData(year: number): YearData {
  const hand = readHandYear(year);
  const a = annualYears[String(year)] ?? { film: [], tv: [] };
  const music =
    hand.music && hand.music.tracks?.length ? hand.music : null;
  return {
    year,
    music,
    film: a.film ?? [],
    tv: a.tv ?? [],
    reading: hand.reading ?? [],
  };
}

/** The highest-scored film for a year, or null if there's no film data yet. */
export function getTopFilm(year: number): Film | null {
  const films = getYearData(year).film;
  if (films.length === 0) return null;
  return films.reduce((best, f) => (f.score > best.score ? f : best));
}

/** Years that have a songs-of-the-year list, newest first. */
export function getMusicYears(): number[] {
  return getYears().filter((y) => getYearData(y).music);
}

/** Years that have a favorite-films list, newest first. */
export function getFilmYears(): number[] {
  return getYears().filter((y) => getYearData(y).film.length > 0);
}

export type InProgressPlaylist = {
  year: number;
  spotifyUrl: string;
  playlistId: string;
};

/**
 * The newest year with a Spotify playlist started but no tracklist curated
 * yet, i.e. the current "best of" in progress. Returns null once that
 * year's tracklist is published (music.tracks stops being empty).
 */
export function getInProgressPlaylist(): InProgressPlaylist | null {
  for (const year of getYears()) {
    const hand = readHandYear(year);
    const spotifyUrl = hand.music?.spotify_url;
    if (!spotifyUrl || (hand.music?.tracks.length ?? 0) > 0) continue;
    const playlistId = spotifyUrl.split("/playlist/")[1]?.split("?")[0];
    if (!playlistId) continue;
    return { year, spotifyUrl, playlistId };
  }
  return null;
}
