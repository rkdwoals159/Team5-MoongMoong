"use client";

import { formatAmount } from "@/utils/amount";
import cn from "@/utils/style";
import type { ExpenseTableToolbarProps } from "../_types";
import Button from "@/components/common/Button/Button";

/**
 * 지출 테이블 하단 툴바
 * - 좌측: 선택 삭제, 선택 합치기
 * - 우측: 지출 합계, 저장하기
 */
export default function ExpenseTableToolbar({
  totalExpense = 0,
  selectedCount = 0,
  hasUnsavedChanges = false,
  className,
}: ExpenseTableToolbarProps) {
  const canDelete = selectedCount >= 1;
  const canMerge = selectedCount >= 2;

  // TODO: 선택된 행 삭제 로직 구현
  const handleDeleteSelected = () => {};

  // TODO: 선택된 행 합치기 로직 구현
  const handleMergeSelected = () => {};

  // TODO: 변경사항 저장 로직 구현
  const handleSave = () => {};

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
          onClick={handleDeleteSelected}
        >
          선택 삭제
        </Button>
        <Button
          variant="secondary"
          size="medium"
          isDisabled={!canMerge}
          className="typo-body-m-medium transition-colors"
          onClick={handleMergeSelected}
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
            onClick={handleSave}
          >
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
