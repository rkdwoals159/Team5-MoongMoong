import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpenseRowsState } from "@/app/(sidebar)/dashboard/_hooks/useExpenseRowsState";
import type { ExpenseData } from "@/app/(sidebar)/dashboard/_types";

/**
 * 테스트용 Mock 데이터 생성 함수
 */
function createMockServerRow(id: number, overrides?: Partial<ExpenseData>): ExpenseData {
  return {
    expenseId: id,
    spentAt: "2026-02-11",
    usage: "점심식사",
    cost: 15000,
    mainCategory: "식비",
    subCategory: "외식",
    memo: "테스트 메모",
    ...overrides,
  };
}

describe("useExpenseRowsState", () => {
  describe("초기화", () => {
    it("빈 배열로 초기화하면 빈 행 1개만 존재한다", () => {
      const emptyData: ExpenseData[] = [];
      const { result } = renderHook(() => useExpenseRowsState(emptyData));

      expect(result.current.displayInitialRows).toHaveLength(1);
      expect(result.current.displayInitialRows[0]?.isNew).toBe(true);
      expect(result.current.displayInitialRows[0]?.expenseId).toBe(0);
      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it("서버 데이터로 초기화하면 EditableExpenseRow로 변환된다", () => {
      const serverData = [createMockServerRow(1), createMockServerRow(2)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      expect(result.current.displayInitialRows).toHaveLength(3);
      expect(result.current.displayInitialRows[0]?.localId).toBe("exp-1");
      expect(result.current.displayInitialRows[0]?.isNew).toBe(false);
      expect(result.current.displayInitialRows[0]?.isDirty).toBe(false);
      expect(result.current.displayInitialRows[0]?.isDeleted).toBe(false);
    });
  });

  describe("updateCellByLocalId", () => {
    it("기존 행의 일반 필드를 업데이트하면 isDirty가 변경되지 않는다", () => {
      const serverData = [createMockServerRow(1)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "selected", true);
      });

      const updatedRow = result.current.displayInitialRows.find((r) => r.localId === "exp-1");
      expect(updatedRow?.selected).toBe(true);
      expect(updatedRow?.isDirty).toBe(false);
    });

    it("기존 행의 SYNC_FIELDS를 업데이트하면 isDirty가 true가 된다", () => {
      const serverData = [createMockServerRow(1)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "usage", "저녁식사");
      });

      const updatedRow = result.current.displayInitialRows.find((r) => r.localId === "exp-1");
      expect(updatedRow?.usage).toBe("저녁식사");
      expect(updatedRow?.isDirty).toBe(true);
      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it("신규 행(expenseId가 null)의 SYNC_FIELDS를 업데이트해도 isDirty는 false를 유지한다", () => {
      const emptyData: ExpenseData[] = [];
      const { result } = renderHook(() => useExpenseRowsState(emptyData));

      const emptyRowLocalId = result?.current?.displayInitialRows[0]?.localId ?? "";

      act(() => {
        result.current.updateCellByLocalId(emptyRowLocalId, "usage", "새로운 항목");
      });

      const newRow = result.current.displayInitialRows.find((r) => r.localId === emptyRowLocalId);
      expect(newRow?.usage).toBe("새로운 항목");
      expect(newRow?.isNew).toBe(true);
      expect(newRow?.isDirty).toBe(false);
    });

    it("빈 행을 편집하면 새 행이 추가된다", () => {
      const emptyData: ExpenseData[] = [];
      const { result } = renderHook(() => useExpenseRowsState(emptyData));

      const emptyRowLocalId = result?.current?.displayInitialRows[0]?.localId ?? "";

      act(() => {
        result.current.updateCellByLocalId(emptyRowLocalId, "usage", "새로운 항목");
      });

      expect(result.current.displayInitialRows).toHaveLength(2);
    });

    it("존재하지 않는 localId를 업데이트하면 새 행이 추가된다", () => {
      const serverData = [createMockServerRow(1)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      const initialLength = result.current.displayInitialRows.length;

      act(() => {
        result.current.updateCellByLocalId("non-existent-id", "usage", "테스트");
      });

      expect(result.current.displayInitialRows).toHaveLength(initialLength + 1);
    });

    it("이미 isDirty인 행을 업데이트해도 isDirty가 유지된다", () => {
      const serverData = [createMockServerRow(1)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "usage", "첫 번째 수정");
      });

      const firstUpdate = result.current.displayInitialRows.find((r) => r.localId === "exp-1");
      expect(firstUpdate?.isDirty).toBe(true);

      act(() => {
        result.current.updateCellByLocalId("exp-1", "memo", "메모 수정");
      });

      const secondUpdate = result.current.displayInitialRows.find((r) => r.localId === "exp-1");
      expect(secondUpdate?.isDirty).toBe(true);
    });
  });

  describe("updateAllCells", () => {
    it("모든 행의 특정 필드를 일괄 업데이트한다", () => {
      const serverData = [createMockServerRow(1), createMockServerRow(2)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateAllCells("selected", true);
      });

      const rows = result.current.displayInitialRows.slice(0, -1);
      expect(rows.every((r) => r.selected === true)).toBe(true);
    });
  });

  describe("deleteSelectedRows", () => {
    it("선택된 행들의 isDeleted를 true로 설정한다", () => {
      const serverData = [createMockServerRow(1), createMockServerRow(2), createMockServerRow(3)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateAllCells("selected", true);
        result.current.deleteSelectedRows();
      });

      const rows = result.current.displayInitialRows.slice(0, -1);
      expect(rows.every((r) => r.isDeleted === true)).toBe(true);
    });

    it("선택되지 않은 행은 변경되지 않는다", () => {
      const serverData = [createMockServerRow(1), createMockServerRow(2)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "selected", true);
        result.current.deleteSelectedRows();
      });

      const row2 = result.current.displayInitialRows.find((r) => r.localId === "exp-2");
      expect(row2?.isDeleted).toBe(false);
    });
  });

  describe("mergeSelectedRows", () => {
    it("선택된 2개 이상의 행을 하나로 병합한다", () => {
      const serverData = [
        createMockServerRow(1, { cost: 10000, usage: "점심" }),
        createMockServerRow(2, { cost: 5000, usage: "커피" }),
      ];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateAllCells("selected", true);
        result.current.mergeSelectedRows();
      });

      expect(result.current.displayInitialRows).toHaveLength(2);

      const mergedRow = result.current.displayInitialRows.find((r) => r.isNew && !r.isDeleted);
      expect(mergedRow?.cost).toBe(15000);
      expect(mergedRow?.usage).toContain("점심");
      expect(mergedRow?.usage).toContain("커피");
      expect(mergedRow?.isNew).toBe(true);
      expect(mergedRow?.isDirty).toBe(true);
    });
  });

  describe("mergeRowsFromServer", () => {
    it("서버 데이터와 로컬 데이터를 병합한다", () => {
      const serverData = [createMockServerRow(1, { usage: "초기값" })];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "usage", "로컬 수정");
      });

      expect(result.current.hasUnsavedChanges).toBe(true);

      const newServerData = [createMockServerRow(1, { usage: "서버 업데이트" })];

      act(() => {
        result.current.mergeRowsFromServer(newServerData);
      });

      const row = result.current.displayInitialRows.find((r) => r.localId === "exp-1");
      expect(row?.usage).toBe("서버 업데이트");
      expect(row?.isDirty).toBe(false);
      expect(row?.isNew).toBe(false);
    });
  });

  describe("getPatchPayload", () => {
    it("isNew, isDirty, isDeleted 행을 페이로드로 생성한다", () => {
      const serverData = [createMockServerRow(1), createMockServerRow(2)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      act(() => {
        result.current.updateCellByLocalId("exp-1", "usage", "수정된 항목");
        result.current.updateCellByLocalId("exp-2", "selected", true);
        result.current.deleteSelectedRows();
      });

      const payload = result.current.getPatchPayload();

      expect(payload.expenses).toHaveLength(1);
      expect(payload?.expenses?.[0]?.usage).toBe("수정된 항목");
      expect(payload?.expenses?.[0]?.isNew).toBe(false);

      expect(payload.deletedIds).toHaveLength(1);
      expect(payload?.deletedIds?.[0]).toBe(2);
    });

    it("변경사항이 없으면 빈 페이로드를 반환한다", () => {
      const serverData = [createMockServerRow(1)];
      const { result } = renderHook(() => useExpenseRowsState(serverData));

      const payload = result.current.getPatchPayload();

      expect(payload.expenses).toHaveLength(0);
      expect(payload.deletedIds).toHaveLength(0);
    });
  });
});
