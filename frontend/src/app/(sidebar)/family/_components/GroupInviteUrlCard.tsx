"use client";

import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useCallback } from "react";
import type { GroupInviteUrlCardProps } from "@/app/(sidebar)/family/_types";
import { INVITE_BASE_URL, NO_INVITE_URL } from "@/app/(sidebar)/family/_constants";

export default function GroupInviteUrlCard({ inviteUrl, size = "large" }: GroupInviteUrlCardProps) {
  const { showToast } = useToast();
  const handleCopyUrl = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(INVITE_BASE_URL + inviteUrl);
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
  }, [inviteUrl, showToast]);

  const inviteCode = inviteUrl?.split("/").pop() ?? NO_INVITE_URL;

  return (
    <div className={cardClasses}>
      <div className="flex min-w-0 flex-col">
        <span className="typo-caption-s-medium text-gray-500">가족 가계부 초대 URL</span>
        <span
          className={`truncate text-yellow-500 ${size === "large" ? "typo-title-l-bold" : "typo-body-m-bold"}`}
        >
          {inviteCode}
        </span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="xsmall"
        onClick={handleCopyUrl}
        isDisabled={!inviteUrl}
        className="shrink-0 typo-body-s-medium text-base"
      >
        URL 복사
      </Button>
    </div>
  );
}

const cardClasses = "flex items-center justify-between rounded-400 bg-gray-30 p-3";
