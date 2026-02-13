import { client } from "@/lib/api";
import type { BankInfoResponse, CoinsResponse } from "@/api/types/savingApi.type";

// 서버 컴포넌트용 - client로 외부 API 직접 호출
export async function getBankInfoServer(): Promise<BankInfoResponse | null> {
  const { data, response, error } = await client.GET("/api/group/bank");
  if (response.status === 404) return null;
  if (error || !data) throw new Error("저금통 정보를 불러오는데 실패했습니다.");
  return data;
}

// 저금통 코인 내역 조회
export async function getBankCoins(): Promise<CoinsResponse> {
  const { data, error } = await client.GET("/api/group/bank/coins");

  if (error || !data) {
    throw new Error("저금 내역을 불러오는데 실패했습니다.");
  }

  return data;
}
