import type { PostLoginParams, PostLoginResult } from "@/app/api/auth/_types/postLogin";

import { AUTH_DEFAULT_RETURN_TO, ONBOARDING_RETURN_TO } from "@/app/api/auth/_constants";
import { postGroupParticipate } from "@/api/authBackendApi";

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

  if (isInvited) {
    if (!inviteUrl) {
      return { ok: false, reason: "group participate error: inviteUrl is missing" };
    }

    try {
      await postGroupParticipate(inviteUrl, authorization);
    } catch (error) {
      return { ok: false, reason: "group participate error", detail: error };
    }

    return { ok: true, redirectTo: returnTo };
  }

  if (isNew || !data.hasGroup) {
    return { ok: true, redirectTo: ONBOARDING_RETURN_TO };
  }

  return { ok: true, redirectTo: AUTH_DEFAULT_RETURN_TO };
}
