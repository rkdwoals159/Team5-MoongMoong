"use client";

import Button from "@/components/common/Button/Button";
import { formatAmount } from "@/utils/amount";
import cn from "@/utils/style";
import { SavingConfirmDialogProps } from "@/app/(sidebar)/saving/_types";

export default function SavingConfirmDialog({
  amount,
  onConfirm,
  onCancel,
  onOverlayClick,
  isLoading,
}: SavingConfirmDialogProps) {
  const handleOverlayClick = () => {
    if (isLoading) return;
    onOverlayClick();
  };

  return (
    <section className={overlayClasses}>
      <div className="absolute inset-0" onClick={handleOverlayClick} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="저금 확인"
        className={confirmContentClasses}
        tabIndex={-1}
      >
        <p className="typo-title-s-bold text-center text-(--color-text-base)">
          {formatAmount(amount)}을 저금하시겠습니까?
        </p>
        <p className="mt-500 typo-body-s text-center text-(--color-text-sub)">
          토스페이로 결제하면 모임통장으로 이체됩니다
        </p>
        <div className="mt-700 flex gap-300">
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onCancel}
            isDisabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={onConfirm}
            isDisabled={isLoading}
          >
            {isLoading ? "처리 중..." : "확인"}
          </Button>
        </div>
      </div>
    </section>
  );
}

const overlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(26,31,39,0.25)]";

const confirmContentClasses = cn(
  "relative z-10 w-full max-w-[360px] rounded-500 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]",
  "px-700 pt-900 pb-700",
);
