import type {
  LoginWithGoogleAccessTokenResponse,
  LogoutAuthResponse,
  ParticipateGroupResponse,
  RefreshAuthTokenResponse,
} from "@/api/types";
import { client } from "@/lib/api";

/**
 * 구글 OAuth access token으로 백엔드 로그인 API를 호출한다.
 */
export async function loginWithGoogleAccessToken(
  accessToken: string,
  inviteUrl?: string,
): Promise<LoginWithGoogleAccessTokenResponse> {
  return client.POST("/api/auth/login", {
    body: { accessToken, inviteUrl },
  });
}

/**
 * 초대 URL을 이용해 그룹 참여 API를 호출한다.
 */
export async function participateGroup(
  inviteUrl: string,
  authorization?: string,
): Promise<ParticipateGroupResponse> {
  return client.POST("/api/group/participate", {
    body: { inviteUrl },
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}

/**
 * refresh token으로 액세스 토큰 재발급 API를 호출한다.
 */
export async function refreshAuthToken(
  accessToken: string,
  refreshToken: string,
): Promise<RefreshAuthTokenResponse> {
  return client.POST("/api/auth/refresh", {
    body: { accessToken, refreshToken },
  });
}

/**
 * refresh token을 무효화하는 로그아웃 API를 호출한다.
 */
export async function logoutAuth(refreshToken: string): Promise<LogoutAuthResponse> {
  return client.POST("/api/auth/logout", {
    params: {
      cookie: {
        refreshToken,
      },
    },
  });
}
