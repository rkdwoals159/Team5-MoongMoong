import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCalendarPageProps } from "@/app/(sidebar)/calendar/_lib/getCalendarProps";
import type { CalendarSearchParams, GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";

describe("getCalendarPageProps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 10));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("headerProps와 gridProps를 반환한다", () => {
    const result = getCalendarPageProps({}, {});

    expect(result).toHaveProperty("headerProps");
    expect(result).toHaveProperty("gridProps");
    expect(result).not.toHaveProperty("modalProps");
  });

  it("현재 월이면 isCurrentMonth가 true다", () => {
    const result = getCalendarPageProps({ month: "2026-02" }, {});

    expect(result.headerProps.label).toBe("2026년 2월");
    expect(result.headerProps.isCurrentMonth).toBe(true);
    expect(result.headerProps.prevMonthParam).toBe("2026-01");
    expect(result.headerProps.todayMonthParam).toBe("2026-02");
    expect(result.headerProps.nextMonthParam).toBe("2026-03");
    expect(result.headerProps.todayDateParam).toBe("2026-02-10");
  });

  it("다른 월이면 isCurrentMonth가 false다", () => {
    const result = getCalendarPageProps({ month: "2026-03" }, {});

    expect(result.headerProps.label).toBe("2026년 3월");
    expect(result.headerProps.isCurrentMonth).toBe(false);
  });

  it("selected가 현재 월에 포함될 때만 유지한다", () => {
    const result = getCalendarPageProps({ month: "2026-02", selected: "2026-02-15" }, {});

    expect(result.gridProps.selectedDate).toBe("2026-02-15");
  });

  it("selected가 현재 월 바깥이거나 형식이 잘못되면 null이다", () => {
    const outOfMonth = getCalendarPageProps({ month: "2026-02", selected: "2026-03-01" }, {});
    const invalidFormat = getCalendarPageProps({ month: "2026-02", selected: "2026/02/15" }, {});

    expect(outOfMonth.gridProps.selectedDate).toBeNull();
    expect(invalidFormat.gridProps.selectedDate).toBeNull();
  });

  it("현재 월 날짜에만 expenseMap을 매핑한다", () => {
    const searchParams: CalendarSearchParams = {
      month: "2026-05",
      selected: "2026-05-15",
    };

    const expenseMap: GroupExpenseMap = {
      "2026-05-15": [{ expenseId: 1, cost: 10000, mainCategory: "사료" }],
      "2026-04-30": [{ expenseId: 2, cost: 5000, mainCategory: "간식" }],
    };

    const result = getCalendarPageProps(searchParams, expenseMap);
    const may15 = result.gridProps.days.find((d) => d.date === "2026-05-15");
    const apr30 = result.gridProps.days.find((d) => d.date === "2026-04-30");

    expect(may15?.expenses).toHaveLength(1);
    expect(apr30?.inCurrentMonth).toBe(false);
    expect(apr30?.expenses).toEqual([]);
  });
});
