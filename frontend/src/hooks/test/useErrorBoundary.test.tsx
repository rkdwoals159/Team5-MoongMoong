import { renderHook, act, render, waitFor, fireEvent } from "@testing-library/react";
import { useErrorBoundary } from "../useErrorBoundary";
import { Component, type ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

class TestErrorBoundary extends Component<
  { children: ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error Caught</div>;
    }
    return this.props.children;
  }
}

describe("useErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("초기 상태에서는 showErrorBoundary 함수를 반환한다", () => {
    const { result } = renderHook(() => useErrorBoundary());

    expect(result.current.showErrorBoundary).toBeInstanceOf(Function);
  });

  it("showErrorBoundary 호출 시 에러를 throw한다", () => {
    const { result } = renderHook(() => useErrorBoundary());
    const testError = new Error("테스트 에러");

    expect(() => {
      act(() => {
        result.current.showErrorBoundary(testError);
      });
    }).toThrow(testError);
  });

  it("동일한 showErrorBoundary 함수 참조를 유지한다", () => {
    const { result, rerender } = renderHook(() => useErrorBoundary());
    const firstFn = result.current.showErrorBoundary;

    rerender();
    const secondFn = result.current.showErrorBoundary;

    expect(firstFn).toBe(secondFn);
  });

  it("ErrorBoundary와 함께 동작하여 에러를 전파한다", async () => {
    const onError = vi.fn();
    const testError = new Error("비동기 에러");

    const TestComponent = () => {
      const { showErrorBoundary } = useErrorBoundary();

      return <button onClick={() => showErrorBoundary(testError)}>에러 발생</button>;
    };

    const { getByText } = render(
      <TestErrorBoundary onError={onError}>
        <TestComponent />
      </TestErrorBoundary>,
    );

    const button = getByText("에러 발생");

    fireEvent.click(button);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(testError);
      expect(getByText("Error Caught")).toBeInTheDocument();
    });
  });
});
