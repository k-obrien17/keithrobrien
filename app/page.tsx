import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { IndexTable } from "@/components/index-table";
import { ProjectCard } from "@/components/project-card";
import { YearBrowser } from "@/components/year-browser";
import { projects } from "@/lib/projects";
import { getInProgressPlaylist, getYearData, getYears } from "@/lib/collect";
import { getFeaturedByline } from "@/lib/bylines";
import { getAlbumShelf } from "@/lib/albums";
import {
  getHome,
  getListening,
  getListeningChanges,
  getRecentlyShipped,
} from "@/lib/site-content";

const BUILDING_SLUGS = ["141-miles", "tew"];
const PROJECT_IMAGES: Record<string, { src: string; alt: string }> = {
  "141-miles": {
    src: "/images/home/141-miles.png",
    alt: "Screenshot of the 141 Miles homepage, a town-by-town Jersey Shore guide",
  },
  tew: {
    src: "/images/home/workflow-desk.png",
    alt: "Screenshot of Workflow Desk, the desktop tool for managing Total Emphasis client work",
  },
};

export default function Home() {
  const home = getHome();
  const byline = getFeaturedByline();
  const building = BUILDING_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug),
  ).filter((p): p is (typeof projects)[number] => Boolean(p));
  const shelf = getAlbumShelf();
  const years = getYears();
  const yearCounts = Object.fromEntries(
    years.map((year) => {
      const data = getYearData(year);
      return [year, {
        songs: data.music?.tracks.length ?? 0,
        films: data.film.length,
        shows: data.tv.length,
      }];
    }),
  );
  const inProgress = getInProgressPlaylist();
  const listening = getListening();
  const listeningChanges = getListeningChanges().slice(0, 4);
  const shipped = getRecentlyShipped();

  return (
    <>
      {/* Hero */}
      <Container className="pt-[88px] pb-[88px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_360px] md:gap-14 md:items-start">
          <h1 className="text-[46px] sm:text-[58px] md:text-[44px] leading-[1.05] font-medium tracking-[-0.02em] text-[var(--color-fg)]">
            Write things.
            <br />
            Build things.
            <br />
            <span className="text-[var(--color-accent)]">Notice things.</span>
          </h1>

          <div className="border-t-4 border-[var(--color-accent)] pt-6">
            <p className="text-[12.5px] text-[var(--color-muted)] tracking-[0.04em] mb-4">
              {`// ${home.name}`}
            </p>
            <p className="text-[13.5px] leading-[1.9] text-[var(--color-body)]">
              {home.introPrefix}
              <span className="text-[var(--color-accent)]">{home.introHighlight}</span>
              {home.introSuffix}
            </p>
            <p className="mt-[14px] text-[12.5px] leading-[1.85] text-[var(--color-muted)]">
              {home.secondary}
            </p>
          </div>
        </div>
      </Container>

      {/* Explore / facets */}
      <Section label="Explore">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          {home.facets.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              {...(f.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group block"
            >
              <h3 className="text-[14px] font-medium text-[var(--color-fg)] transition-opacity group-hover:opacity-55">
                {f.label}{" "}
                <span className="text-[var(--color-accent)]">&rarr;</span>
              </h3>
              <p className="mt-[8px] text-[12.5px] leading-[1.8] text-[var(--color-muted)]">
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 01 Writing */}
      <Section
        label={
          <>
            01
            <br />
            Writing
          </>
        }
      >
        {byline && (
          <div className="border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6">
            <p className="text-[11.5px] uppercase tracking-[0.08em] text-[var(--color-faint)] mb-3">
              {byline.publication_display} &middot;{" "}
              {new Date(byline.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
            <h3 className="text-[19px] leading-[1.35] font-medium text-[var(--color-fg)] max-w-[520px]">
              {byline.title}
            </h3>
            <a
              href={byline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 text-[12.5px] text-[var(--color-accent)] transition-opacity hover:opacity-55"
            >
              Read it &rarr;
            </a>
          </div>
        )}
        <Link
          href="/writing"
          className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
        >
          all writing &rarr;
        </Link>
      </Section>

      {/* 02 Building */}
      {building.length > 0 && (
        <Section
          label={
            <>
              02
              <br />
              Building
            </>
          }
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {building.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                image={PROJECT_IMAGES[project.slug]}
              />
            ))}
          </div>
          <Link
            href="/projects"
            className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
          >
            all projects &rarr;
          </Link>
        </Section>
      )}

      {/* 03 Keeping */}
      <Section
        label={
          <>
            03
            <br />
            Keeping
          </>
        }
      >
        {shelf.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {shelf.map((album) => (
              <div key={album.title}>
                <div className="relative aspect-square w-full overflow-hidden border border-[var(--color-border)]">
                  <Image
                    src={album.image}
                    alt={`${album.artist} — ${album.title} cover art`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                </div>
                <p className="mt-3 text-[12px] leading-[1.6]">
                  <span className="text-[var(--color-accent)]">
                    {String(album.rank).padStart(2, "0")}
                  </span>{" "}
                  <span className="text-[var(--color-fg)] font-medium">
                    {album.artist}
                  </span>
                  <br />
                  <span className="text-[var(--color-muted)]">{album.title}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
          <p className="text-[12.5px] text-[var(--color-muted)] mb-5">
            Music, film, and TV, ranked by year.
          </p>
          <YearBrowser years={years} counts={yearCounts} />
        </div>

        {inProgress && (
          <p className="mt-8 text-[12.5px] text-[var(--color-muted)]">
            The {inProgress.year} list is in progress &mdash;{" "}
            <a
              href={inProgress.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] transition-opacity hover:opacity-55"
            >
              follow along on Spotify &rarr;
            </a>
          </p>
        )}

        <Link
          href="/collect"
          className="inline-block mt-6 text-[12.5px] text-[var(--color-muted)] transition-opacity hover:opacity-55"
        >
          all years &rarr;
        </Link>
      </Section>

      {/* Theseus' Playlist */}
      {listening.playlistId && (
        <Section label="Theseus' Playlist">
          <p className="text-[12.5px] leading-[1.8] text-[var(--color-muted)] mb-6 max-w-[580px]">
            {listening.note}
          </p>

          {listeningChanges.length > 0 && (
            <ul className="flex flex-col gap-[10px]">
              {listeningChanges.map((change, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-[12.5px]"
                >
                  <span
                    className={
                      change.type === "added"
                        ? "text-[var(--color-accent)] w-3"
                        : "text-[var(--color-faint)] w-3"
                    }
                  >
                    {change.type === "added" ? "+" : "−"}
                  </span>
                  <span className="flex-1 text-[var(--color-muted)]">
                    {change.title} &middot; {change.artists}
                  </span>
                  <span className="text-[var(--color-faint)] w-[60px] text-right">
                    {new Date(change.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex gap-6 text-[12.5px]">
            <a
              href={`https://open.spotify.com/playlist/${listening.playlistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-muted)] transition-opacity hover:opacity-55"
            >
              open in Spotify &rarr;
            </a>
            <Link
              href="/collect/changelog"
              className="text-[var(--color-muted)] transition-opacity hover:opacity-55"
            >
              full changelog &rarr;
            </Link>
          </div>
        </Section>
      )}

      {/* Recently shipped */}
      {shipped.length > 0 && (
        <Section
          label={
            <>
              Recently
              <br />
              shipped
            </>
          }
        >
          <IndexTable
            columns={[
              { label: "#", className: "w-11", accent: true },
              { label: "SHIP", className: "flex-1 pr-4" },
              { label: "WHEN", className: "w-[110px] text-right" },
            ]}
            rows={shipped.map((item, i) => ({
              cells: [
                String(i + 1).padStart(2, "0"),
                <span key="t" className="flex flex-col gap-[6px]">
                  <span className="text-[var(--color-fg)] font-medium">
                    {item.name}
                  </span>
                  <span className="text-[12px] leading-[1.65] text-[var(--color-muted)]">
                    {item.what}
                  </span>
                </span>,
                item.date,
              ],
            }))}
          />
        </Section>
      )}
    </>
  );
}
