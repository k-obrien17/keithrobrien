import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/writing";
import { getYears, getMusicYears, getFilmYears } from "@/lib/collect";

const SITE_URL = "https://www.keithrobrien.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const collectRoutes = [
    "/collect",
    "/collect/watching",
    "/collect/music",
    "/collect/reading",
    ...getYears().map((y) => `/collect/${y}`),
    ...getMusicYears().map((y) => `/collect/music/${y}`),
    ...getFilmYears().map((y) => `/collect/watching/${y}`),
  ];
  const routes = [
    "",
    "/projects",
    "/writing",
    ...collectRoutes,
    "/about",
    "/about/keith-obrien",
    "/bylines",
  ];
  const staticRoutes = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));
  return [...staticRoutes, ...posts];
}
