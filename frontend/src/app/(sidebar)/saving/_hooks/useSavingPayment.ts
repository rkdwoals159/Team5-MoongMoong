"use client";

import { useEffect } from "react";
import { ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import useTossPayments from "@/app/(sidebar)/saving/_hooks/useTossPayments";
import { getBank } from "@/api/client/savingApi";
import { API_ERROR_MESSAGES } from "@/api/constants";
import type { GetBankResponse } from "@/api/types/savingApi.type";
import type { UseSavingPaymentOptions } from "@/app/(sidebar)/saving/_types/saving";
import { executeWithToastError } from "@/api/lib/executeWithToastError";

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

    const bankInfo = await executeWithToastError<GetBankResponse | null>(() => getBank(), {
      showToast,
      fallbackMessage: API_ERROR_MESSAGES.BANK_INFO,
    });
    if (bankInfo === undefined) {
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
