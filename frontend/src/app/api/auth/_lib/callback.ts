import { NextRequest } from "next/server";

import { decodeState, getReturnTo } from "./state";
import { redirectToLogin } from "./redirect";
import { redirectWithAuthCookies } from "./response";
import { runPostLoginFlow } from "./postLogin";
import { postAuthLogin } from "@/api/server/authApi";
import { postGoogleAccessToken, getGoogleUserEmail, resolveCallbackEnv } from "./oauth";

function buildLoginFailureHandler(request: NextRequest, returnTo: string) {
  return (reason: string, detail?: unknown) => {
    if (detail === undefined) {
      console.error(reason);
    } else {
      console.error(reason, detail);
    }

    return redirectToLogin(request, returnTo);
  };
}

export async function handleAuthCallback(request: NextRequest) {
  const env = resolveCallbackEnv(request);
  if (!env.ok) return env.response;

  const url = new URL(request.url);
  const authCode = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const decoded = decodeState(state);
  // TODO(auth-security): OAuth 로그인 CSRF 방지를 위해 서버 발급 nonce(쿠키/세션)로 state 검증하기.
  const returnTo = decoded?.returnTo ?? getReturnTo(request);
  // TODO(auth-security): 리다이렉트 전 decoded returnTo를 다시 검증하고 내부 상대 경로만 허용하기.
  const inviteUrl = decoded?.inviteUrl ?? null;
  const failLogin = buildLoginFailureHandler(request, returnTo);

  if (!authCode) {
    return failLogin("auth code is missing");
  }

  const tokenResult = await postGoogleAccessToken(authCode, env.value);
  if (!tokenResult.ok) {
    return failLogin(tokenResult.reason, tokenResult.detail);
  }
  const accessToken = tokenResult.data.accessToken;

  const userInfoResult = await getGoogleUserEmail(accessToken);
  if (!userInfoResult.ok) {
    return failLogin(userInfoResult.reason, userInfoResult.detail);
  }

  try {
    const loginResult = await postAuthLogin(accessToken, inviteUrl);

    if (!loginResult.data) {
      return failLogin("backend login error: data is missing");
    }

    const postLoginResult = await runPostLoginFlow({
      data: loginResult.data,
      inviteUrl,
      returnTo,
      authorization: loginResult.response.headers.get("authorization") ?? undefined,
    });

    if (!postLoginResult.ok) {
      return failLogin(postLoginResult.reason, postLoginResult.detail);
    }

    return redirectWithAuthCookies(
      request,
      postLoginResult.redirectTo,
      loginResult.response.headers,
    );
  } catch (error) {
    return failLogin("backend login error", error);
  }
}
