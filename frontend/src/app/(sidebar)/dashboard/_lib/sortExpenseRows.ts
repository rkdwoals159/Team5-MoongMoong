import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";
import type { SortableExpenseAccessor } from "@/app/(sidebar)/dashboard/_types";

/** 지출 행 정렬 (spentAt/cost는 Date/Number 비교, 나머지는 문자열) */
export function sortExpenseRows<T extends ExpenseData>(
  rows: T[],
  sortBy: SortableExpenseAccessor,
  sortOrder: "asc" | "desc",
): T[] {
  const modifier = sortOrder === "asc" ? 1 : -1;

  function compare(a: T, b: T): number {
    const valA = a[sortBy];
    const valB = b[sortBy];

    const isEmpty = (v: unknown) => v == null || v === "";

    if (isEmpty(valA) && isEmpty(valB)) return 0;
    if (isEmpty(valA)) return 1;
    if (isEmpty(valB)) return -1;

    if (sortBy === "spentAt") {
      return String(valA).localeCompare(String(valB)) * modifier;
    }
    if (sortBy === "cost") {
      const numA = typeof valA === "number" ? valA : (Number(valA) ?? 0);
      const numB = typeof valB === "number" ? valB : (Number(valB) ?? 0);
      return (numA - numB) * modifier;
    }
    return String(valA).localeCompare(String(valB)) * modifier;
  }

  return [...rows].sort(compare);
}
