import { NextRequest, NextResponse } from "next/server";

import { client } from "@/lib/api";
import { authCookies, clearAuthCookies } from "@/app/api/auth/_lib";

export async function POST(request: NextRequest) {
  const baseUrl = process.env.BASE_API_URL;
  const response = NextResponse.json({ ok: true });
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;

  clearAuthCookies(response);

  if (baseUrl && refreshToken) {
    await client
      .POST("/api/auth/logout", {
        params: {
          cookie: {
            refreshToken: refreshToken,
          },
        },
      })
      .catch(() => null);
  }

  return response;
}
