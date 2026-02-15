import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSSE } from "@/hooks/useSSE";

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("enabled=true 시 fetch를 호출하고 connecting → open → closed 순으로 전이된다", async () => {
    let resolveFetch: (value: Response) => void;
    fetchSpy.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const onEvent = vi.fn();
    const { result } = renderHook(() => useSSE({ url: "/api/sse", onEvent, enabled: true }));

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
    renderHook(() => useSSE({ url: "/api/sse", onEvent, enabled: true }));

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
      useSSE({ url: "/api/sse", onEvent, onError, enabled: true }),
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
    const { result } = renderHook(() => useSSE({ url: "/api/sse", onEvent, enabled: true }));

    await waitFor(() => {
      expect(result.current.status).toBe("open");
    });

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.status).toBe("closed");
  });

  it("enabled=false 시 fetch가 호출되지 않고 연결이 닫혀있다.", () => {
    const onEvent = vi.fn();
    const { result } = renderHook(() => useSSE({ url: "/api/sse", onEvent, enabled: false }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.status).toBe("closed");
  });
});
