import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveAnalysisRange } from "@/app/(sidebar)/analysis/_lib/analysisRange";

describe("resolveAnalysisRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-11"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("유효한 startDate와 endDate가 제공되면 그대로 반환한다", () => {
    const result = resolveAnalysisRange({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
    });

    expect(result).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
    });
  });

  it("startDate가 없으면 현재 월의 시작일을 사용한다", () => {
    const result = resolveAnalysisRange({
      endDate: "2026-01-31",
    });

    expect(result).toEqual({
      startDate: "2026-02-01",
      endDate: "2026-01-31",
    });
  });

  it("endDate가 없으면 현재 월의 마지막일을 사용한다", () => {
    const result = resolveAnalysisRange({
      startDate: "2026-01-01",
    });

    expect(result).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-02-28",
    });
  });

  it("startDate와 endDate가 모두 없으면 현재 월 범위를 사용한다", () => {
    const result = resolveAnalysisRange({});

    expect(result).toEqual({
      startDate: "2026-02-01",
      endDate: "2026-02-28",
    });
  });

  it("유효하지 않은 날짜 형식이면 현재 월 범위를 사용한다", () => {
    const result = resolveAnalysisRange({
      startDate: "invalid-date",
      endDate: "invalid-date",
    });

    expect(result).toEqual({
      startDate: "2026-02-01",
      endDate: "2026-02-28",
    });
  });
});
