"use client";
import { useTransition, useEffect } from "react";
import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { DEFAULT_ERROR_MESSAGE, MAX_RETRY_COUNT, SERVER_ERROR_MESSAGE } from "@/constants";
import { DefaultErrorFallbackProps } from "./errorBoundary.type";

export default function DefaultErrorFallback({
  message,
  onReset,
  retryAttempts,
}: DefaultErrorFallbackProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const isRetryDisabled = retryAttempts >= MAX_RETRY_COUNT;

  useEffect(() => {
    if (isRetryDisabled) {
      showToast({ variant: "error", message: SERVER_ERROR_MESSAGE });
    }
  }, [isRetryDisabled, showToast]);

  const handleRetry = () => {
    if (isPending || isRetryDisabled) return;

    startTransition(() => {
      onReset();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-400 py-600">
      <p className="typo-body-l-medium text-text-sub">
        {isRetryDisabled ? SERVER_ERROR_MESSAGE : (message ?? DEFAULT_ERROR_MESSAGE)}
      </p>
      <Button
        variant="secondary"
        size="medium"
        onClick={isRetryDisabled ? () => window.location.reload() : handleRetry}
        isDisabled={isPending}
      >
        {isRetryDisabled ? "페이지 새로고침" : "다시 시도하기"}
      </Button>
    </div>
  );
}
