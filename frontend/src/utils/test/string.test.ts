import { describe, it, expect } from "vitest";
import { joinNonEmpty } from "../string";

describe("string utils", () => {
  describe("joinNonEmpty", () => {
    describe("기본 동작 (기본 구분자 ', ')", () => {
      it("유효한 문자열들을 쉼표로 연결", () => {
        expect(joinNonEmpty(["apple", "banana", "cherry"])).toBe("apple, banana, cherry");
      });

      it("null 값을 제외하고 연결", () => {
        expect(joinNonEmpty(["apple", null, "cherry"])).toBe("apple, cherry");
      });

      it("undefined 값을 제외하고 연결", () => {
        expect(joinNonEmpty(["apple", undefined, "cherry"])).toBe("apple, cherry");
      });

      it("빈 문자열을 제외하고 연결", () => {
        expect(joinNonEmpty(["apple", "", "cherry"])).toBe("apple, cherry");
      });

      it("공백만 있는 문자열을 제외하고 연결", () => {
        expect(joinNonEmpty(["apple", "   ", "cherry"])).toBe("apple, cherry");
      });

      it("여러 유효하지 않은 값을 모두 제외하고 연결", () => {
        expect(joinNonEmpty(["apple", null, "", "  ", undefined, "cherry"])).toBe("apple, cherry");
      });
    });

    describe("커스텀 구분자", () => {
      it("하이픈으로 연결", () => {
        expect(joinNonEmpty(["apple", "banana", "cherry"], "-")).toBe("apple-banana-cherry");
      });

      it("슬래시로 연결", () => {
        expect(joinNonEmpty(["2024", "01", "15"], "/")).toBe("2024/01/15");
      });

      it("공백으로 연결", () => {
        expect(joinNonEmpty(["hello", "world"], " ")).toBe("hello world");
      });

      it("빈 문자열 구분자로 연결", () => {
        expect(joinNonEmpty(["a", "b", "c"], "")).toBe("abc");
      });

      it("여러 문자 구분자로 연결", () => {
        expect(joinNonEmpty(["apple", "banana"], " and ")).toBe("apple and banana");
      });
    });

    describe("엣지 케이스", () => {
      it("빈 배열인 경우 빈 문자열 반환", () => {
        expect(joinNonEmpty([])).toBe("");
      });

      it("모든 값이 null인 경우 빈 문자열 반환", () => {
        expect(joinNonEmpty([null, null, null])).toBe("");
      });

      it("모든 값이 undefined인 경우 빈 문자열 반환", () => {
        expect(joinNonEmpty([undefined, undefined])).toBe("");
      });

      it("모든 값이 빈 문자열인 경우 빈 문자열 반환", () => {
        expect(joinNonEmpty(["", "", ""])).toBe("");
      });

      it("모든 값이 공백인 경우 빈 문자열 반환", () => {
        expect(joinNonEmpty(["  ", "   ", "    "])).toBe("");
      });

      it("단일 유효한 값만 있는 경우 해당 값 반환", () => {
        expect(joinNonEmpty(["apple"])).toBe("apple");
      });

      it("단일 유효한 값과 무효한 값들이 섞인 경우", () => {
        expect(joinNonEmpty([null, "apple", "", undefined])).toBe("apple");
      });
    });

    describe("문자열 변환", () => {
      it("숫자를 문자열로 변환하여 연결", () => {
        expect(joinNonEmpty(["1", "2", "3"])).toBe("1, 2, 3");
      });

      it("앞뒤 공백이 있는 문자열도 유효한 값으로 처리", () => {
        expect(joinNonEmpty(["  apple  ", "banana"])).toBe("  apple  , banana");
      });
    });

    describe("실제 사용 시나리오", () => {
      it("주소 정보 연결", () => {
        const address = joinNonEmpty(["서울시", "강남구", null, "테헤란로"], " ");
        expect(address).toBe("서울시 강남구 테헤란로");
      });

      it("이름 정보 연결", () => {
        const fullName = joinNonEmpty(["김", null, "철수"], "");
        expect(fullName).toBe("김철수");
      });

      it("태그 연결", () => {
        const tags = joinNonEmpty(["javascript", "", "react", "  ", "typescript"], ", ");
        expect(tags).toBe("javascript, react, typescript");
      });
    });
  });
});
