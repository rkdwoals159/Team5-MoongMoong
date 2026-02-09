import { describe, it, expect } from "vitest";
import {
  formatDateKey,
  formatFullDateLabel,
  formatMonthLabel,
  isSameMonth,
  shiftDateByDays,
} from "../date";

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

  describe("shiftDateByDays", () => {
    it("일을 추가하여 날짜 이동", () => {
      expect(shiftDateByDays("2024-01-15", 5)).toBe("2024-01-20");
    });

    it("일을 빼서 날짜 이동", () => {
      expect(shiftDateByDays("2024-01-15", -5)).toBe("2024-01-10");
    });
  });
});
