import { NextResponse, type NextRequest } from "next/server";

const RESULT_QUERY_KEYS = new Set(["s"]);

function isGeneratedResultPage(request: NextRequest) {
  return Array.from(RESULT_QUERY_KEYS).some((key) => request.nextUrl.searchParams.has(key));
}

function isShareAsset(pathname: string) {
  return pathname.includes("/share-card") || pathname.includes("/share-og");
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (isGeneratedResultPage(request) || isShareAsset(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/games/:path*", "/tests/:path*"],
};
