"use client";

import Button from "@/components/common/Button/Button";
import Image from "next/image";
import {
  SUCCESS_VIEW_TITLE,
  SUCCESS_VIEW_DESCRIPTION,
  SUCCESS_VIEW_IMAGE_SIZE,
} from "@/app/(sidebar)/dashboard/_constants";
import type { PetImageSuccessViewProps } from "@/app/(sidebar)/dashboard/_types";

export default function PetImageSuccessView({
  previewUrl,
  onCancel,
  onSave,
  isSaving = false,
}: PetImageSuccessViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2 className="typo-headline-s-bold text-gray-800">{SUCCESS_VIEW_TITLE}</h2>
      <p className="mt-200 text-gray-600 typo-title-s-medium">{SUCCESS_VIEW_DESCRIPTION}</p>
      <div className="mt-500 flex justify-center">
        <div
          className={`relative size-[${SUCCESS_VIEW_IMAGE_SIZE}px] overflow-hidden rounded-600 border border-gray-100 bg-gray-50 shadow-[0px_1px_3px_0px_rgba(26,31,39,0.08)]`}
        >
          <Image
            src={previewUrl}
            alt="선택한 강아지 이미지 미리보기"
            className="size-full object-cover"
            width={SUCCESS_VIEW_IMAGE_SIZE}
            height={SUCCESS_VIEW_IMAGE_SIZE}
          />
        </div>
      </div>
      <div className="mt-auto flex shrink-0 gap-300 pt-700">
        <Button variant="secondary" size="large" fullWidth onClick={onCancel} isDisabled={isSaving}>
          취소
        </Button>
        <Button variant="primary" size="large" fullWidth onClick={onSave} isDisabled={isSaving}>
          저장
        </Button>
      </div>
    </div>
  );
}
