import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_CALLBACK_PATH,
  GOOGLE_OAUTH_ACCESS_TYPE,
  GOOGLE_OAUTH_AUTHORIZE_URL,
  GOOGLE_OAUTH_PROMPT,
  GOOGLE_OAUTH_SCOPE,
} from "../../_constants";
import { encodeState, getInviteUrl, getReturnTo } from "@/app/api/auth/_lib";
import { requireEnv } from "@/app/api/auth/_utils";

export async function GET(request: NextRequest) {
  const clientEnv = requireEnv(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID is not configured");
  if (!clientEnv.ok) return clientEnv.response;

  const clientId = clientEnv.value;
  const redirectUri = `${request.nextUrl.origin}${AUTH_CALLBACK_PATH}`;
  const returnTo = getReturnTo(request);
  const inviteUrl = getInviteUrl(request);
  const state = encodeState(returnTo, inviteUrl);

  // TODO(auth-security): OAuth state를 서버 발급 nonce와 바인딩하고 callback에서 검증하기.
  const url = new URL(GOOGLE_OAUTH_AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_OAUTH_SCOPE);
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", GOOGLE_OAUTH_ACCESS_TYPE);
  url.searchParams.set("prompt", GOOGLE_OAUTH_PROMPT);

  return NextResponse.redirect(url.toString());
}
