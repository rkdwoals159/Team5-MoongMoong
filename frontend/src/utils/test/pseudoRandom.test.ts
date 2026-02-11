import { describe, it, expect } from "vitest";
import { pseudoRandom } from "@/utils/pseudoRandom";

describe("pseudoRandom utils", () => {
  describe("기본 동작", () => {
    it("0과 1 사이의 값을 반환", () => {
      const result = pseudoRandom(1);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("같은 시드에 대해 항상 같은 값을 반환 (결정적)", () => {
      const seed = 42;
      const result1 = pseudoRandom(seed);
      const result2 = pseudoRandom(seed);
      const result3 = pseudoRandom(seed);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("다른 시드에 대해 다른 값을 반환", () => {
      const result1 = pseudoRandom(1);
      const result2 = pseudoRandom(2);
      const result3 = pseudoRandom(3);

      expect(result1).not.toBe(result2);
      expect(result2).not.toBe(result3);
      expect(result1).not.toBe(result3);
    });
  });

  describe("다양한 시드 값", () => {
    it("양수 시드에 대해 유효한 값 반환", () => {
      const result = pseudoRandom(100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("음수 시드에 대해 유효한 값 반환", () => {
      const result = pseudoRandom(-50);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("0 시드에 대해 유효한 값 반환", () => {
      const result = pseudoRandom(0);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("큰 수 시드에 대해 유효한 값 반환", () => {
      const result = pseudoRandom(999999);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("소수 시드에 대해 유효한 값 반환", () => {
      const result = pseudoRandom(3.14159);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe("일관성 검증", () => {
    it("연속된 시드에 대해 서로 다른 값 생성", () => {
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(pseudoRandom(i));
      }

      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(10);
    });

    it("특정 시드 값에 대해 예상되는 범위의 값 반환", () => {
      const iterations = 100;
      const results = [];

      for (let i = 1; i <= iterations; i++) {
        const value = pseudoRandom(i);
        results.push(value);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }

      expect(results.length).toBe(iterations);
    });
  });
});
