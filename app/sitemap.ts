import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/writing";

const SITE_URL = "https://www.keithrobrien.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/writing", "/now", "/about"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));
  return [...staticRoutes, ...posts];
}
