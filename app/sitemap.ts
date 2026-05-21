import type { MetadataRoute } from "next";
import { GAMES } from "@/lib/games-home";
import { GUIDES } from "@/lib/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun";

const STATIC_ROUTES = ["/", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    }));
  const gameRoutes: MetadataRoute.Sitemap = GAMES.map((game) => ({
      url: `${SITE_URL}${game.href}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: game.category === "featured" ? 0.9 : 0.8,
    }));
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
      url: `${SITE_URL}${guide.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...gameRoutes, ...guideRoutes];
}
