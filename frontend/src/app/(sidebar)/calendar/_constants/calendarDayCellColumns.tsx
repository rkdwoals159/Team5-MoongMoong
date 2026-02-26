import Chip from "@/components/common/Chip/Chip";
import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import type { ExpenseCategory, GroupExpenseItem } from "@/app/(sidebar)/calendar/_types";
import { getChipColorForCategory } from "@/app/(sidebar)/calendar/_utils";

export const DAY_CELL_DETAIL_COLUMNS: DataTableColumn<GroupExpenseItem>[] = [
  {
    label: "닉네임",
    accessor: "nickName",
    width: "140px",
    render: (value) => (
      <span className="block w-full truncate px-500 py-100">{String(value ?? "-")}</span>
    ),
  },
  {
    label: "사용내역",
    accessor: "usage",
    width: "150px",
    render: (value) => (
      <span className="block w-full truncate px-500 py-100">{String(value ?? "-")}</span>
    ),
  },
  {
    label: "비용",
    accessor: "cost",
    width: "88px",
    render: (value) => {
      const amount = Number(value ?? 0);
      return (
        <span className="block w-full whitespace-nowrap px-500 py-100 tabular-nums text-gray-700">
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
      <div className="block w-full px-500 py-100">
        <Chip
          label={String(value ?? "-")}
          level="major"
          color={getChipColorForCategory(value as ExpenseCategory)}
        />
      </div>
    ),
  },
];
