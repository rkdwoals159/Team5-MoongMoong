"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";
import type { FallbackProps } from "@/components/ui/ErrorBoundary/errorBoundary.type";

export default function FamilyManageModalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      resetErrorBoundary();
    });
  };

  return (
    <div className="relative overflow-hidden rounded-600 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]">
      <div className="mx-auto flex h-[545px] w-[450px] flex-col items-center justify-center gap-400 py-850">
        <p className="typo-body-l-medium text-text-sub">{error.message}</p>
        <Button variant="secondary" size="medium" onClick={handleRetry}>
          다시 시도하기
        </Button>
      </div>
    </div>
  );
}
