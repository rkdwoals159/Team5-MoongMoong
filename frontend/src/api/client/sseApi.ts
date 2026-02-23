"use server";

import { client } from "@/lib/api";

export async function postSSEToken() {
  try {
    const { data } = await client.POST("/api/auth/sse-token");
    if (!data || typeof data.connectionToken !== "string" || data.connectionToken.length === 0) {
      return null;
    }
    return data.connectionToken;
  } catch {
    return null;
  }
}
