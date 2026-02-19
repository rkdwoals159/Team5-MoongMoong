import { client } from "@/lib/api";
import type { PetCreateRequest, PetInfoResponse } from "@/api/types";

/**
 * 로그인 사용자의 반려동물 정보를 조회한다.
 */
export async function getPetInfo(): Promise<PetInfoResponse | null> {
  const { data, error } = await client.GET("/api/pet");

  if (error || !data) {
    console.error(error?.code, error?.message, error?.status);
    return null;
  }

  return data;
}

/**
 * 반려동물 생성 API를 호출한다.
 */
export async function postCreatePet(payload: PetCreateRequest) {
  const { data, error, response } = await client.POST("/api/pet", {
    body: payload,
  });
  return { data, error, response };
}
