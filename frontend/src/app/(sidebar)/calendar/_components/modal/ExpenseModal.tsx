import CloseIcon from "@/assets/icons/components/close.svg";
import Chip from "@/components/common/Chip/Chip";
import Modal from "@/components/ui/Modal/Modal";
import DataTable from "@/components/ui/DataTable/DataTable";
import type { DataTableColumn } from "@/components/ui/DataTable/DataTable.type";
import { getChipColorForCategory } from "@/lib/calendar/buildCalendarDays";
import { formatAmount, formatAmountPlain } from "@/utils/amount";
import type { ExpenseItem, ExpenseModalProps } from "@/types/calendar";
import Link from "next/link";
import { SCROLL_THRESHOLD } from "@/lib/calendar/mocks/constants";

export default function ExpenseModal({ open, title, items, closeHref }: ExpenseModalProps) {
  const total = items.reduce((sum, item) => sum + item.cost, 0);
  const columns: DataTableColumn<ExpenseItem>[] = [
    {
      label: "닉네임",
      accessor: "nickname",
      render: (value) => <span className="block max-w-[94px] truncate">{String(value)}</span>,
    },
    {
      label: "사용내역",
      accessor: "description",
      render: (value) => <span className="block max-w-[260px] truncate">{String(value)}</span>,
    },
    {
      label: "비용",
      accessor: "cost",
      render: (value) => (
        <span className="tabular-nums text-gray-700">{formatAmountPlain(Number(value))}</span>
      ),
    },
    {
      label: "항목",
      accessor: "category",
      render: (value) => (
        <Chip
          className="w-full"
          label={String(value)}
          level="major"
          color={getChipColorForCategory(value as ExpenseItem["category"])}
        />
      ),
    },
  ];

  const isScrollable = items.length >= SCROLL_THRESHOLD;

  return (
    <Modal
      open={open}
      ariaLabel={"calendar-expense-modal"}
      closeHref={closeHref}
      showOverlayClose
      contentClassName="flex max-w-[558px] flex-col pb-1100 pt-700"
    >
      <div className="flex h-[40px] items-center justify-end px-700">
        <Link
          href={closeHref}
          draggable={false}
          aria-label="닫기"
          className="flex size-[40px] items-center justify-center rounded-300 transition-colors hover:bg-(--color-gray-50) focus-visible:outline-2 focus-visible:outline-(--color-gray-300) focus-visible:outline-offset-2"
        >
          <CloseIcon className="h-[18px] w-[18px] text-gray-500" aria-hidden />
        </Link>
      </div>
      <div className="flex flex-col gap-900 px-850">
        <h2 className="typo-headline-s-bold text-(--color-text-base)">{title}</h2>
        <div className="flex flex-col gap-600">
          <div className={`min-h-[364px] ${isScrollable ? "max-h-[364px] overflow-y-auto" : ""}`}>
            <DataTable
              className="border-(--color-gray-50) rounded-600"
              columns={columns}
              data={items}
              rowKey={(row) => row.id}
            />
          </div>
        </div>
      </div>
      <div className="mt-900 flex items-center justify-end px-850">
        <div className="flex items-center gap-400">
          <span className="typo-body-l-bold text-gray-500">지출합계</span>
          <span className="typo-headline-s-bold text-gray-900">{formatAmount(total)}</span>
        </div>
      </div>
    </Modal>
  );
}
