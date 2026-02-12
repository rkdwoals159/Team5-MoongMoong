import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountUp } from "../useCountUp";

describe("useCountUp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let currentTime = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      currentTime += 100;
      setTimeout(() => cb(currentTime), 0);
      return currentTime;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("disabled=true이면 즉시 target 값 반환", () => {
    const { result } = renderHook(() => useCountUp(500, { disabled: true }));

    expect(result.current).toBe(500);
  });

  it("target=0이면 0 반환", () => {
    const { result } = renderHook(() => useCountUp(0));

    expect(result.current).toBe(0);
  });

  it("애니메이션 완료 후 target 값에 도달", () => {
    const { result } = renderHook(() => useCountUp(1000, { duration: 800 }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(1000);
  });
});
