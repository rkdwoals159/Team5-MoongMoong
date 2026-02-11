import type {
  AuthLoginResponse,
  PetCreateRequest,
  PostLoginParams,
  PostLoginResult,
} from "@/app/api/auth/_types/postLogin";

import { AUTH_DEFAULT_RETURN_TO } from "@/app/api/auth/_constants";
import { client } from "@/lib/api";

function getAuthHeaders(authorization?: string) {
  return authorization ? { Authorization: authorization } : undefined;
}

function getPetCreateBody(data: AuthLoginResponse | undefined): PetCreateRequest {
  return {
    petName: data?.petName ?? undefined,
    breed: data?.breed ?? undefined,
    gender: data?.gender ?? undefined,
    birthDate: data?.birthDate ?? undefined,
  };
}

export async function runPostLoginFlow({
  data,
  inviteUrl,
  returnTo,
  authorization,
}: PostLoginParams): Promise<PostLoginResult> {
  const isNew = data?.isNew === true;
  const isInvited = data?.isInvited === true;
  const headers = getAuthHeaders(authorization);

  if (isInvited) {
    if (!inviteUrl) {
      return { ok: false, reason: "group participate error: inviteUrl is missing" };
    }

    const { error, response } = await client.POST("/api/group/participate", {
      body: { inviteUrl },
      headers,
    });

    if (error || !response.ok) {
      return { ok: false, reason: "group participate error", detail: error ?? response };
    }

    return { ok: true, redirectTo: returnTo };
  }

  if (isNew) {
    const { error, response } = await client.POST("/api/pet", {
      body: getPetCreateBody(data),
      headers,
    });

    if (error || !response.ok) {
      return { ok: false, reason: "pet create error", detail: error ?? response };
    }

    return { ok: true, redirectTo: returnTo };
  }

  return { ok: true, redirectTo: AUTH_DEFAULT_RETURN_TO };
}
