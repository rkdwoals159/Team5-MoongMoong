"use server";

import { client } from "@/lib/api";

export async function getGroupCrew() {
  const { data, error } = await client.GET("/api/group/crews");
  if (error || !data) {
    throw new Error("가족 정보를 가져오는데 실패했습니다.");
  }
  return data;
}

export async function participateGroup(inviteUrl: string) {
  const { data, error, response } = await client.POST("/api/group/participate", {
    body: { inviteUrl },
  });

  if (response.status === 400) {
    return { data: null, error: error?.message ?? "잘못된 요청입니다." };
  }

  if (error || !data) {
    return { data: null, error: "가족 참여에 실패했습니다." };
  }

  return { data, error: null };
}
