import type { MetadataRoute } from "next";
import { GAMES, HOMEPAGE_HIDDEN_GAME_IDS } from "@/lib/games-home";
import { GUIDES } from "@/lib/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun";

const STATIC_ROUTES = [
  "/",
  "/tests",
  "/games",
  "/guides",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    }));
  const gameRoutes: MetadataRoute.Sitemap = GAMES.filter((game) => !HOMEPAGE_HIDDEN_GAME_IDS.has(game.id)).map((game) => ({
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
