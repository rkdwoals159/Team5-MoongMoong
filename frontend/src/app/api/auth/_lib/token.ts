import { authCookies, redirectToLogin } from "@/app/api/auth/_lib";
import { requireBaseUrl } from "@/app/api/auth/_utils";
import { client } from "@/lib/api";
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

  const refreshToken = request.cookies.get(authCookies.refresh)?.value;
  if (!refreshToken) {
    return { ok: false, response: redirectToLogin(request), reason: "refresh token is missing" };
  }

  const { response: refreshResponse } = await client.POST("/api/auth/refresh", {
    body: {
      refreshToken: refreshToken,
    },
  });

  if (!refreshResponse.ok) {
    return { ok: false, response: redirectToLogin(request), reason: "refresh token is invalid" };
  }

  return { ok: true, headers: refreshResponse.headers } as const;
}
