import { describe, it, expect } from "vitest";
import { formatRatio } from "@/app/(sidebar)/analysis/_utils";

describe("formatRatio", () => {
  describe("undefined 또는 null인 경우", () => {
    it("undefined인 경우 0을 반환한다", () => {
      expect(formatRatio(undefined)).toBe(0);
    });

    it("null인 경우 0을 반환한다", () => {
      expect(formatRatio(null as unknown as undefined)).toBe(0);
    });
  });

  describe("퍼센트 값 반올림 (API 스펙: 이미 퍼센트 값)", () => {
    it("0인 경우 0을 반환한다", () => {
      expect(formatRatio(0)).toBe(0);
    });

    it("42.3인 경우 42를 반환한다 (반올림)", () => {
      expect(formatRatio(42.3)).toBe(42);
    });

    it("42.5인 경우 43을 반환한다 (반올림)", () => {
      expect(formatRatio(42.5)).toBe(43);
    });

    it("87.6인 경우 88을 반환한다 (반올림)", () => {
      expect(formatRatio(87.6)).toBe(88);
    });

    it("100인 경우 100을 반환한다", () => {
      expect(formatRatio(100)).toBe(100);
    });

    it("0.5인 경우 1을 반환한다 (0.5% → 1%)", () => {
      expect(formatRatio(0.5)).toBe(1);
    });

    it("123.4인 경우 123을 반환한다 (반올림)", () => {
      expect(formatRatio(123.4)).toBe(123);
    });

    it("123.6인 경우 124를 반환한다 (반올림)", () => {
      expect(formatRatio(123.6)).toBe(124);
    });
  });
});
