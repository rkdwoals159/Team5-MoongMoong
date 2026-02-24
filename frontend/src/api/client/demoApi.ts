"use server";

import { client } from "@/api/lib/client";

export async function getDemoReport() {
  try {
    const { response } = await client.GET("/report");
    return response.status === 200 ? response.status.toString() : "";
  } catch {
    return "";
  }
}
