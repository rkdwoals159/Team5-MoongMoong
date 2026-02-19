import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, screen } from "@testing-library/react";
import ToastProvider from "@/components/ui/Toast/ToastProvider";
import { useCreateSaving } from "@/app/(sidebar)/saving/_hooks/useCreateSaving";

const mockCreateNewSaving = vi.fn();
vi.mock("@/api/savingApiActions", () => ({
  createNewSaving: (...args: unknown[]) => mockCreateNewSaving(...args),
}));

vi.mock("@/assets/ic_warning.svg", () => ({ default: () => null }));
vi.mock("@/assets/ic_check.svg", () => ({ default: () => null }));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: mockRefresh,
  }),
}));

describe("useCreateSaving", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("저금통 생성 성공 시 성공 토스트를 표시하고 router.refresh를 호출한다", async () => {
    mockCreateNewSaving.mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useCreateSaving(), {
      wrapper: ToastProvider,
    });

    await act(async () => {
      await result.current.createSaving(10000);
    });

    expect(mockCreateNewSaving).toHaveBeenCalledWith(10000);
    expect(screen.getByText("저금통 생성에 성공했어요.")).toBeInTheDocument();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("createNewSaving이 null을 반환하면 에러 토스트를 표시한다", async () => {
    mockCreateNewSaving.mockResolvedValue(null);

    const { result } = renderHook(() => useCreateSaving(), {
      wrapper: ToastProvider,
    });

    await act(async () => {
      await result.current.createSaving(10000);
    });

    expect(screen.getByText("저금통 생성에 실패했어요.")).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("예외 발생 시 오류 토스트를 표시한다", async () => {
    mockCreateNewSaving.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useCreateSaving(), {
      wrapper: ToastProvider,
    });

    await act(async () => {
      await result.current.createSaving(10000);
    });

    expect(screen.getByText("저금통 생성 중 오류가 발생했어요.")).toBeInTheDocument();
  });

  it("이미 제출 중이면 중복 호출을 방지한다", async () => {
    let resolve: (value: unknown) => void;
    mockCreateNewSaving.mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );

    const { result } = renderHook(() => useCreateSaving(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.createSaving(10000);
    });

    await act(async () => {
      await result.current.createSaving(10000);
    });

    expect(mockCreateNewSaving).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve!({ id: 1 });
    });
  });
});
