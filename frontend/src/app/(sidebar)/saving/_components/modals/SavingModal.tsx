"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";
import ClientModal from "@/components/ui/Modal/ClientModal";
import AmountInput from "@/components/common/Input/AmountInput";
import { SAVING_AMOUNT_RESTRAINTS } from "@/app/(sidebar)/saving/_constants";
import type { SavingModalProps } from "@/app/(sidebar)/saving/_types";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";
import { useSavingPayment } from "@/app/(sidebar)/saving/_hooks/useSavingPayment";
import SavingConfirmDialog from "./SavingConfirmDialog";
import AmountPresetButtons from "./AmountPresetButtons";

export default function SavingModal({ open, onClose, handleDrop }: SavingModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    value,
    numericValue,
    warningMessage,
    isShaking,
    stopShaking,
    handleChange,
    reset,
    addAmount,
  } = useAmountInput({
    min: SAVING_AMOUNT_RESTRAINTS.MIN,
    minWarningMessage: SAVING_AMOUNT_RESTRAINTS.MIN_WARNING,
    max: SAVING_AMOUNT_RESTRAINTS.MAX,
    maxWarningMessage: SAVING_AMOUNT_RESTRAINTS.MAX_WARNING,
  });

  const { processPayment, isLoading, isReady } = useSavingPayment({
    onSuccess: () => {
      setShowConfirm(false);
      reset();
      onClose();
    },
    handleDrop,
  });

  const isValid = numericValue > 0 && !warningMessage;

  const handleSubmitClick = () => {
    if (!isValid || !isReady) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const success = await processPayment(numericValue);
    if (!success) setShowConfirm(false);
  };

  const handleCancel = () => {
    if (isLoading) return;
    setShowConfirm(false);
  };

  const handleOverlayClose = () => {
    if (isLoading) return;
    if (showConfirm) {
      setShowConfirm(false);
      return;
    }
    reset();
    onClose();
  };

  return (
    <ClientModal
      open={open}
      onClose={handleOverlayClose}
      ariaLabel={showConfirm ? "저금 확인" : "저금하기"}
      contentClassName={
        showConfirm ? "max-w-[360px] px-700 pt-900 pb-700" : "max-w-[420px] px-700 pt-700 pb-700"
      }
    >
      {showConfirm ? (
        <SavingConfirmDialog
          amount={numericValue}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      ) : (
        <>
          <h2 className="typo-title-m-bold text-gray-800">저금하기</h2>

          <div className="mt-700 flex flex-col gap-300">
            <label htmlFor="saving-amount" className="typo-body-m-medium text-gray-500">
              저금할 금액
            </label>
            <AmountInput
              id="saving-amount"
              value={value}
              onChange={handleChange}
              warningMessage={warningMessage}
              isShaking={isShaking}
              onAnimationEnd={stopShaking}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmitClick();
                }
              }}
            />
            <AmountPresetButtons onAdd={addAmount} />
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
        </>
      )}
    </ClientModal>
  );
}
