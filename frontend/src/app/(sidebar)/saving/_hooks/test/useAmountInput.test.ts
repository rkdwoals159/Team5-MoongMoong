import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";

describe("useAmountInput", () => {
  it("초기값 없으면 빈 문자열, numericValue는 0", () => {
    const { result } = renderHook(() => useAmountInput());

    expect(result.current.value).toBe("");
    expect(result.current.numericValue).toBe(0);
  });

  it("initialValue=5000이면 value='5000'", () => {
    const { result } = renderHook(() => useAmountInput({ initialValue: 5000 }));

    expect(result.current.value).toBe("5000");
    expect(result.current.numericValue).toBe(5000);
  });

  it("숫자 외 문자 입력 시 필터링", () => {
    const { result } = renderHook(() => useAmountInput());

    act(() => {
      result.current.handleChange({
        target: { value: "abc123def456" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("123456");
  });

  it("addAmount로 현재값에 금액 추가", () => {
    const { result } = renderHook(() => useAmountInput({ initialValue: 1000 }));

    act(() => {
      result.current.addAmount(5000);
    });

    expect(result.current.numericValue).toBe(6000);
  });

  it("value가 빈 문자열일 때 addAmount 호출 시 정상 동작", () => {
    const { result } = renderHook(() => useAmountInput());

    act(() => {
      result.current.addAmount(3000);
    });

    expect(result.current.numericValue).toBe(3000);
  });

  it("reset 호출 시 초기값으로 복원", () => {
    const { result } = renderHook(() => useAmountInput({ initialValue: 5000 }));

    act(() => {
      result.current.handleChange({
        target: { value: "9999" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe("9999");

    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe("5000");
  });

  it("음수 initialValue면 빈 문자열로 시작", () => {
    const { result } = renderHook(() => useAmountInput({ initialValue: -100 }));

    expect(result.current.value).toBe("");
    expect(result.current.numericValue).toBe(0);
  });
});
