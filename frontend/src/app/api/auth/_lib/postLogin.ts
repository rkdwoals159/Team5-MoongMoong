import type { PostLoginParams, PostLoginResult } from "@/app/api/auth/_types/postLogin";

import { AUTH_DEFAULT_RETURN_TO, ONBOARDING_RETURN_TO } from "@/app/api/auth/_constants";
import { client } from "@/lib/api";

function getAuthHeaders(authorization?: string) {
  return authorization ? { Authorization: authorization } : undefined;
}

export async function runPostLoginFlow({
  data,
  inviteUrl,
  returnTo,
  authorization,
}: PostLoginParams): Promise<PostLoginResult> {
  if (!data) {
    return { ok: false, reason: "login error: data is missing" };
  }
  const isNew = data.isNew === true;
  const isInvited = data.isInvited === true;
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

  if (isNew || !data.hasGroup) {
    return { ok: true, redirectTo: ONBOARDING_RETURN_TO };
  }

  return { ok: true, redirectTo: AUTH_DEFAULT_RETURN_TO };
}
