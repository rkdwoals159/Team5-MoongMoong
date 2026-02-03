"use client";

import { EditableDataTableProps, ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import { useEditableExpenseTable } from "@/app/(sidebar)/dashboard/_hooks/useEditableExpenseTable";
import DataTable from "@/components/ui/DataTable/DataTable";
import CategoryPopup from "@/app/(sidebar)/dashboard/_components/dashboard-table/CategoryPopup";

/**
 * 수정 가능한 DataTable 컴포넌트
 * @param data - 초기 데이터 (ExpenseData 타입)
 * @param className - 추가할 스타일 클래스 (옵셔널)
 * @returns 수정 가능한 DataTable 컴포넌트
 */
const EditableDataTable = ({ initialData, className }: EditableDataTableProps) => {
  const {
    displayRows,
    columns,
    selectedCell,
    showCategoryPopup,
    popupPosition,
    handleCategorySelect,
    handleClosePopup,
  } = useEditableExpenseTable(initialData);

  return (
    <>
      <DataTable<ExpenseData>
        mode="edit"
        columns={columns}
        data={displayRows}
        rowKey={(row: ExpenseData, rowIndex: number) =>
          row.expenseId > 0
            ? row.expenseId
            : row.expenseId === 0
              ? `new-${rowIndex}`
              : `empty-${rowIndex}`
        }
        className={className}
        selectedCell={selectedCell}
      />

      {showCategoryPopup && selectedCell && (
        <CategoryPopup
          position={popupPosition}
          onSelect={handleCategorySelect}
          onClose={handleClosePopup}
          currentMainCategory={String(displayRows[selectedCell.rowIndex]?.mainCategory ?? "")}
          currentSubCategory={String(displayRows[selectedCell.rowIndex]?.subCategory ?? "")}
        />
      )}
    </>
  );
};

export default EditableDataTable;
