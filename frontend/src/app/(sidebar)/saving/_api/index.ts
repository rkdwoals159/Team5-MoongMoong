import type { BankInfoResponse } from "@/api/types/savingApi.type";

// 클라이언트 컴포넌트용 - Route Handler 경유
export async function getBankInfo(): Promise<BankInfoResponse | null> {
  const res = await fetch("/api/saving/bank");
  if (!res.ok) throw new Error("저금통 정보를 불러오는데 실패했습니다.");
  return res.json();
}
