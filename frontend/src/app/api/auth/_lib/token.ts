import { authCookies, redirectToLogin } from "@/app/api/auth/_lib";
import { requireBaseUrl } from "@/app/api/auth/_utils";
import { postAuthRefresh } from "@/api/server/authApi";
import type { NextRequest } from "next/server";

export function extractBearerToken(headers: Headers) {
  const authorization = headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return "";
  return authorization.slice("Bearer ".length);
}

export async function validateAccessToken(token: string): Promise<boolean> {
  if (!token) return false;

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

export async function refreshTokens(request: NextRequest) {
  const baseEnv = requireBaseUrl();
  if (!baseEnv.ok) {
    return { ok: false, response: baseEnv.response } as const;
  }
  const accessToken = request.cookies.get(authCookies.access)?.value;
  if (!accessToken) {
    return { ok: false, response: redirectToLogin(request), reason: "access token is missing" };
  }
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;
  if (!refreshToken) {
    return { ok: false, response: redirectToLogin(request), reason: "refresh token is missing" };
  }

  try {
    const refreshResponse = await postAuthRefresh(accessToken, refreshToken);
    return { ok: true, headers: refreshResponse.headers } as const;
  } catch {
    return { ok: false, response: redirectToLogin(request), reason: "refresh token is invalid" };
  }
}
