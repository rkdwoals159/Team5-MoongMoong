import type { SelectedCell } from "./expenseTable";

export type UseExpenseCellPopupParams = {
  setSelectedCell: (cell: SelectedCell) => void;
  variant: "category" | "date";
};

export type UseExpenseCellPopupReturn = {
  show: boolean;
  popupPosition: { top: number; left: number };
  handleOpenPopup: (rowIndex: number) => void;
  handleClosePopup: () => void;
};
