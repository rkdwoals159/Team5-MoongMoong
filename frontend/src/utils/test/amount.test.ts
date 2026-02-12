import { describe, it, expect } from "vitest";
import { formatAmount, formatAmountPlain, parseAmountPlain } from "@/utils/amount";

describe("amount utils", () => {
  describe("formatAmount", () => {
    it("숫자를 3자리 콤마 형식으로 변환", () => {
      expect(formatAmount(1000)).toBe("1,000원");
    });

    it("0을 콤마 없이 변환", () => {
      expect(formatAmount(0)).toBe("0원");
    });

    it("큰 숫자를 콤마 형식으로 변환", () => {
      expect(formatAmount(123456789)).toBe("123,456,789원");
    });
  });

  describe("formatAmountPlain", () => {
    it("숫자를 3자리 콤마 형식으로 변환", () => {
      expect(formatAmountPlain(1000)).toBe("1,000");
    });

    it("0을 콤마 없이 변환", () => {
      expect(formatAmountPlain(0)).toBe("0");
    });

    it("큰 숫자를 콤마 형식으로 변환", () => {
      expect(formatAmountPlain(123456789)).toBe("123,456,789");
    });
  });

  describe("parseAmountPlain", () => {
    it("숫자를 3자리 콤마 형식으로 변환", () => {
      expect(parseAmountPlain("1,000")).toBe(1000);
    });

    it("0을 콤마 없이 변환", () => {
      expect(parseAmountPlain("0")).toBe(0);
    });

    it("큰 숫자를 콤마 형식으로 변환", () => {
      expect(parseAmountPlain("123,456,789")).toBe(123456789);
    });
  });
});
