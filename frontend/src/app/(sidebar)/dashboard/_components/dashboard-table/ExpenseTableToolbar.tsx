"use client";

import { memo } from "react";
import type { ExpenseTableToolbarProps } from "@/app/(sidebar)/dashboard/_types";
import { formatAmount } from "@/utils/amount";
import Button from "@/components/common/Button/Button";
import { cn } from "@/utils/style";

/**
 * 지출 테이블 하단 툴바
 * - 좌측: 선택 삭제, 선택 합치기
 * - 우측: 지출 합계, 저장하기
 */
const ExpenseTableToolbar = memo(function ExpenseTableToolbar({
  totalExpense = 0,
  selectedCount = 0,
  hasUnsavedChanges = false,
  onSave,
  onDeleteSelected,
  onMergeSelected,
  className,
}: ExpenseTableToolbarProps) {
  const canDelete = selectedCount >= 1;
  const canMerge = selectedCount >= 2;

  return (
    <div
      className={cn(
        "shrink-0 bg-white-100 border-t border-gray-100 flex items-center justify-between min-h-[104px] py-400 px-600",
        className ?? "",
      )}
      style={{ boxShadow: "0 -3px 8px 0 rgba(26, 31, 39, 0.04)" }}
      role="toolbar"
      aria-label="지출 테이블 액션"
    >
      <div className="flex items-center gap-300">
        <Button
          variant="secondary"
          size="medium"
          isDisabled={!canDelete}
          className="typo-body-m-medium transition-colors"
          onClick={onDeleteSelected}
        >
          선택 삭제
        </Button>
        <Button
          variant="secondary"
          size="medium"
          isDisabled={!canMerge}
          className="typo-body-m-medium transition-colors"
          onClick={onMergeSelected}
        >
          선택 합치기
        </Button>
      </div>

      <div className="flex items-center gap-600">
        <div className="flex items-center gap-400">
          <span className="typo-body-m-regular text-gray-500">지출 합계</span>
          <span className="typo-body-l-bold text-text-base tabular-nums">
            {formatAmount(totalExpense)}
          </span>
        </div>
        <div className="w-[205px]">
          <Button
            variant="primary"
            fullWidth={true}
            isDisabled={!hasUnsavedChanges}
            onClick={onSave}
          >
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ExpenseTableToolbar;
