"use client";

import type { DateInputProps } from "@/app/(sidebar)/dashboard/_types";
import { formatDateKey } from "@/utils/date";
import { cn } from "@/utils/style";

/**
 * 날짜 표시 버튼 (DatePickerPopup 트리거)
 * 클릭/포커스 시 onOpen() 호출 → 부모가 DatePickerPopup 열기
 */
export default function DateInput({
  value,
  onOpen,
  className,
  focusable = true,
  ariaLabel = "날짜 선택",
}: DateInputProps) {
  const displayText = value ? formatDateKey(new Date(value)) : "";

  return (
    <button
      type="button"
      tabIndex={focusable ? 0 : -1}
      onClick={onOpen}
      className={cn(
        "w-full h-full min-h-10 min-w-[8rem] cursor-pointer select-none text-left truncate px-500 py-200 flex items-center justify-start transition-colors focus:outline-none focus-visible:outline-none",
        className ?? "",
      )}
      aria-label={ariaLabel}
    >
      {displayText}
    </button>
  );
}
