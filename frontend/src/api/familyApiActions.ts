import { GroupParticipateResponse, ParticipateResult } from "./types/familyApi.type";

export async function participatePetGroup(inviteUrl: string): Promise<ParticipateResult> {
  const res = await fetch("/api/family/participate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteUrl }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { data: null, error: body.message ?? "오류가 발생했습니다." };
  }

  const data: GroupParticipateResponse = await res.json();
  return { data, error: null };
}
