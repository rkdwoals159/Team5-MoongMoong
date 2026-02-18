import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useState } from "react";
import { renderHook, act } from "@testing-library/react";
import { useExpenseTableSelection } from "@/app/(sidebar)/dashboard/_hooks/useExpenseTableSelection";
import type { SelectedCell } from "@/app/(sidebar)/dashboard/_types";
import { ExpenseData } from "@/api/types/dashboardApi.type";

/**
 * 테스트용 래퍼: selectedCell 상태를 보유하고 useExpenseTableSelection에 전달
 */
function useExpenseTableSelectionTestWrapper(rowCount: number) {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
  const { onCellClick, handleKeyDown } = useExpenseTableSelection({
    rowCount,
    selectedCell,
    setSelectedCell,
  });
  return { selectedCell, setSelectedCell, onCellClick, handleKeyDown };
}

/**
 * DOM 환경 설정
 * useExpenseTableSelection은 DOM 포커스를 다루므로 테스트 환경에서 DOM 요소를 생성합니다.
 */
function setupDOMEnvironment(rowIndex: number, accessor: string) {
  const cell = document.createElement("div");
  cell.setAttribute("data-cell-id", `${rowIndex}-${accessor}`);

  const input = document.createElement("input");
  input.type = "text";
  cell.appendChild(input);

  document.body.appendChild(cell);

  return { cell, input };
}

function cleanupDOMEnvironment() {
  document.body.innerHTML = "";
}

/**
 * 키보드 이벤트 Mock 생성 헬퍼
 */
function createKeyboardEvent(key: "Tab" | "Enter") {
  return {
    key,
    preventDefault: vi.fn(),
    nativeEvent: { isComposing: false },
  } as unknown as React.KeyboardEvent<HTMLDivElement>;
}

