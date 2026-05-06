import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS, COOKIE_REFRESH, decodeJwt, isTokenExpired } from "@/lib/api/tokens";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get(COOKIE_ACCESS)?.value;
  const refreshToken = req.cookies.get(COOKIE_REFRESH)?.value;
  const payload = accessToken ? decodeJwt(accessToken) : null;
  const isAuthenticated = !!payload && !isTokenExpired(payload);
  const canRefreshSession = !!refreshToken;

  if (pathname.startsWith("/account")) {
    if (!isAuthenticated && !canRefreshSession) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (payload.role !== "admin" && payload.role !== "staff") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
