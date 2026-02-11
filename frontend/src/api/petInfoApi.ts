import { client } from "@/lib/api";
import type { PetInfoResponse } from "./types/perInfoApi.type";
export async function getPetInfo(): Promise<PetInfoResponse | null> {
  const { data, error } = await client.GET("/api/pet");

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return null;
  }

  return data;
}
