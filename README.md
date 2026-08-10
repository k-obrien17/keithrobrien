# keithrobrien.com

Personal site for Keith O'Brien: a static-first hub for bylines, personal writing, side projects, and public profile context.

Live site: [keithrobrien.com](https://www.keithrobrien.com)

## What This Shows

- A public bylines archive with 400+ published pieces.
- A personal hub that connects writing, software projects, newsletters, and professional background.
- A static content model using checked-in JSON and MDX rather than a database or CMS.
- SEO/AI-discovery surfaces including sitemap, robots, RSS, Open Graph images, `llms.txt`, and `llms-full.txt`.
- A restrained design system adapted from the Total Emphasis visual language.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- MDX via `next-mdx-remote`
- Vercel

## Content Model

The site intentionally avoids a backend. Content lives in the repo:

- `content/site/*.json` for home/about/project copy
- `content/writing/*.mdx` for essays
- `content/bylines-archive.json` for the bylines archive
- `content/collect/*.json` for media and collection pages

## Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
app/          Next.js routes, metadata, feeds, and generated text surfaces
components/   shared layout and display components
content/      site copy, writing, bylines, and collection data
lib/          typed content loaders and helpers
public/       static assets and AI-readable files
```

## Collect Changelog Pipeline

`/collect/changelog` is generated from three scheduled GitHub Actions workflows, each running a script under `scripts/` and committing its output back to `main`:

| Workflow | Script | Trigger | What it does |
|---|---|---|---|
| `.github/workflows/playlist-snapshot.yml` | `scripts/snapshot-playlist.mjs` | cron, Mon/Thu 12:00 UTC | Snapshots Theseus' Playlist and every Best-of-YYYY playlist via the Spotify API, diffs against the last snapshot, appends added/removed entries to `content/site/listening-log.json` and `content/collect/best-of-changelog.json` |
| `.github/workflows/watching-changelog.yml` | `scripts/diff-ranked-list.mjs` | push to `content/collect/watching.json` or `watching-annual.json` | Diffs the new commit against the previous one to derive rank changes, entries/exits, and watched entries into `content/collect/watching-changelog.json` |
| `.github/workflows/changelog-digest.yml` | `scripts/changelog-digest.mjs` | cron, daily 12:00 UTC | Emails a summary of everything new across both changelog feeds since the last run (via Resend), tracked with a high-water mark in `content/collect/digest-state.json` |

All three share a `collect-changelog-commit` concurrency group (they all commit to `main`) and ping a dedicated healthchecks.io check on success/failure.

### Minting a Spotify refresh token

The playlist snapshot script needs `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN` as GitHub Actions secrets. To mint a refresh token locally:

1. Register `http://127.0.0.1:8888/callback` as a Redirect URI on the app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. `SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/mint-spotify-refresh-token.mjs`
3. Open the printed URL, log in, approve access. The refresh token prints to the terminal (the local listener times out after 5 minutes if nothing comes back).
4. Add it as the `SPOTIFY_REFRESH_TOKEN` secret, then clear it from shell history.

## Public-Repo Notes

This repo contains the public site source only. Internal handoff notes, private strategy docs, vault paths, and unpublished planning material should stay out of the public tree.
