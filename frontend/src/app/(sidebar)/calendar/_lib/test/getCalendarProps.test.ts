import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCalendarPageProps } from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import { CalendarSearchParams, GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";

describe("getCalendarPageProps", () => {
  describe("기본 구조", () => {
    it("headerProps, gridProps, modalProps를 반환한다", () => {
      const result = getCalendarPageProps({}, {});

      expect(result).toHaveProperty("headerProps");
      expect(result).toHaveProperty("gridProps");
      expect(result).toHaveProperty("modalProps");
    });
  });

  describe("headerProps (현재 월)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 10)); // 2026-02-10
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("headerProps가 올바른 형식으로 생성됨 (현재 월)", () => {
      const result = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result.headerProps.label).toBe("2026년 2월");
      expect(result.headerProps.isCurrentMonth).toBe(true);
      expect(result.headerProps.prevMonthParam).toBe("2026-01");
      expect(result.headerProps.todayMonthParam).toBe("2026-02");
      expect(result.headerProps.nextMonthParam).toBe("2026-03");
      expect(result.headerProps.todayDateParam).toBe("2026-02-10");
    });
  });

  describe("headerProps (다른 월)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 10)); // 2026-03-10
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("headerProps가 올바른 형식으로 생성됨 (다른 월)", () => {
      const result = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result.headerProps.label).toBe("2026년 2월");
      expect(result.headerProps.isCurrentMonth).toBe(false);
      expect(result.headerProps.prevMonthParam).toBe("2026-01");
      expect(result.headerProps.todayMonthParam).toBe("2026-03");
      expect(result.headerProps.nextMonthParam).toBe("2026-03");
      expect(result.headerProps.todayDateParam).toBe("2026-03-10");
    });
  });

  describe("gridProps", () => {
    it("buildCalendarDays 결과를 포함", () => {
      const result = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result.gridProps.days).toBeDefined();
      expect(Array.isArray(result.gridProps.days)).toBe(true);
      expect(result.gridProps.weeks).toBeDefined();
      expect(result.gridProps.selectedDate).toBeNull();
      expect(result.gridProps.monthParam).toBe("2026-02");
    });
  });

  describe("modalProps", () => {
    it("selected가 없을 때 modalTitle이 빈 문자열", () => {
      const result = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result.modalProps.modalTitle).toBe("");
    });

    it("modalProps가 올바른 형식으로 생성됨 (selected가 있을 때)", () => {
      const result = getCalendarPageProps({ month: "2026-02", selected: "2026-02-15" }, {});

      expect(result.modalProps.modalTitle).toBe("2026년 2월 15일 (일)");
      expect(result.modalProps.closeHref).toContain("month=2026-02");
      expect(result.modalProps.closeHref).toContain("selected=2026-02-15");
    });

    it("modalProps가 올바른 형식으로 생성됨 (selected가 없을 때)", () => {
      const result = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result.modalProps.closeHref).toBe("?month=2026-02");
    });

    it("modalProps가 올바른 형식으로 생성됨 (open이 있을 때)", () => {
      const result1 = getCalendarPageProps({ month: "2026-02", open: "1" }, {});
      const result2 = getCalendarPageProps({ month: "2026-02" }, {});

      expect(result1.modalProps.isModalOpen).toBe(true);
      expect(result2.modalProps.isModalOpen).toBe(false);
    });
  });

  describe("통합 시나리오", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 10)); // 2026-02-10
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("모든 파라미터가 조합되어 올바르게 동작", () => {
      const searchParams: CalendarSearchParams = {
        month: "2026-02",
        selected: "2026-02-15",
        open: "1",
      };

      const expenseMap: GroupExpenseMap = {
        "2026-02-15": [{ expenseId: 1, cost: 10000, mainCategory: "사료" }],
      };

      const result = getCalendarPageProps(searchParams, expenseMap);

      // headerProps 검증
      expect(result.headerProps.label).toBe("2026년 2월");
      expect(result.headerProps.isCurrentMonth).toBe(true);
      expect(result.headerProps.prevMonthParam).toBe("2026-01");
      expect(result.headerProps.nextMonthParam).toBe("2026-03");
      expect(result.headerProps.todayMonthParam).toBe("2026-02");
      expect(result.headerProps.todayDateParam).toBe("2026-02-10");

      // gridProps 검증
      expect(result.gridProps.selectedDate).toBe("2026-02-15");
      expect(result.gridProps.monthParam).toBe("2026-02");
      const feb15 = result.gridProps.days.find((d) => d.date === "2026-02-15");
      expect(feb15?.expenses).toHaveLength(1);

      // modalProps 검증
      expect(result.modalProps.isModalOpen).toBe(true);
      expect(result.modalProps.selectedDate).toBe("2026-02-15");
      expect(result.modalProps.modalTitle).toBe("2026년 2월 15일 (일)");
      expect(result.modalProps.closeHref).toBe("?month=2026-02&selected=2026-02-15");
    });

    it("빈 searchParams로도 정상 동작", () => {
      const result = getCalendarPageProps({}, {});

      expect(result.headerProps.label).toBe("2026년 2월");
      expect(result.gridProps.selectedDate).toBeNull();
      expect(result.modalProps.isModalOpen).toBe(false);
      expect(result.modalProps.modalTitle).toBe("");
    });

    it("다른 월을 보면서 날짜를 선택한 시나리오", () => {
      // 3월을 보고 있음
      const result = getCalendarPageProps(
        { month: "2026-03", selected: "2026-03-20", open: "1" },
        {},
      );

      expect(result.headerProps.label).toBe("2026년 3월");
      expect(result.headerProps.isCurrentMonth).toBe(false); // 3월은 현재 월 아님
      expect(result.gridProps.selectedDate).toBe("2026-03-20");
      expect(result.modalProps.isModalOpen).toBe(true);
      expect(result.modalProps.modalTitle).toBe("2026년 3월 20일 (금)");
    });
  });
});