describe("useExpenseTableSelection", () => {
  beforeEach(() => {
    cleanupDOMEnvironment();
  });

  afterEach(() => {
    cleanupDOMEnvironment();
  });

  describe("셀 선택", () => {
    it("onCellClick 호출 시 selectedCell이 업데이트된다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(5));

      act(() => {
        result.current.onCellClick(1, "usage");
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "usage" });
    });

    it("DOM 요소가 존재하면 포커스가 설정된다", () => {
      const { input } = setupDOMEnvironment(1, "usage");
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(5));

      const focusSpy = vi.spyOn(input, "focus");

      act(() => {
        result.current.onCellClick(1, "usage");
      });

      expect(focusSpy).toHaveBeenCalled();
    });

    it("DOM 요소가 없어도 에러 없이 동작한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(5));

      expect(() => {
        act(() => {
          result.current.onCellClick(1, "usage");
        });
      }).not.toThrow();

      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "usage" });
    });
  });

  describe("Tab 키 네비게이션 시나리오", () => {
    it("같은 행에서 다음 컬럼으로 이동한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "usage" });
      });

      const mockEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "cost" });
    });

    it("마지막 컬럼에서 Tab을 누르면 다음 행 첫 컬럼으로 이동한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "memo" });
      });

      const mockEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "selected" });
    });

    it("마지막 행 마지막 컬럼에서 Tab을 누르면 이동하지 않는다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(2));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 1, accessor: "memo" });
      });

      const mockEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // 마지막 셀에서는 이동할 곳이 없으므로 preventDefault가 호출되지 않음
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "memo" });
    });

    it("selectedCell이 null일 때 Tab을 누르면 첫 셀이 선택된다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      const mockEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "selected" });
    });

    it("유효하지 않은 accessor를 가진 셀에서 Tab을 누르면 변경되지 않는다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      act(() => {
        result.current.setSelectedCell({
          rowIndex: 0,
          accessor: "invalidAccessor" as keyof ExpenseData,
        });
      });

      const mockEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // 유효하지 않은 accessor는 currentColIndex가 -1이므로 이동하지 않음
      // 하지만 preventDefault는 호출됨 (테이블 내부에서 포커스 유지)
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "invalidAccessor" });
    });
  });

  describe("Enter 키 네비게이션 시나리오", () => {
    it("같은 컬럼에서 다음 행으로 이동한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "usage" });
      });

      const mockEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "usage" });
    });

    it("마지막 행에서 Enter를 누르면 이동하지 않는다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(2));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 1, accessor: "usage" });
      });

      const mockEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // 마지막 행이므로 이동하지 않음
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "usage" });
    });

    it("selectedCell이 null일 때 Enter를 눌러도 아무 동작하지 않는다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      const mockEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.selectedCell).toBeNull();
    });
  });

  describe("경계 조건", () => {
    it("rowCount가 0일 때 Tab을 눌러도 에러 없이 동작한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(0));

      const mockEvent = createKeyboardEvent("Tab");

      expect(() => {
        act(() => {
          result.current.handleKeyDown(mockEvent);
        });
      }).not.toThrow();

      // rowCount가 0이면 이동할 곳이 없으므로 null 유지
      expect(result.current.selectedCell).toBeNull();
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("rowCount가 1일 때 Tab으로 같은 행 내에서만 이동한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(1));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "selected" });
      });

      const mockEvent = createKeyboardEvent("Tab");

      // 첫 컬럼 -> 두 번째 컬럼
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "spentAt" });

      // 마지막 컬럼까지 이동
      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleKeyDown(mockEvent);
        });
      }

      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "memo" });

      // 마지막 컬럼에서 Tab을 누르면 이동하지 않음 (행이 1개뿐)
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "memo" });
    });

    it("rowCount가 1일 때 Enter로 이동하지 않는다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(1));

      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "usage" });
      });

      const mockEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // rowCount가 1이면 다음 행이 없으므로 이동하지 않음
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "usage" });
    });

    it("rowCount가 변경되면 네비게이션이 새로운 범위에 맞춰 동작한다", () => {
      const { result, rerender } = renderHook(
        ({ count }) => useExpenseTableSelectionTestWrapper(count),
        {
          initialProps: { count: 3 },
        },
      );

      act(() => {
        result.current.setSelectedCell({ rowIndex: 2, accessor: "usage" });
      });

      // rowCount를 2로 줄임
      rerender({ count: 2 });

      const mockEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      // rowIndex가 2인데 rowCount가 2이므로 이동하지 않음
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.selectedCell).toEqual({ rowIndex: 2, accessor: "usage" });
    });
  });

  describe("실제 사용 시나리오", () => {
    it("사용자가 테이블을 Tab으로 순회하며 데이터를 입력한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(2));

      const mockEvent = createKeyboardEvent("Tab");

      // 초기 상태에서 Tab → 첫 셀
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "selected" });

      // 계속 Tab으로 이동
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "spentAt" });

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "usage" });

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "cost" });

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "mainCategory" });

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 0, accessor: "memo" });

      // 첫 번째 행 마지막 컬럼에서 Tab → 두 번째 행 첫 컬럼
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "selected" });
    });

    it("사용자가 컬럼 내에서 Enter로 아래로 이동하며 데이터를 입력한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      const mockEvent = createKeyboardEvent("Enter");

      // usage 컬럼에서 시작
      act(() => {
        result.current.setSelectedCell({ rowIndex: 0, accessor: "usage" });
      });

      // Enter로 아래로 이동
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "usage" });

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 2, accessor: "usage" });

      // 마지막 행에서 Enter → 이동 안 함
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });
      expect(result.current.selectedCell).toEqual({ rowIndex: 2, accessor: "usage" });
    });

    it("사용자가 셀을 클릭하고 Tab/Enter로 이동한다", () => {
      const { result } = renderHook(() => useExpenseTableSelectionTestWrapper(3));

      // 클릭으로 셀 선택
      act(() => {
        result.current.onCellClick(1, "cost");
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 1, accessor: "cost" });

      // Enter로 아래로 이동
      const enterEvent = createKeyboardEvent("Enter");

      act(() => {
        result.current.handleKeyDown(enterEvent);
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 2, accessor: "cost" });

      // Tab으로 오른쪽으로 이동
      const tabEvent = createKeyboardEvent("Tab");

      act(() => {
        result.current.handleKeyDown(tabEvent);
      });

      expect(result.current.selectedCell).toEqual({ rowIndex: 2, accessor: "mainCategory" });
    });
  });
});
