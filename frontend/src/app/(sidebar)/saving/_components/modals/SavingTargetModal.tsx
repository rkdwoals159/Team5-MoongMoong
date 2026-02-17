"use client";

import Button from "@/components/common/Button/Button";
import AmountInput from "@/components/common/Input/AmountInput";
import { formatAmountPlain } from "@/utils/amount";
import CloseIcon from "@/assets/icons/components/close.svg";
import type { SavingTargetModalProps } from "@/app/(sidebar)/saving/_types";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";
import { TARGET_AMOUNT_RESTRAINTS } from "@/app/(sidebar)/saving/_constants";

export default function SavingTargetModal({
  initialTarget,
  currentAmount,
  onClose,
  onSubmit,
  focusRef,
}: SavingTargetModalProps) {
  const { value, numericValue, warningMessage, isShaking, stopShaking, handleChange } =
    useAmountInput({
      initialValue: initialTarget,
      min: currentAmount,
      minWarningMessage: `현재 저금 금액(${formatAmountPlain(currentAmount)}원) 이상으로 설정해주세요.`,
      max: TARGET_AMOUNT_RESTRAINTS.MAX,
      maxWarningMessage: TARGET_AMOUNT_RESTRAINTS.MAX_WARNING,
    });

  const handleSubmit = () => {
    if (numericValue <= 0) return;
    onSubmit(numericValue);
  };

  const isValid = value.length > 0 && numericValue > 0 && !warningMessage;

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-600 right-600 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="닫기"
      >
        <CloseIcon className="size-5" aria-hidden="true" />
      </button>

      <h3 className="typo-title-m-bold text-gray-800">목표 금액 설정</h3>
      <p className="mt-200 typo-body-m-medium text-gray-400">
        우리 가족의 목표 금액을 설정해주세요.
      </p>

      <div className="mt-700">
        <AmountInput
          value={value}
          onChange={handleChange}
          warningMessage={warningMessage}
          isShaking={isShaking}
          onAnimationEnd={stopShaking}
          ref={focusRef}
          autoFocus
        />
      </div>

      <div className="mt-900 flex gap-300">
        <Button variant="secondary" size="large" fullWidth onClick={onClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="large"
          fullWidth
          isDisabled={!isValid}
          onClick={handleSubmit}
        >
          저장
        </Button>
      </div>
    </>
  );
}
