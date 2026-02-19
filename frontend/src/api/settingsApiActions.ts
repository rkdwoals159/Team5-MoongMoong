import type {
  UpdateMemberNameResponse,
  PetUpdateRequest,
  PetUpdateResponse,
} from "@/api/types/settingsApi.type";

// 회원 닉네임 변경
export async function updateMemberName(
  memberName: string,
): Promise<UpdateMemberNameResponse | null> {
  const res = await fetch("/api/settings/member/name", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberName }),
  });
  if (!res.ok) return null;
  return res.json();
}

// 반려동물 정보 수정
export async function updatePetInfo(body: PetUpdateRequest): Promise<PetUpdateResponse | null> {
  const res = await fetch("/api/settings/pet", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json();
}
