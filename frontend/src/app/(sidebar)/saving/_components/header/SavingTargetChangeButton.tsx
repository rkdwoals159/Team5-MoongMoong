"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import SavingTargetModal from "@/app/(sidebar)/saving/_components/modals/SavingTargetModal";
import { DISABLED_TOOLTIP_MESSAGE } from "@/app/(sidebar)/saving/_constants";
import { updateSavingTarget } from "@/app/(sidebar)/saving/_api";
import { useToast } from "@/components/ui/Toast/ToastProvider";

export default function SavingTargetChangeButton() {
  const { status, setStatus } = useSavingStatus();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const isDisabled = status.current >= status.target;
  const router = useRouter();

  const handleSubmit = async (amount: number) => {
    if (amount === status.target) {
      showToast({
        variant: "error",
        message: "목표 금액과 동일해요.",
      });
      focusRef.current?.focus();
      return;
    }
    const response = await updateSavingTarget(amount);
    if (!response || !response.target) {
      showToast({
        variant: "error",
        message: "목표 금액 수정에 실패했어요.",
      });
      setIsOpen(false);
      return;
    }
    showToast({
      variant: "success",
      message: "목표 금액 수정에 성공했어요.",
    });

    setStatus({ ...status, target: response.target });
    setIsOpen(false);
    router.refresh();
  };

  useOutsideClick({
    isActive: isOpen,
    refs: [popoverRef, buttonRef],
    onOutside: () => setIsOpen(false),
  });

  return (
    <div className="relative flex items-end group" ref={buttonRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen((prev) => !prev)}
        isDisabled={status.current >= status.target}
      >
        목표 금액 수정
      </Button>

      {isDisabled && (
        <div className="absolute bottom-1000 right-0 mb-500 px-300 py-200 rounded-300 bg-gray-800 text-white-100 typo-body-s-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {DISABLED_TOOLTIP_MESSAGE}
        </div>
      )}

      {isOpen && (
        <SavingTargetModal
          ref={popoverRef}
          initialTarget={status.target}
          currentAmount={status.current}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          focusRef={focusRef}
        />
      )}
    </div>
  );
}
