"use server";

import { client } from "@/api/lib/client";

export async function postSSEToken() {
  const { data } = await client.POST("/api/auth/sse-token");
  if (!data || typeof data.connectionToken !== "string" || data.connectionToken.length === 0) {
    throw new Error("SSE 토큰 발급 실패");
  }
  return data.connectionToken;
}
