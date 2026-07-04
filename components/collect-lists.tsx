import type { Film, Track, Book } from "@/lib/collect";

/** Muted meta cell, right-aligned on wide screens (score, album, etc.). */
function Meta({
  children,
  italic = false,
}: {
  children: React.ReactNode;
  italic?: boolean;
}) {
  return (
    <span
      className={`text-[12px] text-[var(--color-muted)] mt-1 sm:mt-0 sm:text-right tabular-nums ${
        italic ? "italic" : "whitespace-nowrap"
      }`}
    >
      {children}
    </span>
  );
}

function Row({
  rank,
  children,
}: {
  rank: number;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b border-[var(--color-border)] pb-3 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
        <span className="text-[12px] text-[var(--color-muted)] tabular-nums w-6 shrink-0">
          {rank}
        </span>
        {children}
      </div>
    </li>
  );
}

export function MusicList({ tracks }: { tracks: Track[] }) {
  return (
    <ol className="space-y-3">
      {tracks.map((t, i) => (
        <Row key={i} rank={i + 1}>
          <span className="flex-1">
            <span className="text-[14px] text-[var(--color-fg)]">{t.track}</span>
            <span className="text-[14px] text-[var(--color-muted)]"> · {t.artist}</span>
          </span>
          <Meta italic>
            <span className="sm:max-w-[220px] inline-block">{t.album}</span>
          </Meta>
        </Row>
      ))}
    </ol>
  );
}

export function FilmList({ films }: { films: Film[] }) {
  return (
    <ol className="space-y-3">
      {films.map((f, i) => {
        const label = (
          <>
            {f.title}
            {f.year ? (
              <span className="text-[var(--color-muted)]"> ({f.year})</span>
            ) : null}
          </>
        );
        return (
          <Row key={i} rank={i + 1}>
            <span className="flex-1">
              {f.tmdb_url ? (
                <a
                  href={f.tmdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {label}
                </a>
              ) : (
                <span className="text-[14px] text-[var(--color-fg)]">{label}</span>
              )}
            </span>
            <Meta>{f.score.toFixed(1)}</Meta>
          </Row>
        );
      })}
    </ol>
  );
}

export function BookList({ books }: { books: Book[] }) {
  return (
    <ol className="space-y-3">
      {books.map((b, i) => (
        <Row key={i} rank={i + 1}>
          <span className="flex-1">
            {b.link ? (
              <a
                href={b.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
              >
                {b.title}
              </a>
            ) : (
              <span className="text-[14px] text-[var(--color-fg)]">{b.title}</span>
            )}
            <span className="text-[14px] text-[var(--color-muted)]"> · {b.author}</span>
          </span>
          {b.note ? <Meta italic>{b.note}</Meta> : null}
        </Row>
      ))}
    </ol>
  );
}

export function SpotifyLink({ url }: { url: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-[var(--color-accent)] hover:underline underline-offset-4"
    >
      Listen on Spotify →
    </a>
  );
}

export function ComingSoon({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[var(--color-muted)]">
      {children ?? "Coming soon."}
    </p>
  );
}
