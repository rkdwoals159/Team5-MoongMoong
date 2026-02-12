import { describe, it, expect } from "vitest";
import { isDifferentArray } from "../isDifferentArray";

describe("isDifferentArray utils", () => {
  describe("배열 길이가 다른 경우", () => {
    it("첫 번째 배열이 더 긴 경우 true 반환", () => {
      expect(isDifferentArray([1, 2, 3], [1, 2])).toBe(true);
    });

    it("두 번째 배열이 더 긴 경우 true 반환", () => {
      expect(isDifferentArray([1, 2], [1, 2, 3])).toBe(true);
    });

    it("빈 배열과 비어있지 않은 배열 비교 시 true 반환", () => {
      expect(isDifferentArray([], [1])).toBe(true);
      expect(isDifferentArray([1], [])).toBe(true);
    });
  });

  describe("배열 길이가 같지만 내용이 다른 경우", () => {
    it("일부 요소가 다른 경우 true 반환", () => {
      expect(isDifferentArray([1, 2, 3], [1, 2, 4])).toBe(true);
    });

    it("순서가 다른 경우 true 반환", () => {
      expect(isDifferentArray([1, 2, 3], [3, 2, 1])).toBe(true);
    });

    it("타입이 다른 경우 true 반환", () => {
      expect(isDifferentArray([1, 2], ["1", "2"])).toBe(true);
    });
  });

  describe("배열이 동일한 경우", () => {
    it("같은 숫자 배열 비교 시 false 반환", () => {
      expect(isDifferentArray([1, 2, 3], [1, 2, 3])).toBe(false);
    });

    it("같은 문자열 배열 비교 시 false 반환", () => {
      expect(isDifferentArray(["a", "b", "c"], ["a", "b", "c"])).toBe(false);
    });

    it("빈 배열 비교 시 false 반환", () => {
      expect(isDifferentArray([], [])).toBe(false);
    });

    it("단일 요소 배열 비교 시 false 반환", () => {
      expect(isDifferentArray([1], [1])).toBe(false);
    });
  });

  describe("기본값 처리", () => {
    it("첫 번째 인자가 없는 경우 빈 배열로 처리", () => {
      expect(isDifferentArray(undefined, [])).toBe(false);
    });

    it("두 번째 인자가 없는 경우 빈 배열로 처리", () => {
      expect(isDifferentArray([], undefined)).toBe(false);
    });

    it("두 인자 모두 없는 경우 false 반환", () => {
      expect(isDifferentArray()).toBe(false);
    });
  });

  describe("다양한 타입의 배열", () => {
    it("객체 배열 비교", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };

      expect(isDifferentArray([obj1], [obj1])).toBe(false);
      expect(isDifferentArray([obj1], [obj2])).toBe(true);
    });

    it("혼합 타입 배열 비교", () => {
      expect(isDifferentArray([1, "a", true], [1, "a", true])).toBe(false);
      expect(isDifferentArray([1, "a", true], [1, "a", false])).toBe(true);
    });

    it("null/undefined 포함 배열 비교", () => {
      expect(isDifferentArray([null, undefined], [null, undefined])).toBe(false);
      expect(isDifferentArray([null], [undefined])).toBe(true);
    });
  });
});
