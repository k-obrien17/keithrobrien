import type { Film } from "@/lib/collect";
import type { AlbumOfYear } from "@/lib/album-of-year";

// Compact lede for /collect/[year]: Album/Film of the year are real data;
// Show/Song stay TBD until TV rankings and a music-ranking pass exist.
function Tile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--color-border)] p-5">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-faint)] mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function Tbd() {
  return <p className="text-[13px] text-[var(--color-muted)]">TBD</p>;
}

export function YearHighlights({
  album,
  film,
}: {
  album: AlbumOfYear | null;
  film: Film | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Tile label="Album">
        {album ? (
          <a
            href={album.mb_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-[var(--color-accent)] transition-colors"
          >
            <span className="block text-[14px] font-medium text-[var(--color-fg)]">
              {album.title}
            </span>
            <span className="block mt-1 text-[12.5px] text-[var(--color-muted)]">
              {album.artist} &middot; {album.score.toFixed(1)}
            </span>
          </a>
        ) : (
          <Tbd />
        )}
      </Tile>

      <Tile label="Film">
        {film ? (
          film.tmdb_url ? (
            <a
              href={film.tmdb_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-[var(--color-accent)] transition-colors"
            >
              <span className="block text-[14px] font-medium text-[var(--color-fg)]">
                {film.title}
              </span>
              <span className="block mt-1 text-[12.5px] text-[var(--color-muted)]">
                {film.score.toFixed(1)}
              </span>
            </a>
          ) : (
            <div>
              <span className="block text-[14px] font-medium text-[var(--color-fg)]">
                {film.title}
              </span>
              <span className="block mt-1 text-[12.5px] text-[var(--color-muted)]">
                {film.score.toFixed(1)}
              </span>
            </div>
          )
        ) : (
          <Tbd />
        )}
      </Tile>

      <Tile label="Show">
        <Tbd />
      </Tile>

      <Tile label="Song">
        <Tbd />
      </Tile>
    </div>
  );
}
