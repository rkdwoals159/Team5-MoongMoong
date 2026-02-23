import { NextRequest, NextResponse, userAgent } from "next/server";
import {
  ACCESS_COOKIE,
  AUTH_LOGIN_PATH,
  AUTH_REFRESH_PATH,
  PROXY_TOKEN_EXPIRY_SKEW_SECONDS,
} from "./app/api/auth/_constants";
import { validateAccessToken } from "./app/api/auth/_lib";

const BLOCKED_DEVICE_TYPES = new Set(["mobile", "tablet"]);
const PUBLIC_PATHS = new Set([AUTH_LOGIN_PATH, "/unsupported-device"]);
const BOT_USER_AGENT_PATTERN =
  /(bot|crawler|spider|slurp|preview|facebookexternalhit|facebot|twitterbot|slackbot|discordbot|linkedinbot|telegrambot|whatsapp|kakao.*(?:bot|preview|scrap)|naverbot|daumoa)/i;

export async function proxy(request: NextRequest) {
  if (process.env.LHCI === "true") {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (shouldBlockMobileRequest(request) && pathname !== "/unsupported-device") {
    return redirectToUnsupportedDevice(request);
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const returnTo = `${pathname}${search}`;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request, returnTo);
  }

  // 토큰 만료 시간 검증 로직
  const freshness = isTokenFresh(token);
  if (freshness === true) {
    return NextResponse.next();
  }

  const isValid = await validateAccessToken(token);
  if (isValid) {
    return NextResponse.next();
  }
  return redirectToRefresh(request, returnTo);
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api/auth|assets|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "next-router-segment-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
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
 * 모바일/태블릿 기기 차단 여부 확인
 */
function shouldBlockMobileRequest(request: NextRequest) {
  const { device, ua } = userAgent(request);
  const isBlockedDevice = BLOCKED_DEVICE_TYPES.has(device.type ?? "");
  const isAllowedBot = BOT_USER_AGENT_PATTERN.test(ua ?? "");
  return isBlockedDevice && !isAllowedBot;
}

/**
 * 모바일 접속 차단 안내 페이지로 리다이렉트
 */
function redirectToUnsupportedDevice(request: NextRequest) {
  const unsupportedUrl = request.nextUrl.clone();
  const from = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  unsupportedUrl.pathname = "/unsupported-device";
  unsupportedUrl.search = "";
  unsupportedUrl.searchParams.set("from", from);
  return NextResponse.redirect(unsupportedUrl);
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
