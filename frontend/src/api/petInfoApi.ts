import { client } from "@/lib/api";
import type { GetPetInfoResponse } from "./types/perInfoApi.type";

export async function getPetInfo(): Promise<GetPetInfoResponse | null> {
  const { data } = await client.GET("/api/pet");
  return data ?? null;
}
