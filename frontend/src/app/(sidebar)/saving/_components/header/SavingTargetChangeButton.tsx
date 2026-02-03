"use client";

import { useRef, useState } from "react";
import Button from "@/components/common/Button/Button";
import { formatAmountPlain } from "@/utils/amount";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import CloseIcon from "@/assets/icons/components/close.svg";

export default function SavingTargetChangeButton() {
  const { status } = useSavingStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(() => (status.target > 0 ? String(status.target) : ""));
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw);
  };

  const handleSubmit = () => {
    const numericAmount = Number(amount);
    if (numericAmount <= 0) return;
    // TODO: 목표 금액 수정 API 호출
    setIsOpen(false);
  };

  useOutsideClick({
    isActive: isOpen,
    refs: [popoverRef, buttonRef],
    onOutside: () => setIsOpen(false),
  });

  const numericAmount = Number(amount);
  const isValid = amount.length > 0 && numericAmount > 0 && numericAmount >= status.total;
  const isBelowTotal = amount.length > 0 && numericAmount > 0 && numericAmount < status.total;

  return (
    <div className="relative flex items-end" ref={buttonRef}>
      <Button variant="secondary" onClick={() => setIsOpen((prev) => !prev)}>
        목표 금액 수정
      </Button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-200 z-50 w-[380px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)] px-700 pt-700 pb-700 flex flex-col"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-600 right-600 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <CloseIcon className="size-5" aria-hidden="true" />
          </button>

          <h3 className="typo-title-m-bold text-gray-800">목표 금액 설정</h3>
          <p className="mt-200 typo-body-m-medium text-gray-400">
            우리 가족의 목표 금액을 설정해주세요.
          </p>

          <div className="mt-700 flex items-center h-12 px-500 rounded-300 border border-gray-100 bg-white-100 transition-colors focus-within:border-yellow-300">
            <input
              id="target-amount"
              type="text"
              inputMode="numeric"
              placeholder="금액을 입력해주세요"
              value={amount ? formatAmountPlain(numericAmount) : ""}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none typo-body-l-medium placeholder:text-gray-300"
              autoFocus
            />
            <span className="typo-body-l-medium text-gray-400">원</span>
          </div>

          {isBelowTotal && (
            <p className="mt-200 typo-body-s-medium text-red-500">
              현재 저금 금액({formatAmountPlain(status.total)}원) 이상으로 설정해주세요.
            </p>
          )}

          <div className="mt-900 flex gap-300">
            <Button variant="secondary" size="large" fullWidth onClick={() => setIsOpen(false)}>
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
        </div>
      )}
    </div>
  );
}
