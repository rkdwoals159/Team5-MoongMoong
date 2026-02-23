"use client";

import { useRef } from "react";
import type { EditableDataTableProps, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { useExpenseTable } from "@/app/(sidebar)/dashboard/_hooks";
import { useInfiniteScroll } from "@/app/(sidebar)/dashboard/_hooks/useInfiniteScroll";
import ClientDataTable from "@/components/ui/DataTable/ClientDataTable";
import CategoryPopup from "@/app/(sidebar)/dashboard/_components/dashboard-table/CategoryPopup";
import { DATE_PICKER_HEIGHT } from "@/app/(sidebar)/dashboard/_constants";
import DatePickerPopup from "@/components/common/DatePicker/DatePickerPopup";
import ExpenseTableToolbar from "@/app/(sidebar)/dashboard/_components/dashboard-table/ExpenseTableToolbar";
import { cn } from "@/utils/style";
import type { ServerSortField } from "@/api/types/dashboardApi.type";

/**
 * 수정 가능한 DataTable 컴포넌트
 */
const EditableDataTable = ({
  initialData,
  className,
  sortConfig,
  onSort,
  onSaveSuccess,
  resetKey,
  hasNext,
  isLoadingMore,
  loadMore,
  mainCategoryFilter,
  onCategoryFilterChange,
}: EditableDataTableProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    sortedRows,
    rowKey,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup,
    showDatePicker,
    datePickerPosition,
    handleDateSelect,
    handleCloseDatePicker,
    deleteSelectedRows,
    mergeSelectedRows,
    handleSave,
    hasUnsavedChanges,
    selectedCount,
    totalExpense,
    onCellClick,
    onKeyDown,
  } = useExpenseTable({
    initialData,
    resetKey,
    onSaveSuccess,
    scrollContainerRef,
    mainCategoryFilter,
    onCategoryFilterChange,
  });

  const { sentinelRef } = useInfiniteScroll({
    hasNext,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
  });

  // SortConfigV2 → DataTable의 sortConfig 형태로 변환
  // ClientDataTable은 공용 컴포넌트이므로 형태를 맞춰줌
  const tableSortConfig = sortConfig.map(({ field, order }) => ({
    sortBy: field as keyof ExpenseData,
    sortOrder: order,
  }));

  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className ?? "")}>
      <ClientDataTable<ExpenseData>
        mode="edit"
        columns={columns}
        data={sortedRows}
        rowKey={rowKey}
        className="flex-1 min-h-0 rounded-t-600 border border-b-0 border-gray-50"
        selectedCell={selectedCell}
        sortConfig={tableSortConfig}
        onSort={(accessor) => onSort(accessor as ServerSortField)}
        onCellClick={onCellClick}
        onKeyDown={onKeyDown}
        scrollContainerRef={scrollContainerRef}
        bottomSlot={
          <>
            <div ref={sentinelRef} className="h-4" />
            {isLoadingMore && (
              <div className="py-2 text-center text-sm text-gray-400">불러오는 중...</div>
            )}
          </>
        }
      />

      {showCategoryPopup && selectedCell && (
        <CategoryPopup
          position={popupPosition}
          onSelect={handleCategorySelect}
          onClose={handleClosePopup}
          currentMainCategory={String(sortedRows[selectedCell.rowIndex]?.mainCategory ?? "")}
          currentSubCategory={String(sortedRows[selectedCell.rowIndex]?.subCategory ?? "")}
        />
      )}

      {showDatePicker && selectedCell?.accessor === "spentAt" && (
        <DatePickerPopup
          position={datePickerPosition}
          value={String(sortedRows[selectedCell.rowIndex]?.spentAt ?? "")}
          onChange={handleDateSelect}
          onClose={handleCloseDatePicker}
          minHeight={DATE_PICKER_HEIGHT}
        />
      )}

      <div className="sticky bottom-0 shrink-0 -mx-8">
        <ExpenseTableToolbar
          totalExpense={totalExpense}
          selectedCount={selectedCount}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          onDeleteSelected={deleteSelectedRows}
          onMergeSelected={mergeSelectedRows}
        />
      </div>
    </div>
  );
};

export default EditableDataTable;
