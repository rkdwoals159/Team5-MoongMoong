"use client";

import { EditableDataTableProps, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { useExpenseTable } from "@/app/(sidebar)/dashboard/_hooks";
import ClientDataTable from "@/components/ui/DataTable/ClientDataTable";
import CategoryPopup from "@/app/(sidebar)/dashboard/_components/dashboard-table/CategoryPopup";
import ExpenseTableToolbar from "@/app/(sidebar)/dashboard/_components/dashboard-table/ExpenseTableToolbar";
import cn from "@/utils/style";
import { SortableExpenseAccessor } from "@/app/(sidebar)/dashboard/_types";
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
    sortedRows,
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
    sortConfig,
    handleSort,
    onCellClick,
    onKeyDown,
  } = useExpenseTable(initialData);

  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className ?? "")}>
      <div className="flex-1 min-h-0 overflow-auto">
        <ClientDataTable<ExpenseData>
          mode="edit"
          columns={columns}
          data={sortedRows}
          rowKey={rowKey}
          className="h-full rounded-t-600 border border-b-0 border-gray-50"
          selectedCell={selectedCell}
          sortConfig={sortConfig}
          onSort={(accessor) => handleSort(accessor as SortableExpenseAccessor)}
          onCellClick={onCellClick}
          onKeyDown={onKeyDown}
        />
      </div>

      {showCategoryPopup && selectedCell && (
        <CategoryPopup
          position={popupPosition}
          onSelect={handleCategorySelect}
          onClose={handleClosePopup}
          currentMainCategory={String(sortedRows[selectedCell.rowIndex]?.mainCategory ?? "")}
          currentSubCategory={String(sortedRows[selectedCell.rowIndex]?.subCategory ?? "")}
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
