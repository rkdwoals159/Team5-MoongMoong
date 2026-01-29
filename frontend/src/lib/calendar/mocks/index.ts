import { expenseData } from "@/lib/calendar/mocks/calendarData";

export const getExpensesForDate = (dateKey: string) => expenseData[dateKey] ?? [];
