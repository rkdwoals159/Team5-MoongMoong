import { NextRequest } from "next/server";

import {
  AUTH_CALLBACK_PATH,
  GOOGLE_OAUTH_TOKEN_URL,
  GOOGLE_USER_INFO_URL,
} from "@/app/api/auth/_constants";
import type { CallbackEnv, GoogleCallResult } from "@/app/api/auth/_types/callback";
import { requireEnv } from "@/app/api/auth/_utils";

function readString(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object") return undefined;
  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

export function resolveGoogleRedirectUri(request: NextRequest) {
  const configuredUri = process.env.GOOGLE_REDIRECT_URL;
  if (!configuredUri) {
    return `${request.nextUrl.origin}${AUTH_CALLBACK_PATH}`;
  }

  try {
    return new URL(configuredUri, request.nextUrl.origin).toString();
  } catch {
    return `${request.nextUrl.origin}${AUTH_CALLBACK_PATH}`;
  }
}

export function resolveCallbackEnv(request: NextRequest) {
  const baseEnv = requireEnv(process.env.BASE_API_URL, "OAuth env is not configured");
  if (!baseEnv.ok) return baseEnv;

  const clientEnv = requireEnv(process.env.GOOGLE_CLIENT_ID, "OAuth env is not configured");
  if (!clientEnv.ok) return clientEnv;

  const secretEnv = requireEnv(process.env.GOOGLE_CLIENT_SECRET, "OAuth env is not configured");
  if (!secretEnv.ok) return secretEnv;

  return {
    ok: true as const,
    value: {
      clientId: clientEnv.value,
      clientSecret: secretEnv.value,
      redirectUri: resolveGoogleRedirectUri(request),
    } satisfies CallbackEnv,
  };
}

export async function requestGoogleAccessToken(
  authCode: string,
  env: CallbackEnv,
): Promise<GoogleCallResult<{ accessToken: string }>> {
  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: authCode,
      client_id: env.clientId,
      client_secret: env.clientSecret,
      redirect_uri: env.redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  const tokenPayload = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok) {
    return { ok: false, reason: "token error", detail: tokenPayload };
  }

  const accessToken = readString(tokenPayload, "access_token");
  if (!accessToken) {
    return { ok: false, reason: "access token error", detail: tokenPayload };
  }

  return { ok: true, data: { accessToken } };
}

export async function requestGoogleUserEmail(
  accessToken: string,
): Promise<GoogleCallResult<{ email: string }>> {
  const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userInfoResponse.ok) {
    return { ok: false, reason: "user info error", detail: userInfoResponse };
  }

  const userInfo = await userInfoResponse.json().catch(() => null);
  const email = readString(userInfo, "email");
  if (!email) {
    return { ok: false, reason: "email is not found", detail: userInfo };
  }

  return { ok: true, data: { email } };
}
