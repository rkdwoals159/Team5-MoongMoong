import { client } from "@/api/lib/client";
import type { PostAuthLoginResult } from "@/api/types/authApi.type";

export async function postAuthLogout(refreshToken: string): Promise<void> {
  await client.POST("/api/auth/logout", {
    params: {
      cookie: {
        refreshToken,
      },
    },
  });
}

export async function postAuthLogin(
  accessToken: string,
  inviteUrl: string | null,
): Promise<PostAuthLoginResult> {
  const body = inviteUrl ? { accessToken, inviteUrl } : { accessToken };
  const { data, response } = await client.POST("/api/auth/login", {
    body,
  });

  return { data, response };
}

export async function postAuthRefresh(
  accessToken: string,
  refreshToken: string,
): Promise<Response> {
  const { response } = await client.POST("/api/auth/refresh", {
    body: {
      accessToken,
      refreshToken,
    },
  });
  return response;
}

export async function postGroupParticipate(
  inviteUrl: string,
  authorization?: string,
): Promise<void> {
  await client.POST("/api/group/participate", {
    body: { inviteUrl },
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}
