import { NextResponse } from "next/server";

import { ACCESS_COOKIE, AUTH_REFRESH_PATH, REFRESH_COOKIE } from "@/app/api/auth/_constants";
import type { TokenPayload } from "@/app/api/auth/_types/cookies";

export function setAuthCookies(res: NextResponse, payload: TokenPayload) {
  const { accessToken, refreshToken, accessMaxAge, refreshMaxAge } = resolveTokens(payload);
  const IS_PRODUCTION = process.env.NODE_ENV === "production";

  if (accessToken) {
    res.cookies.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      path: "/",
      ...(accessMaxAge ? { maxAge: accessMaxAge } : {}),
    });
  }

  if (refreshToken) {
    res.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "strict",
      path: AUTH_REFRESH_PATH,
      ...(refreshMaxAge ? { maxAge: refreshMaxAge } : {}),
    });
  }
}

export function setAuthCookiesFromHeaders(res: NextResponse, headers: Headers) {
  const authorization = headers.get("authorization") ?? "";
  const bearerToken = authorization.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : "";
  const setCookie = headers.getSetCookie().join("; ") ?? "";
  const refreshToken = extractCookieValue(setCookie, "refreshToken");

  const accessMaxAge = Number(process.env.AUTH_ACCESS_MAX_AGE ?? "0");
  const refreshMaxAge = Number(process.env.AUTH_REFRESH_MAX_AGE ?? "0");

  setAuthCookies(res, {
    accessToken: bearerToken,
    refreshToken,
    expiresIn: accessMaxAge || undefined,
    refreshExpiresIn: refreshMaxAge || undefined,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: AUTH_REFRESH_PATH,
    maxAge: 0,
  });
}

function extractCookieValue(cookieHeader: string, key: string) {
  if (!cookieHeader) return "";
  const match = cookieHeader.match(new RegExp(`${key}=([^;]+)`));
  return match?.[1] ?? "";
}

function resolveTokens(payload: TokenPayload) {
  const accessToken = payload.accessToken ?? "";
  const refreshToken = payload.refreshToken ?? "";
  const accessMaxAge = payload.expiresIn ?? 0;
  const refreshMaxAge = payload.refreshExpiresIn ?? 0;

  return { accessToken, refreshToken, accessMaxAge, refreshMaxAge };
}
