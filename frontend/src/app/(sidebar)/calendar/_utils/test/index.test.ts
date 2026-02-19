import { describe, it, expect } from "vitest";
import type { GroupExpenseItem } from "@/app/(sidebar)/calendar/_types";
import {
  buildCalendarQuery,
  getCalendarGridRowHeight,
  getDateTextColor,
  getExpenseRowKey,
  getTopExpenses,
  getVisibleExpensesByLatest,
} from "@/app/(sidebar)/calendar/_utils";

function makeExpense(id: number, cost: number, modifiedAt = `2026-01-0${id}`): GroupExpenseItem {
  return {
    expenseId: id,
    spendAt: `2026-01-0${id}`,
    nickName: `expense-${id}`,
    usage: `usage-${id}`,
    cost,
    mainCategory: "기타",
    subCategory: "기타",
    memo: "",
    modifiedAt,
  };
}

describe("calendar utils", () => {
  describe("buildCalendarQuery", () => {
    it("month만 있을 때 month 쿼리만 만든다", () => {
      expect(buildCalendarQuery("2026-02")).toBe("?month=2026-02");
    });

    it("selected가 있으면 selected 쿼리를 함께 만든다", () => {
      expect(buildCalendarQuery("2026-02", "2026-02-10")).toBe(
        "?month=2026-02&selected=2026-02-10",
      );
    });
  });

  describe("getDateTextColor", () => {
    it("disabled가 최우선이다", () => {
      expect(getDateTextColor(true, true, true, true)).toBe("text-(--color-gray-200)");
    });

    it("선택/오늘이 주말보다 우선이다", () => {
      expect(getDateTextColor(false, true, true, false)).toBe("text-(--color-text-inverse)");
      expect(getDateTextColor(false, true, false, true)).toBe("text-(--color-text-inverse)");
    });

    it("선택/오늘이 없고 주말이면 weekend 색상이다", () => {
      expect(getDateTextColor(false, true, false, false)).toBe("text-(--color-red-500)");
    });

    it("기본값은 base 색상이다", () => {
      expect(getDateTextColor(false, false, false, false)).toBe("text-(--color-text-base)");
    });
  });

  describe("getTopExpenses", () => {
    it("비어 있으면 빈 배열이다", () => {
      expect(getTopExpenses([])).toEqual([]);
    });

    it("비용이 큰 순서로 기본 2개를 반환한다", () => {
      const expenses = [makeExpense(1, 100), makeExpense(2, 200), makeExpense(3, 300)];

      expect(getTopExpenses(expenses)).toEqual([makeExpense(3, 300), makeExpense(2, 200)]);
    });

    it("maxCount를 넘기면 해당 개수만 반환한다", () => {
      const expenses = [makeExpense(1, 100), makeExpense(2, 200), makeExpense(3, 300)];

      expect(getTopExpenses(expenses, 1)).toEqual([makeExpense(3, 300)]);
    });
  });

  describe("getVisibleExpensesByLatest", () => {
    it("modifiedAt 내림차순으로 정렬한다", () => {
      const expenses = [
        makeExpense(1, 100, "2026-02-01"),
        makeExpense(2, 100, "2026-02-03"),
        makeExpense(3, 100, "2026-02-02"),
      ];

      expect(getVisibleExpensesByLatest(expenses).map((expense) => expense.expenseId)).toEqual([
        2, 3, 1,
      ]);
    });

    it("modifiedAt이 같으면 expenseId 내림차순으로 정렬한다", () => {
      const expenses = [
        makeExpense(1, 100, "2026-02-01"),
        makeExpense(3, 100, "2026-02-01"),
        makeExpense(2, 100, "2026-02-01"),
      ];

      expect(getVisibleExpensesByLatest(expenses).map((expense) => expense.expenseId)).toEqual([
        3, 2, 1,
      ]);
    });
  });

  describe("getExpenseRowKey", () => {
    it("expenseId와 modifiedAt을 조합해서 row key를 만든다", () => {
      const expense = makeExpense(5, 100, "2026-02-11");

      expect(getExpenseRowKey(expense, 0)).toBe("5-2026-02-11");
    });
  });

  describe("getCalendarGridRowHeight", () => {
    it("4주차 달력은 compact 모드가 아니며 160px 상한을 가진다", () => {
      const result = getCalendarGridRowHeight(4);

      expect(result.isCompact).toBe(false);
      expect(result.minRowHeight).toBe(90);
      expect(result.maxRowHeight).toBe(160);
      expect(result.rowHeight).toBe("clamp(90px, calc((100vh - 260px) / 4), 160px)");
    });

    it("5주차 달력은 compact 모드가 아니며 136px 상한을 가진다", () => {
      const result = getCalendarGridRowHeight(5);

      expect(result.isCompact).toBe(false);
      expect(result.minRowHeight).toBe(90);
      expect(result.maxRowHeight).toBe(136);
      expect(result.rowHeight).toBe("clamp(90px, calc((100vh - 260px) / 5), 136px)");
    });

    it("6주차 달력은 compact 모드이며 120px 상한을 가진다", () => {
      const result = getCalendarGridRowHeight(6);

      expect(result.isCompact).toBe(true);
      expect(result.minRowHeight).toBe(100);
      expect(result.maxRowHeight).toBe(120);
      expect(result.rowHeight).toBe("clamp(100px, calc((100vh - 260px) / 6), 120px)");
    });
  });
});
