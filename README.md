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

## Public-Repo Notes

This repo contains the public site source only. Internal handoff notes, private strategy docs, vault paths, and unpublished planning material should stay out of the public tree.
