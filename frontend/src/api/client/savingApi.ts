"use server";
import { client } from "@/lib/api";
import type {
  GetBankResponse,
  GetBankCoinsResponse,
  PostBankResponse,
  PatchBankResponse,
  DeleteBankResponse,
  PostCoinOrderResponse,
  PostCoinPaymentConfirmResponse,
} from "@/api/types/savingApi.type";
import { isApiHttpError } from "@/api/utils/isApiHttpError";

export async function getBank(): Promise<GetBankResponse | null> {
  try {
    const { data } = await client.GET("/api/group/bank", {} as never);
    return data ?? null;
  } catch (error) {
    if (isApiHttpError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getBankCoins(): Promise<GetBankCoinsResponse> {
  const { data } = await client.GET("/api/group/bank/coins");
  return data ?? {};
}

export async function postBank(target: number): Promise<PostBankResponse> {
  const { data } = await client.POST("/api/group/bank", {
    body: { target },
  });
  return data as PostBankResponse;
}

export async function patchBank(target: number): Promise<PatchBankResponse> {
  const { data } = await client.PATCH("/api/group/bank", {
    body: { target },
  });
  return data as PatchBankResponse;
}

export async function deleteBank(): Promise<DeleteBankResponse> {
  const { data } = await client.DELETE("/api/group/bank");
  return data as DeleteBankResponse;
}

export async function postCoinOrderId(amount: number): Promise<PostCoinOrderResponse> {
  const { data } = await client.POST("/api/group/bank/coins", {
    body: { amount },
  } as never);
  if (!data) {
    throw new Error("결제 주문 응답이 없습니다.");
  }
  return data;
}

export async function postCoinPaymentConfirm(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<PostCoinPaymentConfirmResponse> {
  const { data } = await client.POST("/api/group/bank/coins/confirm", {
    body: { paymentKey, orderId, amount },
  });
  return data as PostCoinPaymentConfirmResponse;
}

export async function postCoinFailure(
  code: string,
  orderId: string,
  message: string,
): Promise<void> {
  await client.POST("/api/group/bank/coins/fail", {
    body: { code, orderId, message },
  });
}
