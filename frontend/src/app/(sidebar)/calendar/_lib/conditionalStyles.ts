import { ExpenseItem } from "../_types";

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
export const getTopExpenses = (expenses: ExpenseItem[]) => {
  return expenses
    .slice()
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 2);
};
