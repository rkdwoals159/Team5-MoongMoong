"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";
import cn from "@/utils/style";
import { formatAmount, formatAmountPlain } from "@/utils/amount";
import { AMOUNT_PRESETS } from "@/app/(sidebar)/saving/_constants";
import { SavingModalProps } from "@/app/(sidebar)/saving/_types";
import { updateRankings } from "@/app/(sidebar)/saving/_lib";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";

export default function SavingModal({ open, onClose, handleDrop }: SavingModalProps) {
  const { status, setStatus } = useSavingStatus();
  const [showConfirm, setShowConfirm] = useState(false);
  const [amount, setAmount] = useState("");
  if (!open) return null;

  const numericAmount = Number(amount);
  const isValid = amount.length > 0 && numericAmount > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw);
  };

  const handleAddAmount = (value: number) => {
    setAmount((prev) => String(Number(prev || "0") + value));
  };

  const handleSubmitClick = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // TODO: 송금 API 호출
    handleDrop("또리맘", Number(amount), new Date().toISOString(), status.target);
    setStatus((prev) => ({
      ...prev,
      total: prev.total + numericAmount,
      rankings: updateRankings(prev.rankings, "또리맘", numericAmount),
    }));
    setShowConfirm(false);
    setAmount("");
    onClose();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleOverlayClick = () => {
    if (showConfirm) {
      setShowConfirm(false);
      return;
    }
    setAmount("");
    onClose();
  };

  if (showConfirm) {
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
            {formatAmount(numericAmount)}을 저금하시겠습니까?
          </p>
          <div className="mt-700 flex gap-300">
            <Button variant="secondary" size="large" fullWidth onClick={handleCancel}>
              취소
            </Button>
            <Button variant="primary" size="large" fullWidth onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </div>
      </section>
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
              value={amount ? formatAmountPlain(numericAmount) : ""}
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
                onClick={() => handleAddAmount(preset)}
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
          isDisabled={!isValid}
          onClick={handleSubmitClick}
        >
          송금하기
        </Button>
      </div>
    </section>
  );
}

// -------------- Tailwind CSS classes ------------------
const overlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(26,31,39,0.25)]";

const contentClasses = cn(
  "relative z-10 w-full max-w-[420px] rounded-500 bg-(--color-white-100) shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]",
  "px-700 pt-700 pb-700",
);

const confirmContentClasses = cn(
  "relative z-10 w-full max-w-[360px] rounded-500 bg-(--color-white-100) shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]",
  "px-700 pt-900 pb-700",
);

const inputWrapperClasses =
  "flex items-center gap-300 w-full h-12 px-500 rounded-[var(--radius-250)] border border-[var(--color-border-light)] bg-[var(--color-white-100)] transition-colors focus-within:border-[var(--color-yellow-300)]";

const presetButtonClasses =
  "flex-1 py-250 rounded-[var(--radius-250)] border border-[var(--color-border-light)] bg-[var(--color-white-100)] typo-body-s-medium text-[var(--color-gray-500)] transition-colors hover:bg-[var(--color-yellow-50)] hover:border-[var(--color-yellow-300)] cursor-pointer";
