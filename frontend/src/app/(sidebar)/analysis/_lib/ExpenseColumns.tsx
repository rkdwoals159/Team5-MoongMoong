import Chip from "@/components/common/Chip/Chip";
import type { DataTableColumn } from "@/components/ui/DataTable/dataTable.type";
import { CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR } from "@/constants/colorTables";
import { formatAmountPlain } from "@/utils/amount";
import { formatDateWithDots } from "@/utils/date";
import type { components } from "@/types/schema";
//소비내역 컬럼 메타데이터 생성
export const buildExpenseColumns = (): DataTableColumn<
  components["schemas"]["GroupExpenseResponse"]
>[] => [
  {
    label: "날짜",
    accessor: "spendAt",
    render: (value) => (
      <span className="whitespace-nowrap px-4 py-1">
        {value ? formatDateWithDots(String(value)) : "-"}{" "}
      </span>
    ),
  },
  {
    label: "닉네임",
    accessor: "nickName",
    render: (value) => (
      <span className="block max-w-[96px] truncate px-4 py-1"> {String(value ?? "-")} </span>
    ),
  },
  {
    label: "항목",
    accessor: "mainCategory",
    render: (_value, row) => {
      const mainCategory = row.mainCategory || "기타";
      const color = CATEGORY_COLOR_MAP[mainCategory] || DEFAULT_CATEGORY_COLOR;
      return (
        <div className="flex items-center gap-200 px-4 py-1">
          <Chip label={mainCategory} level="major" color={color} />
          {row.subCategory ? <Chip label={row.subCategory} level="minor" color="none" /> : null}
        </div>
      );
    },
  },
  {
    label: "사용내역",
    accessor: "usage",
    render: (value) => (
      <span className="block max-w-[240px] truncate px-4 py-1"> {String(value ?? "-")} </span>
    ),
  },
  {
    label: "비용",
    accessor: "cost",
    render: (value) => (
      <span className="tabular-nums text-gray-700 px-4 py-1">
        {formatAmountPlain(Number(value ?? 0))}
      </span>
    ),
  },
  {
    label: "메모",
    accessor: "memo",
    render: (value) => (
      <span className="block max-w-[200px] truncate px-4 py-1">{String(value ?? "-")}</span>
    ),
  },
];
