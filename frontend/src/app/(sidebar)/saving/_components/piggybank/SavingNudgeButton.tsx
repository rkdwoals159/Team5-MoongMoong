"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button/Button";
import ClientModal from "@/components/ui/Modal/ClientModal";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { postSavingNudge } from "@/api/client/savingNudgeApi";
import { getGroupCrew } from "@/api/client/familyApi";

export default function SavingNudgeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAlone, setIsAlone] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getGroupCrew()
      .then((data) => {
        setIsAlone((data.crews ?? []).length === 0);
      })
      .catch(() => {
        setIsAlone(true);
      });
  }, []);

  const handleConfirm = async () => {
    try {
      await postSavingNudge();
      showToast({
        variant: "success",
        message: "가족 구성원들에게 재촉 알림을 보냈어요.",
      });
    } catch {
      showToast({
        variant: "error",
        message: "알림 재촉에 실패했어요. 잠시후 다시 시도해주세요.",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        className="relative flex-1"
        onMouseEnter={() => isAlone && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Button
          variant="secondary"
          size="large"
          className="w-full whitespace-nowrap"
          isDisabled={isAlone}
          onClick={() => setIsOpen(true)}
        >
          재촉하기
        </Button>
        {showTooltip && (
          <div
            role="tooltip"
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-200 p-400 rounded-300 bg-white-100 border border-gray-100 shadow-lg z-50"
          >
            <p className="typo-caption-m-medium text-neutral-700 whitespace-nowrap">
              재촉할 가족 구성원이 없습니다
            </p>
          </div>
        )}
      </div>
      <ClientModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel="재촉 확인"
        contentClassName="max-w-md mx-auto"
      >
        <div
          className="p-700"
          role="alertdialog"
          aria-labelledby="nudge-title"
          aria-describedby="nudge-description"
        >
          <p id="nudge-title" className="typo-title-s-bold text-center text-text-base">
            가족 구성원들에게 저금 재촉 알림을 보내시겠습니까?
          </p>
          <p id="nudge-description" className="mt-500 typo-body-s text-center text-text-sub">
            모든 가족 구성원에게 알림이 전송됩니다
          </p>
          <div className="mt-700 flex gap-300">
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => setIsOpen(false)}
              aria-label="재촉 취소"
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleConfirm}
              aria-label="재촉 확인"
            >
              확인
            </Button>
          </div>
        </div>
      </ClientModal>
    </>
  );
}
