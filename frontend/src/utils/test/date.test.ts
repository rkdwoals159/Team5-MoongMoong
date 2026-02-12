import { describe, it, expect } from "vitest";
import {
  formatDateKey,
  formatDateWithDots,
  formatDateWithWeekday,
  formatFullDateLabel,
  formatMonthLabel,
  isDateInMonth,
  isSameMonth,
  resolveMonthRange,
  shiftByUnit,
  shiftDateByDays,
  shiftDateByMonths,
  clampDate,
} from "@/utils/date";

describe("date utils", () => {
  describe("formatDateKey", () => {
    it("Date를 YYYY-MM-DD 형식으로 변환", () => {
      const date = new Date(2024, 0, 15);
      expect(formatDateKey(date)).toBe("2024-01-15");
    });

    it("단일 자리 월과 일을 0으로 채움", () => {
      const date = new Date(2024, 0, 5);
      expect(formatDateKey(date)).toBe("2024-01-05");
    });
  });

  describe("formatMonthLabel", () => {
    it("년·월을 'YYYY년 MM월' 형식으로 포맷", () => {
      expect(formatMonthLabel(2024, 0)).toBe("2024년 1월");
    });
  });

  describe("formatFullDateLabel", () => {
    it("dateKey를 'YYYY년 M월 D일 (요일)' 형식으로 포맷", () => {
      expect(formatFullDateLabel("2026-01-15")).toBe("2026년 1월 15일 (목)");
    });
  });

  describe("isSameMonth", () => {
    it("주어진 년·월과 compare Date가 같은 월인지 여부", () => {
      expect(isSameMonth(2024, 0, new Date(2024, 0, 15))).toBe(true);
      expect(isSameMonth(2024, 0, new Date(2024, 1, 15))).toBe(false);
    });
  });

  describe("isDateInMonth", () => {
    it("dateKey가 주어진 년,월에 속하는지 여부", () => {
      expect(isDateInMonth("2024-01-15", 2024, 0)).toBe(true);
      expect(isDateInMonth("2024-02-15", 2024, 1)).toBe(true);
      expect(isDateInMonth("2024-02-15", 2024, 2)).toBe(false);
    });
  });

  describe("resolveMonthRange", () => {
    it("monthParam에 해당하는 월의 시작일·마지막일을 dateKey로 반환", () => {
      expect(resolveMonthRange("2024-01")).toEqual({
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      });
    });
  });

  describe("formatDateWithDots", () => {
    it("dateKey를 YYYY.MM.DD 형식으로 변환", () => {
      expect(formatDateWithDots("2024-01-15")).toBe("2024.01.15");
    });
  });

  describe("formatDateWithWeekday", () => {
    it("dateKey를 YYYY.MM.DD (요일) 형식으로 변환", () => {
      expect(formatDateWithWeekday("2026-02-09")).toBe("2026.02.09 (월)");
    });
  });

  describe("shiftDateByDays", () => {
    it("일을 추가하여 날짜 이동", () => {
      expect(shiftDateByDays("2026-02-09", 5)).toBe("2026-02-14");
    });

    it("일을 빼서 날짜 이동", () => {
      expect(shiftDateByDays("2026-02-01", -5)).toBe("2026-01-27");
    });
  });

  describe("shiftDateByMonths", () => {
    it("월을 추가하여 날짜 이동", () => {
      expect(shiftDateByMonths("2026-02-09", 1)).toBe("2026-03-09");
    });

    it("월을 빼서 날짜 이동", () => {
      expect(shiftDateByMonths("2026-02-09", -1)).toBe("2026-01-09");
    });
  });

  describe("clampDate", () => {
    it("주어진 날짜를 주어진 최소·최대 날짜 사이에 있는지 여부", () => {
      expect(clampDate("2026-02-09", "2026-02-01", "2026-02-09")).toBe("2026-02-09");
      expect(clampDate("2026-02-15", "2026-02-01", "2026-02-09")).toBe("2026-02-09");
    });
  });

  describe("shiftByUnit", () => {
    it("일을 추가하여 날짜 이동", () => {
      expect(shiftByUnit("2026-02-09", "day", 5)).toBe("2026-02-14");
    });

    it("일을 빼서 날짜 이동", () => {
      expect(shiftByUnit("2026-02-09", "day", -5)).toBe("2026-02-04");
    });

    it("월을 추가하여 날짜 이동", () => {
      expect(shiftByUnit("2026-02-09", "month", 1)).toBe("2026-03-09");
    });
  });
});
