import { describe, it, expect } from "vitest";
import { clamp, formatCreatedAt, calcProgress } from "@/app/(sidebar)/saving/_utils/savingUtil";

describe("saving utils", () => {
  describe("clamp", () => {
    it("범위 내 값은 그대로 반환", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it("min보다 작은 값은 min으로 클램핑", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it("max보다 큰 값은 max로 클램핑", () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it("min과 동일한 값은 그대로 반환", () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it("max와 동일한 값은 그대로 반환", () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it("min > max일 때 min 값을 반환", () => {
      expect(clamp(5, 10, 0)).toBe(5);
    });
  });

  describe("formatCreatedAt", () => {
    it("유효한 ISO 문자열을 한국어 날짜 형식으로 변환", () => {
      const result = formatCreatedAt("2025-01-15T09:30:00Z");

      expect(result).toContain("2025");
      expect(result).toContain("1");
      expect(result).toContain("15");
    });

    it("유효하지 않은 문자열 입력 시 원본 반환", () => {
      expect(formatCreatedAt("invalid-date")).toBe("invalid-date");
    });

    it("빈 문자열 입력 시 빈 문자열 반환", () => {
      expect(formatCreatedAt("")).toBe("");
    });
  });

  describe("calcProgress", () => {
    it("일반 진행률 계산 (50/100 → 50)", () => {
      expect(calcProgress(50, 100)).toBe(50);
    });

    it("100% 도달 (100/100 → 100)", () => {
      expect(calcProgress(100, 100)).toBe(100);
    });

    it("초과 저금 시 100으로 상한 클램핑 (150/100 → 100)", () => {
      expect(calcProgress(150, 100)).toBe(100);
    });

    it("target이 0이면 0 반환 (0 나눗셈 방지)", () => {
      expect(calcProgress(50, 0)).toBe(0);
    });

    it("total이 0이면 0 반환", () => {
      expect(calcProgress(0, 100)).toBe(0);
    });

    it("음수 total 입력 시 0 반환", () => {
      expect(calcProgress(-50, 100)).toBe(0);
    });

    it("음수 target 입력 시 0 반환", () => {
      expect(calcProgress(50, -100)).toBe(0);
    });
  });
});
