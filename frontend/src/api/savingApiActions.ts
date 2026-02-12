"use server";

import { client } from "@/lib/api";
import type {
  BankCreateResponse,
  BankUpdateResponse,
  BankBreakResponse,
  ConfirmPaymentResponse,
  OrderIdResponse,
} from "@/api/types/savingApi.type";
// 저금통 생성
export async function createNewSaving(target: number): Promise<BankCreateResponse | null> {
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
export async function updateSavingTarget(target: number): Promise<BankUpdateResponse | null> {
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
export async function breakSaving(): Promise<BankBreakResponse | null> {
  const { data, error } = await client.DELETE("/api/group/bank");
  if (error || !data) {
    return null;
  }

  return data;
}

// 결제 ID 요청
export async function requestOrderId(amount: number): Promise<OrderIdResponse> {
  const { data, error } = await client.POST("/api/group/bank/coins", {
    body: {
      amount: amount,
    },
  });

  if (error || !data || !data.orderId || !data.amount) {
    throw new Error("결제 요청에 실패했습니다.");
  }
  return data as OrderIdResponse;
}

// 결제 확인
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<ConfirmPaymentResponse> {
  const { data, error } = await client.POST("/api/group/bank/coins/confirm", {
    body: {
      paymentKey: paymentKey,
      orderId: orderId,
      amount: amount,
    },
  });

  if (error || !data || data.amount !== amount || !data.coinId || !data.createdAt || !data.name) {
    throw new Error("결제 확인에 실패했습니다.");
  }
  return data as ConfirmPaymentResponse;
}

// 결제 실패 보고
export async function failPayment(code: string, orderId: string, message: string): Promise<void> {
  const { error } = await client.POST("/api/group/bank/coins/fail", {
    body: {
      orderId: orderId,
      code: code,
      message: message,
    },
  });

  if (error) {
    throw new Error("결제 처리에 실패했습니다.");
  }
}
