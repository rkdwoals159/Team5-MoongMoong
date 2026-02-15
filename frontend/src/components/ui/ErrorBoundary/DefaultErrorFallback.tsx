"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { DEFAULT_ERROR_MESSAGE, MAX_RETRY_COUNT, SERVER_ERROR_MESSAGE } from "@/constants";
import { DefaultErrorFallbackProps } from "./errorBoundary.type";

export default function DefaultErrorFallback({
  message,
  onReset,
  refreshOnReset,
  retryAttempts,
}: DefaultErrorFallbackProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleRetry = () => {
    if (retryAttempts >= MAX_RETRY_COUNT) {
      showToast({
        variant: "error",
        message: SERVER_ERROR_MESSAGE,
      });
      return;
    }
    startTransition(() => {
      if (refreshOnReset) router.refresh();
      onReset();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-400 py-600">
      <p className="typo-body-l-medium text-text-sub">{message ?? DEFAULT_ERROR_MESSAGE}</p>
      <Button variant="secondary" size="medium" onClick={handleRetry}>
        다시 시도하기
      </Button>
    </div>
  );
}
