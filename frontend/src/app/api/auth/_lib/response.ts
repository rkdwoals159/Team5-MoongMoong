import { NextRequest, NextResponse } from "next/server";

import { setAuthCookiesFromHeaders } from "./cookies";

export function jsonWithAuthCookies(
  body: unknown,
  headers?: Headers,
  init?: Parameters<typeof NextResponse.json>[1],
) {
  const response = NextResponse.json(body, init);
  if (headers) {
    setAuthCookiesFromHeaders(response, headers);
  }
  return response;
}

export function redirectWithAuthCookies(request: NextRequest, returnTo: string, headers?: Headers) {
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  if (headers) {
    setAuthCookiesFromHeaders(response, headers);
  }
  return response;
}
