"use server";

import { client } from "@/lib/api";

export async function postSSEToken() {
  const { data, error } = await client.POST("/api/auth/sse-token");
  if (error || !data) {
    return null;
  }
  return data.connectionToken;
}
