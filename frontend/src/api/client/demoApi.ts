"use server";

import { client } from "@/lib/api";

export async function getDemoReport() {
  try {
    const { response } = await client.GET("/report");
    return response.status === 200 ? response.status.toString() : "";
  } catch {
    return "";
  }
}
