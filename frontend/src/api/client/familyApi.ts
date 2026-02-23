"use server";

import { client } from "@/lib/api";

export async function getGroupCrew() {
  const { data } = await client.GET("/api/group/crews");
  if (!data) {
    throw new Error("가족 정보를 가져오는데 실패했습니다.");
  }
  return data;
}

export async function participateGroup(inviteUrl: string) {
  const { data } = await client.POST("/api/group/participate", {
    body: { inviteUrl },
  });
  return data;
}
