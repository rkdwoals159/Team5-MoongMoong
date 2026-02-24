"use server";

import { client } from "@/api/lib/client";
import type {
  UpdateMemberNameResponse,
  PetUpdateRequest,
  PetUpdateResponse,
} from "@/api/types/settingsApi.type";

// 회원 닉네임 변경
export async function updateMemberName(memberName: string): Promise<UpdateMemberNameResponse> {
  const { data } = await client.PATCH("/api/member/name", { body: { memberName } });
  return data as UpdateMemberNameResponse;
}

// 반려동물 정보 수정
export async function updatePetInfo(body: PetUpdateRequest): Promise<PetUpdateResponse> {
  const { data } = await client.PUT("/api/pet", { body });
  return data as PetUpdateResponse;
}
