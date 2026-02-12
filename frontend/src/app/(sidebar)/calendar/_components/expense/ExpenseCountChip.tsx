import { ExpenseCountChipProps } from "@/app/(sidebar)/calendar/_types";

export default function ExpenseCountChip({ count }: ExpenseCountChipProps) {
  return (
    <div className="flex h-[24px] w-full items-center justify-center gap-100 rounded-200 bg-gray-30 px-300 py-100 text-(--color-gray-200)">
      <span className="typo-caption-s-bold">+</span>
      <span className="typo-caption-s-bold">{count}건</span>
    </div>
  );
}
