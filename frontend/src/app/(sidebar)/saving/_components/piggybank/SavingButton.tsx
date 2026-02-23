"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";
import SavingModal from "@/app/(sidebar)/saving/_components/modals/SavingModal";
import SavingBreakSummaryModal from "@/app/(sidebar)/saving/_components/modals/SavingBreakSummaryModal";
import type { BreakSummary } from "@/app/(sidebar)/saving/_types/";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { deleteBank } from "@/api/savingApi";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { executeWithToastError } from "@/lib/api/executeWithToastError";

export default function SavingButton({
  handleDrop,
}: {
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [breakSummary, setBreakSummary] = useState<BreakSummary | null>(null);
  const { status } = useSavingStatus();
  const canBreak = status.current >= status.target;
  const router = useRouter();
  const { showToast } = useToast();

  const handleBreak = async () => {
    if (isBreaking) return;
    setIsBreaking(true);

    try {
      await executeWithToastError(() => deleteBank(), {
        showToast,
        fallbackMessage: API_ERROR_MESSAGES.BANK_BREAK,
        onSuccess: (response) => {
          setBreakSummary({
            days: response.days ?? 0,
            message: response.message ?? "축하해요! 저금통이 열렸어요 🎉",
          });
        },
      });
    } finally {
      setIsBreaking(false);
    }
  };

  return (
    <>
      {canBreak ? (
        <Button
          variant="primary"
          size="large"
          className="w-full"
          isDisabled={isBreaking}
          onClick={handleBreak}
        >
          {isBreaking ? "깨는 중..." : "저금통 깨기"}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="large"
          className="w-full"
          onClick={() => setIsModalOpen(true)}
        >
          저금하기
        </Button>
      )}
      <SavingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDrop={handleDrop}
      />
      <SavingBreakSummaryModal summary={breakSummary} onRefresh={() => router.refresh()} />
    </>
  );
}
