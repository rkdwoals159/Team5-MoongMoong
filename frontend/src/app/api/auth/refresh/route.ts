import type { NextRequest } from "next/server";
import { getReturnTo, redirectWithAuthCookies } from "@/app/api/auth/_lib";
import { refreshTokens } from "@/app/api/auth/_lib/refreshToken";

export async function GET(request: NextRequest) {
  const returnTo = getReturnTo(request);
  const result = await refreshTokens(request);
  if (!result.ok) return result.response;
  return redirectWithAuthCookies(request, returnTo, result.headers);
}
