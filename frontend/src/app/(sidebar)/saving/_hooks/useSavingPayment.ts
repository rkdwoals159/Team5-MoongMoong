"use client";

import { useEffect } from "react";
import { ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import useTossPayments from "@/app/(sidebar)/saving/_hooks/useTossPayments";
import { getBankInfo } from "@/app/(sidebar)/saving/_api";
import type { BankInfoResponse } from "@/api/types/savingApi.type";
import type { UseSavingPaymentOptions } from "@/app/(sidebar)/saving/_types/saving";

export function useSavingPayment({ onSuccess, handleDrop }: UseSavingPaymentOptions) {
  const { status, setStatus } = useSavingStatus();
  const { showToast } = useToast();
  const { isReady, isLoading, error, clearError, requestPayment } = useTossPayments(ANONYMOUS);

  useEffect(() => {
    if (error) {
      showToast({ variant: "error", message: error.message });
      clearError();
    }
  }, [error, showToast, clearError]);

  const processPayment = async (amount: number) => {
    const response = await requestPayment(amount);

    if (!response) return false;

    let bankInfo: BankInfoResponse | null = null;
    try {
      bankInfo = await getBankInfo();
    } catch (error) {
      console.error(error);
      showToast({ variant: "error", message: "랭킹 정보를 불러오지 못했습니다." });
      return false;
    }

    showToast({ variant: "success", message: `${response.amount}원을 저금했습니다.` });

    handleDrop(response.name, response.amount, response.createdAt, status.target);
    setStatus((prev) => ({
      ...prev,
      current: prev.current + response.amount,
      rankings: bankInfo?.rankings || prev.rankings,
      coins: [
        ...prev.coins,
        { name: response.name, amount: response.amount, createdAt: response.createdAt },
      ],
    }));

    onSuccess();
    return true;
  };

  return { processPayment, isLoading, isReady };
}
