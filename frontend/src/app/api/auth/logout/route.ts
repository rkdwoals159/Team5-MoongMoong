import { NextRequest, NextResponse } from "next/server";

import { authCookies, clearAuthCookies } from "@/app/api/auth/_lib";
import { postAuthLogout } from "@/api/server/authApi";

export async function POST(request: NextRequest) {
  const baseUrl = process.env.BASE_API_URL;
  const response = NextResponse.json({ ok: true });
  const refreshToken = request.cookies.get(authCookies.refresh)?.value;

  clearAuthCookies(response);

  if (baseUrl && refreshToken) {
    await postAuthLogout(refreshToken).catch(() => null);
  }

  return response;
}
