import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildCalendarDays } from "@/app/(sidebar)/calendar/_lib/buildCalendarDays";
import { GroupExpenseMap } from "@/app/(sidebar)/calendar/_types";

describe("buildCalendarDays", () => {
  describe("기본 구조", () => {
    it("days 배열과 weeks 수를 반환한다", () => {
      const result = buildCalendarDays(2026, 1, {}); // 2026년 2월

      expect(result).toHaveProperty("days");
      expect(result).toHaveProperty("weeks");

      expect(Array.isArray(result.days)).toBe(true);
    });

    it("days 배열 길이는 weeks * 7과 같다", () => {
      const result = buildCalendarDays(2026, 1, {});

      expect(result.days.length).toBe(result.weeks * 7);
    });

    it("weeks는 5 또는 6이다", () => {
      const result = buildCalendarDays(2026, 1, {});

      expect([5, 6]).toContain(result.weeks);
    });
  });

  describe("주 수 계산", () => {
    it("2026년 2월은 5주(35칸)를 생성한다", () => {
      // 2026년 2월 1일 = 일요일, 28일까지
      const result = buildCalendarDays(2026, 1, {});

      expect(result.weeks).toBe(5);
      expect(result.days.length).toBe(35);
    });

    it("2026년 5월은 6주(42칸)를 생성한다", () => {
      // 2026년 5월 1일 = 금요일, 31일까지
      const result = buildCalendarDays(2026, 4, {});

      expect(result.weeks).toBe(6);
      expect(result.days.length).toBe(42);
    });
  });

  describe("날짜 경계 검증", () => {
    it("2026년 5월 첫 번째 셀은 이전 월(4월) 날짜들이다", () => {
      // 2026년 5월 1일 = 금요일 (index 5)
      // 첫 5칸은 4월 26, 27, 28, 29, 30일
      const result = buildCalendarDays(2026, 4, {});

      expect(result?.days[0]?.date).toBe("2026-04-26");
      expect(result?.days[1]?.date).toBe("2026-04-27");
      expect(result?.days[2]?.date).toBe("2026-04-28");
      expect(result?.days[3]?.date).toBe("2026-04-29");
      expect(result?.days[4]?.date).toBe("2026-04-30");
      expect(result?.days[0]?.inCurrentMonth).toBe(false);
    });

    it("2026년 2월 1일은 첫 번째 셀(index 0)이다 - 일요일 시작", () => {
      const result = buildCalendarDays(2026, 1, {});

      expect(result?.days[0]?.date).toBe("2026-02-01");
      expect(result?.days[0]?.dayNumber).toBe(1);
      expect(result?.days[0]?.inCurrentMonth).toBe(true);
    });

    it("2026년 2월 마지막 날(28일) 이후는 다음 월(3월) 날짜들이다", () => {
      const result = buildCalendarDays(2026, 1, {});
      const feb28Index = result.days.findIndex((d) => d.date === "2026-02-28");

      expect(result?.days[feb28Index + 1]?.date).toBe("2026-03-01");
      expect(result?.days[feb28Index + 1]?.inCurrentMonth).toBe(false);
      expect(result?.days[feb28Index + 2]?.date).toBe("2026-03-02");
    });
  });

  describe("inCurrentMonth 플래그", () => {
    it("현재 월의 날짜만 true이다", () => {
      const result = buildCalendarDays(2026, 1, {}); // 2026년 2월

      // 2월 1일~28일까지만 true
      const feb1Index = result.days.findIndex((d) => d.date === "2026-02-01");
      const feb28Index = result.days.findIndex((d) => d.date === "2026-02-28");

      // 현재 월 (2026년 2월은 일요일 시작이므로 첫 번째 셀이 2월 1일)
      expect(result?.days[feb1Index]?.inCurrentMonth).toBe(true);
      expect(result?.days[feb28Index]?.inCurrentMonth).toBe(true);

      // 다음 월
      expect(result?.days[feb28Index + 1]?.inCurrentMonth).toBe(false);
    });
  });

  describe("isWeekend 플래그", () => {
    it("일요일과 토요일만 true이다", () => {
      // 2026년 2월 1일 = 일요일, 7일 = 토요일, 2일 = 월요일
      const result = buildCalendarDays(2026, 1, {});

      const sunIndex = result.days.findIndex((d) => d.date === "2026-02-01");
      const monIndex = result.days.findIndex((d) => d.date === "2026-02-02");
      const satIndex = result.days.findIndex((d) => d.date === "2026-02-07");

      expect(result?.days[sunIndex]?.isWeekend).toBe(true);
      expect(result?.days[satIndex]?.isWeekend).toBe(true);
      expect(result?.days[monIndex]?.isWeekend).toBe(false);
    });
  });

  describe("expenses 매핑", () => {
    it("빈 expenseMap일 때 모든 expenses가 빈 배열이다", () => {
      const result = buildCalendarDays(2026, 1, {});

      result.days.forEach((day) => {
        if (day.inCurrentMonth) {
          expect(day.expenses).toEqual([]);
        }
      });
    });

    it("특정 날짜에만 expenses가 매핑된다", () => {
      const expenseMap: GroupExpenseMap = {
        "2026-02-15": [{ expenseId: 1, cost: 10000, mainCategory: "사료" }],
        "2026-02-20": [{ expenseId: 2, cost: 5000, mainCategory: "간식" }],
      };

      const result = buildCalendarDays(2026, 1, expenseMap);

      const feb15 = result.days.find((d) => d.date === "2026-02-15");
      const feb20 = result.days.find((d) => d.date === "2026-02-20");
      const feb10 = result.days.find((d) => d.date === "2026-02-10");

      expect(feb15?.expenses).toHaveLength(1);
      expect(feb15?.expenses?.[0]?.cost).toBe(10000);
      expect(feb20?.expenses).toHaveLength(1);
      expect(feb10?.expenses).toEqual([]);
    });

    it("이전/다음 월 날짜에는 expenses가 매핑되지 않는다", () => {
      const expenseMap: GroupExpenseMap = {
        "2026-04-30": [{ expenseId: 1, cost: 10000, mainCategory: "사료" }],
        "2026-06-01": [{ expenseId: 2, cost: 5000, mainCategory: "간식" }],
      };

      const result = buildCalendarDays(2026, 4, expenseMap); // 2026년 5월

      const apr30 = result.days.find((d) => d.date === "2026-04-30");
      const jun01 = result.days.find((d) => d.date === "2026-06-01");

      // inCurrentMonth가 false이므로 expenses 안 들어감
      expect(apr30?.inCurrentMonth).toBe(false);
      expect(apr30?.expenses).toEqual([]);
      expect(jun01?.inCurrentMonth).toBe(false);
      expect(jun01?.expenses).toEqual([]);
    });
  });

  describe("isToday 플래그 (시스템 시간 모킹)", () => {
    beforeEach(() => {
      // 시스템 시간을 2026-02-15로 고정
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 15)); // 2026년 2월 15일
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("오늘 날짜만 isToday가 true이다", () => {
      const result = buildCalendarDays(2026, 1, {});

      const feb15 = result.days.find((d) => d.date === "2026-02-15");
      const feb14 = result.days.find((d) => d.date === "2026-02-14");
      const feb16 = result.days.find((d) => d.date === "2026-02-16");

      expect(feb15?.isToday).toBe(true);
      expect(feb14?.isToday).toBe(false);
      expect(feb16?.isToday).toBe(false);
    });
  });

  describe("dayNumber 필드", () => {
    it("각 날짜의 dayNumber가 올바르다", () => {
      const result = buildCalendarDays(2026, 1, {});

      const feb1 = result.days.find((d) => d.date === "2026-02-01");
      const feb15 = result.days.find((d) => d.date === "2026-02-15");
      const mar01 = result.days.find((d) => d.date === "2026-03-01");

      expect(feb1?.dayNumber).toBe(1);
      expect(feb15?.dayNumber).toBe(15);
      expect(mar01?.dayNumber).toBe(1);
    });
  });
});
