import { NextRequest } from "next/server";

import { AUTH_DEFAULT_RETURN_TO } from "@/app/api/auth/_constants";

export function getReturnTo(request: NextRequest) {
  const defaultReturnTo = process.env.AUTH_DEFAULT_RETURN_TO ?? AUTH_DEFAULT_RETURN_TO;
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? defaultReturnTo;
  if (returnTo.startsWith("/")) return returnTo;
  return defaultReturnTo;
}

export function getInviteUrl(request: NextRequest) {
  return request.nextUrl.searchParams.get("inviteUrl") ?? null;
}

export function encodeState(returnTo: string, inviteUrl: string | null) {
  return Buffer.from(JSON.stringify({ returnTo, inviteUrl }), "utf-8").toString("base64url");
}

export function decodeState(state: string | null) {
  if (!state) return null;
  try {
    const raw = Buffer.from(state, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw) as { returnTo?: string; inviteUrl?: string | null };
    return {
      returnTo: parsed.returnTo ?? null,
      inviteUrl: parsed.inviteUrl ?? null,
    };
  } catch {
    return null;
  }
}
