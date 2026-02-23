"use server";

import { client } from "@/lib/api";
import type { ApiHttpError } from "@/lib/api/type";
import { getErrorMessage } from "@/lib/api/errorMessage";
import type { ParticipateGroupResult } from "@/app/(sidebar)/family/_types";

const isApiHttpError = (error: unknown): error is ApiHttpError => {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  );
};

export async function getGroupCrew() {
  const { data } = await client.GET("/api/group/crews");
  if (!data) {
    throw new Error("가족 정보를 가져오는데 실패했습니다.");
  }
  return data;
}

export async function participateGroup(
  inviteUrl: string,
): Promise<ParticipateGroupResult<unknown>> {
  try {
    const { data } = await client.POST("/api/group/participate", {
      body: { inviteUrl },
    });

    if (!data) {
      return { data: null, error: "가족 참여에 실패했습니다." };
    }

    return { data, error: null };
  } catch (error) {
    if (isApiHttpError(error) && error.status === 400) {
      return { data: null, error: error.message || "잘못된 요청입니다." };
    }

    return {
      data: null,
      error: getErrorMessage(error, "가족 참여에 실패했습니다."),
    };
  }
}
