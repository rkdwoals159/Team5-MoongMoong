"use client";

import { useRef } from "react";
import { cn } from "@/utils/style";
import {
  SELECT_VIEW_TITLE,
  SELECT_VIEW_DESCRIPTION,
  SELECT_VIEW_FILE_NAME_PLACEHOLDER,
} from "@/app/(sidebar)/dashboard/_constants";
import type { PetImageSelectViewProps } from "@/app/(sidebar)/dashboard/_types";

export default function PetImageSelectView({ onFileSelect }: PetImageSelectViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <>
      <h2 className="typo-headline-s-bold text-gray-800">{SELECT_VIEW_TITLE}</h2>
      <p className="mt-200 typo-title-s-medium text-gray-600">{SELECT_VIEW_DESCRIPTION}</p>
      <div className="mt-500 flex">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-hidden
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "shrink-0 rounded-l-250 rounded-r-none border border-r-0 border-gray-100 bg-gray-50 px-600 py-350",
            "typo-body-m-medium text-gray-800",
            "hover:bg-gray-100 transition-colors cursor-pointer",
          )}
        >
          파일 선택
        </button>
        <button
          className={cn(
            "min-w-0 flex-1 flex items-center justify-between gap-300",
            "rounded-r-250 rounded-l-none border border-gray-100 bg-white-100 px-600 py-350",
            "transition-colors cursor-pointer",
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={cn("typo-body-m-medium truncate text-gray-500")}>
            {SELECT_VIEW_FILE_NAME_PLACEHOLDER}
          </span>
        </button>
      </div>
    </>
  );
}
