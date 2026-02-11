import { authCookies, redirectToLogin } from "@/app/api/auth/_lib";
import { requireBaseUrl } from "@/app/api/auth/_utils";
import { client } from "@/lib/api";
import type { NextRequest } from "next/server";

export async function refreshTokens(request: NextRequest) {
  const baseEnv = requireBaseUrl();
  if (!baseEnv.ok) {
    return { ok: false, response: baseEnv.response } as const;
  }

  const refreshToken = request.cookies.get(authCookies.refresh)?.value;
  if (!refreshToken) {
    return { ok: false, response: redirectToLogin(request) };
  }

  const { response: refreshResponse } = await client.POST("/api/auth/refresh", {
    body: {
      refreshToken: refreshToken,
    },
  });

  if (!refreshResponse.ok) {
    return { ok: false, response: redirectToLogin(request) };
  }

  return { ok: true, headers: refreshResponse.headers } as const;
}
