import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateUniqueId } from "@/utils/generateUniqueId";

describe("generateUniqueId utils", () => {
  describe("crypto.randomUUID가 사용 가능할 때", () => {
    it("문자열 타입의 고유 ID를 생성", () => {
      const id = generateUniqueId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("호출할 때마다 다른 ID를 생성", () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      const id3 = generateUniqueId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("UUID 형식의 ID를 생성", () => {
      const id = generateUniqueId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });
  });

  describe("crypto.randomUUID가 사용 불가능할 때", () => {
    let originalCrypto: Crypto;

    beforeEach(() => {
      originalCrypto = globalThis.crypto;
      Object.defineProperty(globalThis, "crypto", {
        value: {},
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(globalThis, "crypto", {
        value: originalCrypto,
        writable: true,
        configurable: true,
      });
    });

    it("Date.now 기반의 고유 ID를 생성", () => {
      const id = generateUniqueId();
      expect(typeof id).toBe("string");
      expect(id).toContain("-");
    });

    it("호출할 때마다 다른 ID를 생성", () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      const id3 = generateUniqueId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });
});
