"use client";

import Button from "@/components/common/Button/Button";
import WarningIcon from "@/assets/ic_warning.svg";
import { ERROR_VIEW_TITLE, ERROR_VIEW_DESCRIPTION } from "@/app/(sidebar)/dashboard/_constants";
import type { PetImageErrorViewProps } from "@/app/(sidebar)/dashboard/_types";

export default function PetImageErrorView({ onRetry }: PetImageErrorViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2 className="text-center typo-headline-s-bold text-gray-800">{ERROR_VIEW_TITLE}</h2>
      <p className="mt-200 text-center mb-1000 typo-title-s-medium text-gray-600">
        {ERROR_VIEW_DESCRIPTION}
      </p>
      <div className="mt-500 flex justify-center">
        <WarningIcon className="size-30" aria-hidden />
      </div>
      <div className="mt-auto flex shrink-0 gap-300 pt-700">
        <Button variant="primary" size="large" fullWidth onClick={onRetry}>
          다시 시도하기
        </Button>
      </div>
    </div>
  );
}
