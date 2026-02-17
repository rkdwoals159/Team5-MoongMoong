import type { NextRequest } from "next/server";
import {
  clearAuthCookies,
  extractBearerToken,
  getReturnTo,
  redirectToLogin,
  redirectWithAuthCookies,
  validateAccessToken,
} from "@/app/api/auth/_lib";
import { refreshTokens } from "@/app/api/auth/_lib/token";

export async function GET(request: NextRequest) {
  const returnTo = getReturnTo(request);
  const result = await refreshTokens(request);
  if (!result.ok || !result.headers) return result.response;

  // 토큰 유효성 단발성 검증 (validate x->refresh o -> validate x 무한 루프 방지)
  const accessToken = extractBearerToken(result.headers);
  const isValid = await validateAccessToken(accessToken);
  if (!isValid) {
    const response = redirectToLogin(request);
    clearAuthCookies(response);
    return response;
  }

  return redirectWithAuthCookies(request, returnTo, result.headers);
}
