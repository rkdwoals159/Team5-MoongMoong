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

// 저금통 생성
export async function createNewSaving(
  target: number,
): Promise<components["schemas"]["BankCreateResponse"] | null> {
  const { data, error } = await client.POST("/api/group/bank", {
    body: {
      target: target,
    },
  });

  if (error || !data) {
    return null;
  }

  return data;
}

// 저금통 목표 금액 수정
export async function updateSavingTarget(
  target: number,
): Promise<components["schemas"]["BankUpdateResponse"] | null> {
  const { data, error } = await client.PATCH("/api/group/bank", {
    body: {
      target: target,
    },
  });

  if (error || !data) {
    return null;
  }

  return data;
}

// 저금통 깨기
export async function breakSaving(): Promise<components["schemas"]["BankBreakResponse"] | null> {
  const { data, error } = await client.DELETE("/api/group/bank");
  if (error || !data) {
    return null;
  }

  return data;
}

export async function saveCoin(
  amount: number,
): Promise<components["schemas"]["CoinCreateResponse"] | null> {
  const { data, error } = await client.POST("/api/group/bank/coins", {
    body: {
      amount: amount,
    },
  });

  if (error || !data) {
    return null;
  }

  return data;
}
