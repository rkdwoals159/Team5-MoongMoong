import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

function TestComponent({ onOutside, isActive }: { onOutside: () => void; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({ isActive, refs: [ref], onOutside });
  return (
    <div>
      <div data-testid="outside">
        <div ref={ref} data-testid="inside">
          내부
        </div>
      </div>
    </div>
  );
}

describe("useOutsideClick", () => {
  it("isActive가 true일 때 ref 바깥 클릭 시 onOutside 호출", () => {
    const onOutside = vi.fn();
    render(<TestComponent onOutside={onOutside} isActive={true} />);

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    expect(onOutside).toHaveBeenCalledTimes(1);
  });

  it("isActive가 false일 때 ref 바깥 클릭 시 onOutside 호출하지 않음", () => {
    const onOutside = vi.fn();
    render(<TestComponent onOutside={onOutside} isActive={false} />);

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    expect(onOutside).not.toHaveBeenCalled();
  });

  it("isActive가 true일 때 ref 안쪽 클릭 시 onOutside 호출하지 않음", () => {
    const onOutside = vi.fn();
    render(<TestComponent onOutside={onOutside} isActive={true} />);

    const inside = screen.getByTestId("inside");
    fireEvent.mouseDown(inside);

    expect(onOutside).not.toHaveBeenCalled();
  });
});
