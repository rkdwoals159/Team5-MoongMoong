import { NextRequest, NextResponse } from "next/server";

import { AUTH_LOGIN_PATH } from "@/app/api/auth/_constants";

export function redirectToLogin(request: NextRequest, returnTo?: string | null) {
  const loginUrl = new URL(AUTH_LOGIN_PATH, request.url);
  if (returnTo) {
    loginUrl.searchParams.set("returnTo", returnTo);
  }
  return NextResponse.redirect(loginUrl);
}
