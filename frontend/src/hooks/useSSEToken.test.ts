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
    vi.spyOn(Math, "random").mockReturnValue(1);
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
    // retrySignal=1 → 1000ms 백오프 후 fetchToken
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await flushPromises();

    expect(result.current.connectionToken).toBe("token-xyz");
  });

  it("postSSEToken이 실패하면 지수 백오프로 재시도한다", async () => {
    postSSETokenSpy.mockRejectedValue(new Error("토큰 발급 실패"));
    renderHook(() => useSSEToken());
    await flushPromises();

    expect(postSSETokenSpy).toHaveBeenCalledTimes(1);

    // retrySignal=1 → 1000ms 후 재시도
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(2);

    // retrySignal=2 → 2000ms 후 재시도
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(3);
  });

  it("postSSEToken이 계속 실패하면 백오프가 MAX_RECONNECT_DELAY에 수렴한다", async () => {
    postSSETokenSpy.mockRejectedValue(new Error("토큰 발급 실패"));
    renderHook(() => useSSEToken());
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(1);

    // retrySignal 1→5: 1s, 2s, 4s, 8s, 16s
    for (const delay of [1000, 2000, 4000, 8000, 16000]) {
      await act(async () => {
        vi.advanceTimersByTime(delay);
      });
      await flushPromises();
    }
    expect(postSSETokenSpy).toHaveBeenCalledTimes(6);

    // retrySignal=6 → MAX_RECONNECT_DELAY(30초) 캡
    await act(async () => {
      vi.advanceTimersByTime(29999);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(6);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    await flushPromises();
    expect(postSSETokenSpy).toHaveBeenCalledTimes(7);
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

  it("handleSSEError 호출 시 항상 새로운 토큰 발급 사이클을 시작한다", async () => {
    postSSETokenSpy.mockResolvedValue("token-abc");
    const { result } = renderHook(() => useSSEToken());
    await flushPromises();

    // retrySignal 1→5 에 대한 백오프 딜레이: 1s, 2s, 4s, 8s, 16s
    for (const [i, delay] of [1000, 2000, 4000, 8000, 16000].entries()) {
      postSSETokenSpy.mockResolvedValueOnce(`token-${i}`);
      act(() => {
        result.current.handleSSEError(new Error("연결 오류"));
      });
      await act(async () => {
        vi.advanceTimersByTime(delay);
      });
      await flushPromises();
    }

    // 초기 1회 + handleSSEError 5회 = 6회
    expect(postSSETokenSpy).toHaveBeenCalledTimes(6);
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

  describe("탭 가시성 기반 연결 제어", () => {
    function setDocumentVisibility(state: "visible" | "hidden") {
      Object.defineProperty(document, "visibilityState", {
        value: state,
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    }

    afterEach(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
        configurable: true,
      });
    });

    it("hidden 상태에서 마운트하면 토큰을 발급하지 않는다", async () => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
        configurable: true,
      });
      postSSETokenSpy.mockResolvedValue("token-abc");

      const { result } = renderHook(() => useSSEToken());
      await flushPromises();

      expect(postSSETokenSpy).not.toHaveBeenCalled();
      expect(result.current.connectionToken).toBeNull();
    });

    it("hidden → visible 전환 시 토큰을 발급한다", async () => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
        configurable: true,
      });
      postSSETokenSpy.mockResolvedValue("token-abc");

      const { result } = renderHook(() => useSSEToken());
      await flushPromises();

      expect(postSSETokenSpy).not.toHaveBeenCalled();

      await act(async () => {
        setDocumentVisibility("visible");
      });
      await flushPromises();

      expect(postSSETokenSpy).toHaveBeenCalledTimes(1);
      expect(result.current.connectionToken).toBe("token-abc");
    });

    it("visible → hidden 전환 시 connectionToken이 null이 된다", async () => {
      postSSETokenSpy.mockResolvedValue("token-abc");

      const { result } = renderHook(() => useSSEToken());
      await flushPromises();

      expect(result.current.connectionToken).toBe("token-abc");

      await act(async () => {
        setDocumentVisibility("hidden");
      });

      expect(result.current.connectionToken).toBeNull();
    });

    it("hidden → visible 전환 시 retrySignal이 리셋되어 즉시 토큰을 발급한다", async () => {
      postSSETokenSpy.mockResolvedValue("token-abc");

      const { result } = renderHook(() => useSSEToken());
      await flushPromises();

      postSSETokenSpy.mockResolvedValue("token-new");

      // visible → hidden → visible 전환
      await act(async () => {
        setDocumentVisibility("hidden");
      });
      postSSETokenSpy.mockClear();

      await act(async () => {
        setDocumentVisibility("visible");
      });
      await flushPromises();

      // 백오프 없이 즉시 발급 (retrySignal=0)
      expect(postSSETokenSpy).toHaveBeenCalledTimes(1);
      expect(result.current.connectionToken).toBe("token-new");
    });

    it("hidden 상태에서는 에러 기반 재시도가 발생하지 않는다", async () => {
      postSSETokenSpy.mockResolvedValue("token-abc");

      const { result } = renderHook(() => useSSEToken());
      await flushPromises();

      // hidden으로 전환
      await act(async () => {
        setDocumentVisibility("hidden");
      });

      postSSETokenSpy.mockClear();

      // handleSSEError 호출 → retrySignal 증가
      act(() => {
        result.current.handleSSEError(new Error("연결 오류"));
      });

      // 타이머를 충분히 진행시켜도 토큰 발급이 일어나지 않아야 함
      await act(async () => {
        vi.advanceTimersByTime(60000);
      });
      await flushPromises();

      expect(postSSETokenSpy).not.toHaveBeenCalled();
      expect(result.current.connectionToken).toBeNull();
    });
  });
});
