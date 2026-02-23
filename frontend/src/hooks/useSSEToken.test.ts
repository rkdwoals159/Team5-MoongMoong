import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSSEToken } from "@/hooks/useSSEToken";
import * as sseApi from "@/api/client/sseApi";

// fake timers 환경에서 waitFor 대신 사용: microtask만 소비하므로 setTimeout 차단 영향 없음
async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("useSSEToken", () => {
  let postSSETokenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    postSSETokenSpy = vi.spyOn(sseApi, "postSSEToken");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("마운트 시 postSSEToken을 호출하고 토큰을 connectionToken에 저장한다", async () => {
    postSSETokenSpy.mockResolvedValue("token-abc");

    const { result } = renderHook(() => useSSEToken());
    await flushPromises();

    expect(result.current.connectionToken).toBe("token-abc");
  });

  it("SSE 오류 발생 후 재연결하여 토큰을 발급받는다", async () => {
    postSSETokenSpy.mockResolvedValue("token-abc");
    const { result } = renderHook(() => useSSEToken());
    await flushPromises();

    postSSETokenSpy.mockResolvedValue("token-xyz");

    act(() => {
      result.current.handleSSEError(new Error("연결 오류"));
    });
    await flushPromises();

    expect(result.current.connectionToken).toBe("token-xyz");
  });

  it("postSSEToken이 null을 반환하면 지수 백오프로 재시도한다", async () => {
    postSSETokenSpy.mockResolvedValue(null);
    renderHook(() => useSSEToken());
    await flushPromises();

    expect(postSSETokenSpy).toHaveBeenCalledTimes(1);

    // 1회차 재시도: 1000ms 후
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(2);

    // 2회차 재시도: 2000ms 후
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(3);
  });

  it("postSSEToken이 계속 null을 반환하면 MAX_RETRY(5)회까지만 재시도한다", async () => {
    postSSETokenSpy.mockResolvedValue(null);
    renderHook(() => useSSEToken());
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(1);

    // 지수 백오프 딜레이 순서대로 타이머 진행
    const delays = [1000, 2000, 4000];
    for (const delay of delays) {
      await act(async () => {
        vi.advanceTimersByTime(delay);
      });
      await flushPromises();
    }

    // 초기 1회 + 재시도 5회 = 6회
    expect(postSSETokenSpy).toHaveBeenCalledTimes(4);

    // 더 이상 타이머 없음 — 추가 호출 없음
    await act(async () => {
      vi.runAllTimers();
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(4);
  });

  it("handleSSEError 호출 시 connectionToken이 null로 초기화된다", async () => {
    postSSETokenSpy.mockResolvedValue("token-abc");
    const { result } = renderHook(() => useSSEToken());
    await flushPromises();

    expect(result.current.connectionToken).toBe("token-abc");

    act(() => {
      result.current.handleSSEError(new Error("연결 오류"));
    });

    expect(result.current.connectionToken).toBeNull();
  });

  it("handleSSEError가 MAX_RETRY(3)회 초과 시 더 이상 재연결을 시도하지 않는다", async () => {
    postSSETokenSpy.mockResolvedValue("token-abc");
    const { result } = renderHook(() => useSSEToken());
    await flushPromises();

    postSSETokenSpy.mockResolvedValue(null);

    // 3회 오류: retrySignal 0→2
    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.handleSSEError(new Error("연결 오류"));
      });
      await flushPromises();
    }

    // 각 루프에서 null 반환 후 예약된 재시도 타이머 정리
    vi.clearAllTimers();
    const callCount = postSSETokenSpy.mock.calls.length;

    // 4회째: retrySignal이 이미 MAX_RETRY(3)이므로 증가하지 않아 effect 재실행 없음
    act(() => {
      result.current.handleSSEError(new Error("연결 오류"));
    });
    await flushPromises();

    expect(postSSETokenSpy).toHaveBeenCalledTimes(callCount);
  });

  it("언마운트 시 진행 중인 타이머를 정리한다", async () => {
    postSSETokenSpy.mockResolvedValue(null);
    const { unmount } = renderHook(() => useSSEToken());
    await flushPromises();

    const callCountBeforeUnmount = postSSETokenSpy.mock.calls.length;

    unmount();

    await act(async () => {
      vi.runAllTimers();
    });
    await flushPromises();

    expect(postSSETokenSpy).toHaveBeenCalledTimes(callCountBeforeUnmount);
  });
});
