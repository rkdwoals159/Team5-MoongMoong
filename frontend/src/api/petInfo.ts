import client from "@/lib/api";
import { components } from "@/types/schema";

export async function getPetInfo(): Promise<components["schemas"]["PetReadResponse"] | null> {
  const { data, error } = await client.GET("/api/pet");

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return null;
  }

  return data;
}
