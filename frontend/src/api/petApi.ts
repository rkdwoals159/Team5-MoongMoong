import { client } from "@/lib/api";
import type { PetCreateRequest, PetCreateResponse, PetInfoResponse } from "@/api/types";

/**
 * 로그인 사용자의 반려동물 정보를 조회한다.
 */
export async function getPetInfo(): Promise<PetInfoResponse | null> {
  try {
    const { data } = await client.GET("/api/pet");
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * 반려동물 생성 API를 호출한다.
 */
export async function postCreatePet(payload: PetCreateRequest): Promise<PetCreateResponse> {
  const { data } = await client.POST("/api/pet", {
    body: payload,
  });
  if (!data) {
    throw new Error("반려동물 정보를 저장하지 못했어요.");
  }
  return data;
}
