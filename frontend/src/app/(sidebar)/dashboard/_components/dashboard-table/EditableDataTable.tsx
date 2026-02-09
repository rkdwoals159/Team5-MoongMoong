"use client";

import { EditableDataTableProps, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { useExpenseTable } from "@/app/(sidebar)/dashboard/_hooks";
import DataTable from "@/components/ui/DataTable/DataTable";
import CategoryPopup from "@/app/(sidebar)/dashboard/_components/dashboard-table/CategoryPopup";
import ExpenseTableToolbar from "@/app/(sidebar)/dashboard/_components/dashboard-table/ExpenseTableToolbar";
import cn from "@/utils/style";

/**
 * 수정 가능한 DataTable 컴포넌트
 */
const EditableDataTable = ({
  initialData,
  startDate,
  endDate,
  className,
}: EditableDataTableProps) => {
  const {
    displayInitialRows,
    rowKey,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup,
    deleteSelectedRows,
    mergeSelectedRows,
    handleSave,
    hasUnsavedChanges,
    selectedCount,
    totalExpense,
  } = useExpenseTable(initialData);

  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className ?? "")}>
      <div className="flex-1 min-h-0 overflow-auto">
        <DataTable<ExpenseData>
          mode="edit"
          columns={columns}
          data={displayInitialRows}
          rowKey={rowKey}
          className="h-full rounded-t-600 border border-b-0 border-gray-50"
          selectedCell={selectedCell}
        />
      </div>

      {showCategoryPopup && selectedCell && (
        <CategoryPopup
          position={popupPosition}
          onSelect={handleCategorySelect}
          onClose={handleClosePopup}
          currentMainCategory={String(
            displayInitialRows[selectedCell.rowIndex]?.mainCategory ?? "",
          )}
          currentSubCategory={String(displayInitialRows[selectedCell.rowIndex]?.subCategory ?? "")}
        />
      )}

      <div className="sticky bottom-0 shrink-0 -mx-8">
        <ExpenseTableToolbar
          totalExpense={totalExpense}
          selectedCount={selectedCount}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={() => handleSave(startDate, endDate)}
          onDeleteSelected={deleteSelectedRows}
          onMergeSelected={mergeSelectedRows}
        />
      </div>
    </div>
  );
};

export default EditableDataTable;
