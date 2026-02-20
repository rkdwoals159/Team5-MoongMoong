"use server";

import { client } from "@/lib/api";

export async function getDemoReport() {
  const { response, error } = await client.GET("/report");

  if (response.status === 200) {
    return response.status.toString();
  }

  if (error) console.error(error);

  return "";
}
