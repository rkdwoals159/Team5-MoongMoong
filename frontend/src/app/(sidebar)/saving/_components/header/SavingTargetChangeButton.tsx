"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import ClientModal from "@/components/ui/Modal/ClientModal";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import SavingTargetModal from "@/app/(sidebar)/saving/_components/modals/SavingTargetModal";
import { DISABLED_TOOLTIP_MESSAGE } from "@/app/(sidebar)/saving/_constants";
import { updateSavingTarget } from "@/api/savingApiActions";
import { useToast } from "@/components/ui/Toast/ToastProvider";

export default function SavingTargetChangeButton() {
  const { status, setStatus } = useSavingStatus();
  const [isOpen, setIsOpen] = useState(false);
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

      <ClientModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="dropdown"
        ariaLabel="목표 금액 수정"
        outsideClickRefs={[buttonRef]}
        contentClassName="absolute top-full right-0 mt-200 z-50 w-[380px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)] px-700 pt-700 pb-700 flex flex-col"
      >
        <SavingTargetModal
          initialTarget={status.target}
          currentAmount={status.current}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          focusRef={focusRef}
        />
      </ClientModal>
    </div>
  );
}
