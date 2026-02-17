"use client";

import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useCallback } from "react";
import type { ParentingCodeCardProps } from "@/app/(sidebar)/family/_types";

export default function ParentingCodeCard({ code }: ParentingCodeCardProps) {
  const { showToast } = useToast();
  const handleCopyUrl = useCallback(async () => {
    const shareUrl = `${window.location.origin}/invite?code=${code}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast({
        message: "공유 URL이 복사되었습니다.",
        variant: "success",
      });
    } catch {
      showToast({
        message: "공유 URL 복사에 실패했습니다.",
        variant: "error",
      });
    }
  }, [code, showToast]);

  return (
    <div className={cardClasses}>
      <div className="flex flex-col">
        <span className="typo-caption-s-medium text-gray-500">가족 가계부 초대 URL</span>
        <span className="typo-title-l-bold text-yellow-500">{code}</span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="xsmall"
        onClick={handleCopyUrl}
        className="typo-body-s-medium text-base"
      >
        URL 복사
      </Button>
    </div>
  );
}

const cardClasses = "flex items-center justify-between rounded-400 bg-gray-30 p-3";
