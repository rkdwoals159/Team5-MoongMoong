"use client";

import Button from "@/components/common/Button/Button";
import { formatAmount } from "@/utils/amount";
import type { SavingConfirmDialogProps } from "@/app/(sidebar)/saving/_types";
export default function SavingConfirmDialog({
  amount,
  onConfirm,
  onCancel,
  isLoading,
}: SavingConfirmDialogProps) {
  return (
    <div role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-description">
      <p id="confirm-title" className="typo-title-s-bold text-center text-text-base">
        {formatAmount(amount)}을 저금하시겠습니까?
      </p>
      <p id="confirm-description" className="mt-500 typo-body-s text-center text-text-sub">
        토스페이로 결제하면 모임통장으로 이체됩니다
      </p>
      <div className="mt-700 flex gap-300">
        <Button
          variant="secondary"
          size="large"
          fullWidth
          onClick={onCancel}
          isDisabled={isLoading}
          aria-label="저금 취소"
        >
          취소
        </Button>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={onConfirm}
          isDisabled={isLoading}
          aria-label={isLoading ? "저금 처리 중" : "저금 확인"}
        >
          {isLoading ? "처리 중..." : "확인"}
        </Button>
      </div>
    </div>
  );
}
