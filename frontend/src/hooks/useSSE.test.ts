import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSSE } from "@/hooks/useSSE";
import { HEARTBEAT_TIMEOUT } from "@/constants/sseConnection";

function createMockSSEResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  let index = 0;
  const body = {
    getReader: () => ({
      read: async () => {
        if (index < chunks.length) {
          return { done: false, value: encoder.encode(chunks[index++]) };
        }
        return { done: true, value: undefined };
      },
    }),
  };
  return { ok: true, status: 200, body } as unknown as Response;
}

describe("useSSE", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch");
    vi.stubEnv("NEXT_PUBLIC_SSE_URL", "http://test-sse-server/sse");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("connectionToken이 있으면 fetch를 호출하고 connecting → open → closed 순으로 전이된다", async () => {
    let resolveFetch: (value: Response) => void;
    fetchSpy.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSE({ onEvent, onError, connectionToken: "test-token" }),
    );

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(result.current.status).toBe("connecting");

    const chunk =
      'event: SAVING\ndata: {"coinId":1,"createdAt":"2026-01-01","amount":100,"name":"test"}\n\n';
    await act(async () => {
      resolveFetch(createMockSSEResponse([chunk]));
    });

    await waitFor(() => {
      expect(result.current.status).toBe("closed");
    });
  });

  it("이벤트 수신 시 onEvent가 파싱된 데이터로 호출된다", async () => {
    const chunk =
      'event: SAVING\ndata: {"coinId":1,"createdAt":"2026-01-01","amount":100,"name":"test"}\n\n';
    fetchSpy.mockResolvedValue(createMockSSEResponse([chunk]));

    const onEvent = vi.fn();
    renderHook(() => useSSE({ onEvent, connectionToken: "test-token" }));

    await waitFor(() => {
      expect(onEvent).toHaveBeenCalledWith({
        event: "SAVING",
        data: { coinId: 1, createdAt: "2026-01-01", amount: 100, name: "test" },
      });
    });
  });

  it("fetch 실패 시 onError가 호출되고 status가 closed가 된다", async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
      body: null,
    } as unknown as Response);

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSE({ onEvent, onError, connectionToken: "test-token" }),
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();
    });

    const error = onError.mock.calls[0]?.[0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("500");

    expect(result.current.status).toBe("closed");
  });

  it("disconnect 호출 시 status가 closed가 된다", async () => {
    let abortSignal: AbortSignal;
    fetchSpy.mockImplementation((_url: string, init: RequestInit) => {
      abortSignal = (init as RequestInit).signal!;
      const body = {
        getReader: () => ({
          read: () =>
            new Promise<{ done: boolean; value?: Uint8Array }>((_resolve, reject) => {
              abortSignal.addEventListener("abort", () => {
                reject(new DOMException("The operation was aborted.", "AbortError"));
              });
            }),
        }),
      };
      return Promise.resolve({ ok: true, status: 200, body } as unknown as Response);
    });

    const onEvent = vi.fn();
    const { result } = renderHook(() => useSSE({ onEvent, connectionToken: "test-token" }));

    await waitFor(() => {
      expect(result.current.status).toBe("open");
    });

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.status).toBe("closed");
  });

  it("connectionToken이 없으면 fetch가 호출되지 않고 연결이 닫혀있다", () => {
    const onEvent = vi.fn();
    const { result } = renderHook(() => useSSE({ onEvent, connectionToken: null }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.status).toBe("closed");
  });

  it("done:true 시 onError가 호출된다", async () => {
    fetchSpy.mockResolvedValue(createMockSSEResponse([]));

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSE({ onEvent, onError, connectionToken: "test-token" }),
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();
    });

    const error = onError.mock.calls[0]?.[0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("서버에 의해 종료");
    expect(result.current.status).toBe("closed");
  });

  it("disconnect 후 done:true 시 onError가 호출되지 않는다", async () => {
    fetchSpy.mockImplementation((_url: string, init: RequestInit) => {
      const abortSignal = (init as RequestInit).signal!;
      const body = {
        getReader: () => ({
          read: () =>
            new Promise<{ done: boolean; value?: Uint8Array }>((resolve) => {
              abortSignal.addEventListener("abort", () => {
                resolve({ done: true, value: undefined });
              });
            }),
        }),
      };
      return Promise.resolve({ ok: true, status: 200, body } as unknown as Response);
    });

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSE({ onEvent, onError, connectionToken: "test-token" }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("open");
    });

    act(() => {
      result.current.disconnect();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("closed");
    });

    expect(onError).not.toHaveBeenCalled();
  });

  it("HEARTBEAT_TIMEOUT 동안 데이터가 없으면 onError가 호출된다", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    fetchSpy.mockImplementation((_url: string, init: RequestInit) => {
      const abortSignal = (init as RequestInit).signal!;
      const body = {
        getReader: () => ({
          read: () =>
            new Promise<{ done: boolean; value?: Uint8Array }>((_resolve, reject) => {
              abortSignal.addEventListener("abort", () => {
                reject(new DOMException("The operation was aborted.", "AbortError"));
              });
            }),
        }),
      };
      return Promise.resolve({ ok: true, status: 200, body } as unknown as Response);
    });

    const onEvent = vi.fn();
    const onError = vi.fn();
    renderHook(() => useSSE({ onEvent, onError, connectionToken: "test-token" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(onError).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(HEARTBEAT_TIMEOUT);
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();
    });
  });

  it("데이터 수신 시 heartbeat 타이머가 리셋된다", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const encoder = new TextEncoder();
    let readCallCount = 0;
    fetchSpy.mockImplementation((_url: string, init: RequestInit) => {
      const abortSignal = (init as RequestInit).signal!;
      const body = {
        getReader: () => ({
          read: () =>
            new Promise<{ done: boolean; value?: Uint8Array }>((resolve, reject) => {
              readCallCount++;
              if (readCallCount <= 2) {
                const chunk =
                  'event: SAVING\ndata: {"coinId":1,"createdAt":"2026-01-01","amount":100,"name":"test"}\n\n';
                resolve({ done: false, value: encoder.encode(chunk) });
              } else {
                abortSignal.addEventListener("abort", () => {
                  reject(new DOMException("The operation was aborted.", "AbortError"));
                });
              }
            }),
        }),
      };
      return Promise.resolve({ ok: true, status: 200, body } as unknown as Response);
    });

    const onEvent = vi.fn();
    const onError = vi.fn();
    renderHook(() => useSSE({ onEvent, onError, connectionToken: "test-token" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    await waitFor(() => {
      expect(onEvent).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(HEARTBEAT_TIMEOUT - 100);
    });

    expect(onError).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();
    });
  });

  it("disconnect 시 heartbeat 타이머가 정리된다", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    fetchSpy.mockImplementation((_url: string, init: RequestInit) => {
      const abortSignal = (init as RequestInit).signal!;
      const body = {
        getReader: () => ({
          read: () =>
            new Promise<{ done: boolean; value?: Uint8Array }>((_resolve, reject) => {
              abortSignal.addEventListener("abort", () => {
                reject(new DOMException("The operation was aborted.", "AbortError"));
              });
            }),
        }),
      };
      return Promise.resolve({ ok: true, status: 200, body } as unknown as Response);
    });

    const onEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSE({ onEvent, onError, connectionToken: "test-token" }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    await waitFor(() => {
      expect(result.current.status).toBe("open");
    });

    act(() => {
      result.current.disconnect();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(HEARTBEAT_TIMEOUT + 1000);
    });

    expect(onError).not.toHaveBeenCalled();
  });
});
