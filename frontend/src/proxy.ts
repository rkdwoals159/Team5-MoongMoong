import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  AUTH_LOGIN_PATH,
  AUTH_REFRESH_PATH,
  PROXY_TOKEN_EXPIRY_SKEW_SECONDS,
} from "./app/api/auth/_constants";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const returnTo = `${pathname}${search}`;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request, returnTo);
  }

  // 토큰 만료 시간 검증 로직 -> 백엔드 서버 안정화 이후 사용
  // const freshness = isTokenFresh(token);
  // if (freshness === true) {
  //   return NextResponse.next();
  // }

  const isValid = await validateAccessToken(token);
  if (isValid) {
    return NextResponse.next();
  }

  return redirectToRefresh(request, returnTo);
}

export const config = {
  matcher: [
    "/((?!api/auth|login|assets|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*).*)",
  ],
};

// -------------------내장 함수---------------------------

/**
 * 로그인 페이지로 리다이렉트
 * @param request - NextRequest
 * @param returnTo - 리다이렉트할 페이지
 * @returns NextResponse
 */
function redirectToLogin(request: NextRequest, returnTo: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = AUTH_LOGIN_PATH;
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

/**
 * 리프레시 API ROUTE로 리다이렉트
 * @param request - NextRequest
 * @param returnTo - 리다이렉트할 URL
 * @returns NextResponse
 */
function redirectToRefresh(request: NextRequest, returnTo: string) {
  const refreshUrl = request.nextUrl.clone();
  refreshUrl.pathname = AUTH_REFRESH_PATH;
  refreshUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(refreshUrl);
}

/**
 * JWT 토큰의 만료 시간 파싱
 * @param token - JWT 토큰
 * @returns 만료 시간 (Unix timestamp)
 */
function parseJwtExp(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
}

function isTokenFresh(token: string): boolean | null {
  const exp = parseJwtExp(token);
  if (!exp) return null;

  const now = Math.floor(Date.now() / 1000);
  return exp - now > PROXY_TOKEN_EXPIRY_SKEW_SECONDS;
}

/**
 * 액세스 토큰 검증
 * @param token - 액세스 토큰
 * @returns 검증 결과
 */
async function validateAccessToken(token: string): Promise<boolean> {
  const baseUrl = process.env.BASE_API_URL;
  if (!baseUrl) return false;

  try {
    const response = await fetch(new URL("/api/auth/validate", baseUrl), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
