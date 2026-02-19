import Chip from "@/components/common/Chip/Chip";
import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type { ExpenseCategory, GroupExpenseItem } from "@/app/(sidebar)/calendar/_types";
import { getChipColorForCategory } from "@/app/(sidebar)/calendar/_utils";

export const DAY_CELL_DETAIL_COLUMNS: DataTableColumn<GroupExpenseItem>[] = [
  {
    label: "닉네임",
    accessor: "nickName",
    width: "88px",
    render: (value) => (
      <span className="block max-w-[80px] truncate px-200 py-100">{String(value ?? "-")}</span>
    ),
  },
  {
    label: "사용내역",
    accessor: "usage",
    width: "144px",
    render: (value) => (
      <span className="block max-w-[136px] truncate px-200 py-100">{String(value ?? "-")}</span>
    ),
  },
  {
    label: "비용",
    accessor: "cost",
    width: "88px",
    render: (value) => {
      const amount = Number(value ?? 0);
      return (
        <span className="block whitespace-nowrap px-200 py-100 tabular-nums text-gray-700">
          {Number.isFinite(amount) ? `${amount.toLocaleString()}원` : "-"}
        </span>
      );
    },
  },
  {
    label: "항목",
    accessor: "mainCategory",
    width: "92px",
    render: (value) => (
      <div className="px-200 py-100">
        <Chip
          label={String(value ?? "-")}
          level="major"
          color={getChipColorForCategory(value as ExpenseCategory)}
        />
      </div>
    ),
  },
];
