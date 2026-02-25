import type { PostLoginParams, PostLoginResult } from "@/app/api/auth/_types/postLogin";

import { ONBOARDING_RETURN_TO } from "@/app/api/auth/_constants";
import { postGroupParticipate } from "@/api/server/authApi";
import { isApiHttpError } from "../../_utils/routeError";

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
  const hasGroup = data.hasGroup === true;

  //1. 신규회원 + 초대된상황(isNew === true && isInvited === true && hasGroup === false) -> participateGroup 후 온보딩 건너뛰고 대시보드로 이동
  if (isNew && isInvited && !hasGroup) {
    if (!inviteUrl) {
      return { ok: false, reason: "group participate error: inviteUrl is missing" };
    }
    await postGroupParticipate(inviteUrl, authorization);
    return { ok: true, redirectTo: returnTo };
  }

  //2. 신규회원 + 초대안된상황(isInvited === false && isNew === true && hasGroup === false) -> 온보딩 페이지로 이동
  if (isNew && !isInvited && !hasGroup) {
    return { ok: true, redirectTo: ONBOARDING_RETURN_TO };
  }

  //3. 기존회원 + 초대된상황(isInvited === true && isNew === false && hasGroup === true) -> participateGroup 후 온보딩 건너뛰고 대시보드로 이동
  // 그룹 여부 상관없음
  if (!isNew && isInvited) {
    if (!inviteUrl) {
      return { ok: false, reason: "group participate error: inviteUrl is missing" };
    }
    try {
      await postGroupParticipate(inviteUrl, authorization);
    } catch (error) {
      //그룹 내부에 인원이 1명이상일 경우 백엔드에서 400에러 응답
      if (isApiHttpError(error) && error.status === 400) {
        //그룹 참가하지않고 정상적으로 리다이렉트
        return { ok: true, redirectTo: returnTo };
      }
      return { ok: false, reason: "group participate error", detail: error };
    }
    return { ok: true, redirectTo: returnTo };
  }

  //4. 기존회원 + 초대안된상황(isInvited === false && isNew === false && hasGroup === true) -> 대시보드 페이지로 이동
  if (!isNew && !isInvited && hasGroup) {
    return { ok: true, redirectTo: returnTo };
  }

  //예외)5. 기존 회원 + 초대코드없음 +  아직 그룹이 없는경우(hasGroup === false) -> 온보딩 페이지로 이동
  if (!isNew && !isInvited && !hasGroup) {
    return { ok: true, redirectTo: ONBOARDING_RETURN_TO };
  }
  // 8가지 경우의 수 중, 신규회원인데 그룹있는경우는 일어날 수 없는 상황 -> unknown error
  return { ok: false, reason: "login error: unknown error" };
}
