"use client";

import { useRef } from "react";
import cn from "@/utils/style";

import type { FileInputProps } from "./Input.type";
import CloseIcon from "@/assets/icons/close.svg";

const FileInput = ({
  filePlaceholder = "강아지 진료비 영수증을 업로드해주세요.",
  fileName,
  onClear,
  className,
  ...rest
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayText = fileName ?? filePlaceholder;
  const { onChange, ...inputProps } = rest;

  const classes = cn(
    fileBaseClasses,
    fileName ? "text-[var(--color-blue-500)]" : "text-[var(--color-gray-300)]",
    className ?? "",
  );

  return (
    <label className={classes}>
      <input
        {...inputProps}
        type="file"
        className="sr-only"
        ref={inputRef}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file && file.size > MAX_FILE_SIZE_BYTES) {
            alert("파일 용량은 최대 5MB까지 업로드할 수 있습니다.");
            e.currentTarget.value = "";
            onClear?.();
            return;
          }
          onChange?.(e);
        }}
      />
      <span className={fileTextClasses}>{displayText}</span>
      {fileName && (
        <button
          type="button"
          className={fileIconClasses}
          aria-label="업로드 파일 제거"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            onClear?.();
          }}
        >
          <CloseIcon className="w-2.5 h-2.5" aria-hidden="true" />
        </button>
      )}
    </label>
  );
};

export default FileInput;

//--------------------------------
// Tailwind CSS classes

const sharedBaseClasses =
  "flex items-center gap-[var(--spacing-300)] w-full px-[var(--spacing-500)] rounded-[var(--radius-250)] border border-[var(--color-border-light)] bg-[var(--color-white-100)]";

const fileBaseClasses = cn(sharedBaseClasses, "justify-between h-[42px]");

const fileTextClasses = "typo-body-m-medium truncate";

const fileIconClasses =
  "inline-flex items-center justify-center w-[30px] h-[30px] text-[var(--color-gray-400)]";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
