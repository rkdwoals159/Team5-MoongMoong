import { describe, it, expect } from "vitest";
import { getDateTextColor, getTopExpenses } from "@/app/(sidebar)/calendar/_utils";

describe("conditionalStyles", () => {
  describe("getDateTextColor", () => {
    it("isDisabled가 true일 때, 텍스트 색상을 반환", () => {
      expect(getDateTextColor(true, false, false, false)).toBe("text-(--color-gray-200)");
    });
    it("isWeekend가 true일 때, 텍스트 색상을 반환", () => {
      expect(getDateTextColor(false, true, false, false)).toBe("text-(--color-red-500)");
    });
    it("isSelected가 true일 때, 텍스트 색상을 반환", () => {
      expect(getDateTextColor(false, false, true, false)).toBe("text-(--color-text-inverse)");
    });
    it("isToday가 true일 때, 텍스트 색상을 반환", () => {
      expect(getDateTextColor(false, false, false, true)).toBe("text-(--color-text-inverse)");
    });
    it("isDisabled, isWeekend, isSelected, isToday가 모두 false일 때, 텍스트 색상을 반환", () => {
      expect(getDateTextColor(false, false, false, false)).toBe("text-(--color-text-base)");
    });
  });

  describe("getTopExpenses", () => {
    it("expenses가 빈 배열일 때, 빈 배열을 반환", () => {
      expect(getTopExpenses([])).toEqual([]);
    });
    it("expenses가 2개 미만의 요소를 가질 때, 해당 요소들을 그대로 반환", () => {
      expect(
        getTopExpenses([
          {
            expenseId: 1,
            spendAt: "2026-01-01",
            nickName: "expense1",
            usage: "expense1",
            cost: 100,
            mainCategory: "expense1",
            subCategory: "expense1",
            memo: "expense1",
            modifiedAt: "2026-01-01",
          },
        ]),
      ).toEqual([
        {
          expenseId: 1,
          spendAt: "2026-01-01",
          nickName: "expense1",
          usage: "expense1",
          cost: 100,
          mainCategory: "expense1",
          subCategory: "expense1",
          memo: "expense1",
          modifiedAt: "2026-01-01",
        },
      ]);
    });
    it("expenses가 2개 이상의 요소를 가질 때, 첫 번째 요소를 반환", () => {
      expect(
        getTopExpenses([
          {
            expenseId: 1,
            spendAt: "2026-01-01",
            nickName: "expense1",
            usage: "expense1",
            cost: 100,
            mainCategory: "expense1",
            subCategory: "expense1",
            memo: "expense1",
            modifiedAt: "2026-01-01",
          },
          {
            expenseId: 2,
            spendAt: "2026-01-02",
            nickName: "expense2",
            usage: "expense2",
            cost: 200,
            mainCategory: "expense2",
            subCategory: "expense2",
            memo: "expense2",
            modifiedAt: "2026-01-02",
          },
          {
            expenseId: 3,
            spendAt: "2026-01-03",
            nickName: "expense3",
            usage: "expense3",
            cost: 300,
            mainCategory: "expense3",
            subCategory: "expense3",
            memo: "expense3",
            modifiedAt: "2026-01-03",
          },
        ]),
      ).toEqual([
        {
          expenseId: 3,
          spendAt: "2026-01-03",
          nickName: "expense3",
          usage: "expense3",
          cost: 300,
          mainCategory: "expense3",
          subCategory: "expense3",
          memo: "expense3",
          modifiedAt: "2026-01-03",
        },
        {
          expenseId: 2,
          spendAt: "2026-01-02",
          nickName: "expense2",
          usage: "expense2",
          cost: 200,
          mainCategory: "expense2",
          subCategory: "expense2",
          memo: "expense2",
          modifiedAt: "2026-01-02",
        },
      ]);
    });
  });
});
