import { GroupExpenseItem } from "../_types";

export const getDateTextColor = (
  isDisabled: boolean,
  isWeekend: boolean,
  isSelected: boolean,
  isToday: boolean,
) => {
  if (isDisabled) {
    return "text-(--color-gray-200)";
  } else if (isWeekend) {
    return "text-(--color-red-500)";
  } else if (isSelected || isToday) {
    return "text-(--color-text-inverse)";
  }
  return "text-(--color-text-base)";
};

export const getTopExpenses = (expenses: GroupExpenseItem[]) => {
  return expenses
    .slice()
    .sort((a, b) => Number(b.cost ?? 0) - Number(a.cost ?? 0))
    .slice(0, 2);
};
