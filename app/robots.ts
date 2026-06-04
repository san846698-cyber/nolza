import type { MetadataRoute } from "next";
import { HIDDEN_GAME_ROUTES } from "@/lib/hidden-game-routes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*/share-card*", "/*/share-og*", ...HIDDEN_GAME_ROUTES],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
