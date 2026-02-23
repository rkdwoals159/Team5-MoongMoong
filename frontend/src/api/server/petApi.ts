import { client } from "@/lib/api";
import type { GetPetInfoResponse } from "../types/perInfoApi.type";
import type { PetCreateRequest, PetCreateResponse } from "@/api/types";
/**
 * 반려동물 정보 조회 API를 호출한다.
 * @returns 반려동물 정보
 */
export async function getPetInfo(): Promise<GetPetInfoResponse | null> {
  try {
    const { data } = await client.GET("/api/pet");
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * 반려동물 생성 API를 호출한다.
 * @param payload 반려동물 생성 요청 페이로드
 * @returns 반려동물 생성 응답
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
