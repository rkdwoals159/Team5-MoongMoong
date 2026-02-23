"use server";

import { client } from "@/lib/api";

export async function postSavingNudge(): Promise<void> {
  const { response } = await client.POST("/api/group/bank/nudge");

  if (!response.ok) {
    throw new Error("알림 재촉에 실패했어요. 잠시후 다시 시도해주세요.");
  }
}
