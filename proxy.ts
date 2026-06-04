import { NextResponse, type NextRequest } from "next/server";
import { HIDDEN_GAME_ROUTES } from "./lib/hidden-game-routes";

const RESULT_QUERY_KEYS = new Set(["s"]);
const hiddenGameRoutes = new Set<string>(HIDDEN_GAME_ROUTES);

function normalizePathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

function isGeneratedResultPage(request: NextRequest) {
  return Array.from(RESULT_QUERY_KEYS).some((key) => request.nextUrl.searchParams.has(key));
}

function isShareAsset(pathname: string) {
  return pathname.includes("/share-card") || pathname.includes("/share-og");
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (hiddenGameRoutes.has(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (isGeneratedResultPage(request) || isShareAsset(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/games/:path*", "/tests/:path*"],
};
