"use server";
import client from "@/lib/api";
import { components } from "@/types/schema";
// 저금통 정보 조회
export async function getBankInfo(): Promise<components["schemas"]["BankInfoResponse"] | null> {
  const { data, response, error } = await client.GET("/api/group/bank");

  if (response.status === 404) {
    return null;
  }

  if (error) {
    throw new Error("저금통 정보를 불러오는데 실패했습니다.");
  }

  return data;
}

// 저금통 코인 내역 조회
export async function getBankCoins(): Promise<components["schemas"]["CoinsResponse"] | null> {
  const { data, error } = await client.GET("/api/group/bank/coins");

  if (error || !data) {
    return null;
  }

  return data as components["schemas"]["CoinsResponse"];
}
