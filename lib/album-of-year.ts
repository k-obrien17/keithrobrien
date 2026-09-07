import albumOfYearJson from "@/content/collect/album-of-year.json";

export interface AlbumOfYear {
  title: string;
  artist: string;
  year: number;
  score: number;
  mb_url: string;
  cover_url: string | null;
}

/** The owner's highest-rated album released in a given year, if any. */
export function getAlbumOfYear(year: number): AlbumOfYear | null {
  const byYear = (albumOfYearJson as { by_year: Record<string, AlbumOfYear> }).by_year;
  return byYear[String(year)] ?? null;
}
