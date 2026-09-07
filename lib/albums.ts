import albumsJson from "@/content/collect/albums.json";

export interface Album {
  title: string;
  artist: string;
  year: number;
  score: number;
  mb_url: string;
}

export interface ShelfAlbum extends Album {
  rank: number;
  image: string;
}

// The four covers already staged in public/images/home/, keyed by title.
// content/collect/albums.json has no cover-art field, so this is a manual
// mapping rather than a generated one.
const COVERS: Record<string, string> = {
  "OK Computer": "/images/home/ok-computer.jpg",
  "154": "/images/home/154.jpg",
  "Things We Lost in the Fire": "/images/home/things-we-lost.jpg",
  Dummy: "/images/home/dummy.jpg",
};

/** Top-ranked albums that have a local cover image staged, for the homepage shelf. */
export function getAlbumShelf(): ShelfAlbum[] {
  const albums = (albumsJson as { top_albums: Album[] }).top_albums;
  return albums
    .map((album, i) => ({ ...album, rank: i + 1, image: COVERS[album.title] }))
    .filter((album): album is ShelfAlbum => Boolean(album.image));
}
