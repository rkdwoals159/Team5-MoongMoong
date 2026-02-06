"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button/Button";
import { formatAmountPlain } from "@/utils/amount";
import { AMOUNT_PRESETS } from "@/app/(sidebar)/saving/_constants";
import { SavingModalProps } from "@/app/(sidebar)/saving/_types";
import { updateRankings } from "@/app/(sidebar)/saving/_lib";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";
import useTossPayments from "@/app/(sidebar)/saving/_hooks/useTossPayments";
import cn from "@/utils/style";
import SavingConfirmDialog from "./SavingConfirmDialog";

export default function SavingModal({ open, onClose, handleDrop }: SavingModalProps) {
  const { status, setStatus } = useSavingStatus();
  const [showConfirm, setShowConfirm] = useState(false);
  const { value, numericValue, handleChange, reset, addAmount } = useAmountInput();
  const { showToast } = useToast();
  const { isReady, isLoading, error, clearError, requestPayment } = useTossPayments(ANONYMOUS);

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.message,
      });
      clearError();
    }
  }, [error, showToast, clearError]);

  if (!open) return null;

  const isValid = numericValue > 0;

  const handleSubmitClick = () => {
    if (!isValid || !isReady) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const response = await requestPayment(numericValue);

    if (!response) {
      return;
    }

    handleDrop(response.name, response.amount, response.createdAt, status.target);
    setStatus((prev) => ({
      ...prev,
      current: prev.current + numericValue,
      rankings: updateRankings(prev.rankings, response.name, numericValue),
    }));

    setShowConfirm(false);
    reset();
    onClose();
  };

  const handleCancel = () => {
    if (isLoading) return;
    setShowConfirm(false);
  };

  const handleOverlayClick = () => {
    if (isLoading) return;
    if (showConfirm) {
      setShowConfirm(false);
      return;
    }
    reset();
    onClose();
  };

  if (showConfirm) {
    return (
      <SavingConfirmDialog
        amount={numericValue}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onOverlayClick={handleOverlayClick}
        isLoading={isLoading}
      />
    );
  }

  return (
    <section className={overlayClasses}>
      <div className="absolute inset-0" onClick={handleOverlayClick} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="저금하기"
        className={contentClasses}
        tabIndex={-1}
      >
        <h2 className="typo-title-m-bold text-gray-800">저금하기</h2>

        <div className="mt-700 flex flex-col gap-300">
          <label htmlFor="saving-amount" className="typo-body-m-medium text-gray-500">
            저금할 금액
          </label>
          <div className={inputWrapperClasses}>
            <input
              id="saving-amount"
              type="text"
              inputMode="numeric"
              placeholder="금액을 입력해주세요"
              value={value ? formatAmountPlain(numericValue) : ""}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none typo-body-m-medium placeholder:text-gray-300"
              autoFocus
            />
            <span className="typo-body-m-medium text-gray-400">원</span>
          </div>

          <div className="flex gap-300">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addAmount(preset)}
                className={presetButtonClasses}
              >
                +{formatAmountPlain(preset)}원
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="large"
          fullWidth
          className="mt-700"
          isDisabled={!isValid || !isReady}
          onClick={handleSubmitClick}
        >
          {isReady ? "송금하기" : "결제 서비스를 이용할 수 없습니다."}
        </Button>
      </div>
    </section>
  );
}

const overlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(26,31,39,0.25)]";

const contentClasses = cn(
  "relative z-10 w-full max-w-[420px] rounded-500 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]",
  "px-700 pt-700 pb-700",
);

const inputWrapperClasses =
  "flex items-center gap-300 w-full h-12 px-500 rounded-250 border border-border-light bg-white-100 transition-colors focus-within:border-yellow-300";

const presetButtonClasses =
  "flex-1 py-250 rounded-250 border border-border-light bg-white-100 typo-body-s-medium text-gray-500 transition-colors hover:bg-yellow-50 hover:border-yellow-300 cursor-pointer";
