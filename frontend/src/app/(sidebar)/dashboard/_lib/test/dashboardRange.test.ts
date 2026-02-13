import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveDashboardRange } from "@/app/(sidebar)/dashboard/_lib/dashboardRange";
import { formatDateKey } from "@/utils/date";

describe("resolveDashboardRange", () => {
  describe("기본 동작 테스트", () => {
    it("파라미터가 없을 때 기본값(현재 ~ 한 달 후)을 반환한다", () => {
      const result = resolveDashboardRange({});

      const now = new Date();
      const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const expectedStart = formatDateKey(now);
      const expectedEnd = formatDateKey(oneMonthLater);

      expect(result.startDate).toBe(expectedStart);
      expect(result.endDate).toBe(expectedEnd);
    });

    it("유효한 날짜 파라미터를 제공하면 해당 값을 그대로 반환한다", () => {
      const params = {
        startDate: "2026-02-11",
        endDate: "2026-03-11",
      };

      const result = resolveDashboardRange(params);

      expect(result.startDate).toBe("2026-02-11");
      expect(result.endDate).toBe("2026-03-11");
    });
  });

  describe("부분 유효성 테스트", () => {
    it("startDate만 유효한 경우 startDate는 제공된 값, endDate는 기본값을 반환한다", () => {
      const now = new Date();
      const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const expectedEnd = formatDateKey(oneMonthLater);

      const result = resolveDashboardRange({
        startDate: "2026-02-11",
        endDate: null,
      });

      expect(result.startDate).toBe("2026-02-11");
      expect(result.endDate).toBe(expectedEnd);
    });

    it("endDate만 유효한 경우 startDate는 기본값, endDate는 제공된 값을 반환한다", () => {
      const now = new Date();
      const expectedStart = formatDateKey(now);

      const result = resolveDashboardRange({
        startDate: null,
        endDate: "2026-03-11",
      });

      expect(result.startDate).toBe(expectedStart);
      expect(result.endDate).toBe("2026-03-11");
    });
  });

  describe("통합 시나리오", () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it("실제 URL 파라미터 형식으로 날짜를 처리한다", () => {
      const params = {
        startDate: "2026-02-11",
        endDate: "2026-03-11",
      };

      const result = resolveDashboardRange(params);

      expect(result.startDate).toBe("2026-02-11");
      expect(result.endDate).toBe("2026-03-11");
    });

    it("빈 문자열은 무효한 값으로 처리된다", () => {
      const mockDate = new Date("2026-02-11T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      const result = resolveDashboardRange({
        startDate: "",
        endDate: "",
      });

      expect(result.startDate).toBe("2026-02-11");
      expect(result.endDate).toBe("2026-03-11");

      vi.useRealTimers();
    });
  });

  describe("로직 버그 검증", () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it("월말 날짜(1월 31일)에서 한 달 후가 두 달 후로 넘어가는 버그", () => {
      const mockDate = new Date("2024-01-31T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      const result = resolveDashboardRange({});

      expect(result.endDate).toBe("2024-02-29");

      vi.useRealTimers();
    });

    it("월말 날짜(3월 31일)에서 한 달 후가 5월 1일이 되는 버그", () => {
      const mockDate = new Date("2024-03-31T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      const result = resolveDashboardRange({});

      expect(result.endDate).toBe("2024-04-30");

      vi.useRealTimers();
    });

    it("startDate가 endDate보다 나중이어도 에러가 발생하지 않는다", () => {
      const result = resolveDashboardRange({
        startDate: "2024-12-31",
        endDate: "2024-01-01",
      });

      expect(result.startDate <= result.endDate).toBe(true);
    });
  });
});
