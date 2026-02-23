import { describe, it, expect } from "vitest";
import {
  serverToEditableRow,
  isRowEqual,
  mergeRows,
  buildPatchPayload,
  buildMergedRowFromSelected,
  mergeSelectedRowsLogic,
  calculateTotalExpense,
  getExpenseRowKey,
} from "@/app/(sidebar)/dashboard/_lib/expenseRows";
import type { ExpenseData, EditableExpenseRow } from "@/app/(sidebar)/dashboard/_types";

function createMockServerRow(id: number, overrides?: Partial<ExpenseData>): ExpenseData {
  return {
    expenseId: id,
    spentAt: "2024-01-15",
    usage: "점심식사",
    cost: 15000,
    mainCategory: "식비",
    subCategory: "외식",
    memo: "테스트 메모",
    ...overrides,
  };
}

function createMockEditableRow(
  id: number,
  overrides?: Partial<EditableExpenseRow>,
): EditableExpenseRow {
  return {
    expenseId: id,
    localId: `exp-${id}`,
    spentAt: "2024-01-15",
    usage: "점심식사",
    cost: 15000,
    mainCategory: "식비",
    subCategory: "외식",
    memo: "테스트 메모",
    isNew: false,
    isDirty: false,
    isDeleted: false,
    ...overrides,
  };
}

describe("expenseRows", () => {
  describe("serverToEditableRow", () => {
    it("서버 데이터가 올바르게 편집 가능한 형태로 변환된다", () => {
      const serverRow = createMockServerRow(1);
      const result = serverToEditableRow(serverRow);

      expect(result.localId).toBe("exp-1");
      expect(result.isNew).toBe(false);
      expect(result.isDirty).toBe(false);
      expect(result.isDeleted).toBe(false);
    });
  });

  describe("mergeRows", () => {
    it("변경되지 않은 데이터는 기존 참조를 유지한다", () => {
      const prevRow = createMockEditableRow(1);
      const newServerRow = createMockServerRow(1);

      expect(isRowEqual(prevRow, newServerRow)).toBe(true);
    });

    it("서버에서 새로운 데이터가 추가되면 새 행으로 추가된다", () => {
      const prevRows = [createMockEditableRow(1)];
      const newServerRows = [createMockServerRow(1), createMockServerRow(2)];

      const merged = mergeRows(prevRows, newServerRows);

      expect(merged.length).toBe(2);
      expect(merged[0]?.expenseId).toBe(1);
      expect(merged[1]?.expenseId).toBe(2);
    });

    it("로컬에만 있는 데이터(isNew=true)가 서버 병합 시 사라진다", () => {
      const localNewRow = createMockEditableRow(0, {
        localId: "local-new-1",
        isNew: true,
        expenseId: 0,
      });
      const prevRows = [createMockEditableRow(1), localNewRow];
      const newServerRows = [createMockServerRow(1)];

      const merged = mergeRows(prevRows, newServerRows);

      expect(merged.length).toBe(1);
      expect(merged.some((r) => r.localId === "local-new-1")).toBe(false);
    });

    it("null과 undefined를 동일하게 취급한다", () => {
      const rowWithNull = createMockEditableRow(1, { memo: null });
      const rowWithUndefined = createMockServerRow(1, { memo: undefined });

      expect(isRowEqual(rowWithNull, rowWithUndefined)).toBe(true);
    });

    it("빈 문자열과 null은 다르게 취급된다", () => {
      const rowWithEmpty = createMockEditableRow(1, { memo: "" });
      const rowWithNull = createMockServerRow(1, { memo: null });

      expect(isRowEqual(rowWithEmpty, rowWithNull)).toBe(false);
    });
  });

  describe("buildPatchPayload", () => {
    it("수정된 행(isDirty=true)만 페이로드에 포함된다", () => {
      const rows = [
        createMockEditableRow(1),
        createMockEditableRow(2, { isDirty: true, usage: "수정됨" }),
      ];

      const { payload } = buildPatchPayload(rows);

      expect(payload?.expenses?.length).toBe(1);
      expect(payload?.expenses?.[0]?.usage).toBe("수정됨");
    });

    it("새로운 행(isNew=true)은 expenseId 없이 전송된다", () => {
      const rows = [
        createMockEditableRow(0, {
          localId: "local-1",
          isNew: true,
          expenseId: 0,
        }),
      ];

      const { payload } = buildPatchPayload(rows);

      expect(payload?.expenses?.length).toBe(1);
      expect(payload?.expenses?.[0]?.isNew).toBe(true);
      expect(payload?.expenses?.[0]?.expenseId).toBeNull();
    });

    it("삭제된 행(isDeleted=true)은 deletedIds에 포함된다", () => {
      const rows = [createMockEditableRow(1, { isDeleted: true })];

      const { payload } = buildPatchPayload(rows);

      expect(payload.deletedIds).toContain(1);
      expect(payload?.expenses?.length).toBe(0);
    });

    it("삭제 행이 expenseId가 없으면 deletedIds에 포함되지 않는다", () => {
      const rows = [
        createMockEditableRow(0, {
          localId: "local-1",
          isDeleted: true,
          expenseId: 0,
        }),
      ];

      const { payload } = buildPatchPayload(rows);

      expect(payload?.deletedIds?.length).toBe(0);
    });
  });

  describe("buildMergedRowFromSelected", () => {
    it("선택된 행들의 비용이 합산된다", () => {
      const selected = [
        createMockEditableRow(1, { cost: 10000, selected: true }),
        createMockEditableRow(2, { cost: 20000, selected: true }),
        createMockEditableRow(3, { cost: 30000, selected: true }),
      ];

      const merged = buildMergedRowFromSelected(selected);

      expect(merged?.cost).toBe(60000);
    });

    it("선택된 행들의 용도가 합쳐진다", () => {
      const selected = [
        createMockEditableRow(1, { usage: "점심", selected: true }),
        createMockEditableRow(2, { usage: "커피", selected: true }),
      ];

      const merged = buildMergedRowFromSelected(selected);

      expect(merged?.usage).toContain("점심");
      expect(merged?.usage).toContain("커피");
    });

    it("날짜는 가장 빠른 날짜가 선택된다", () => {
      const selected = [
        createMockEditableRow(1, { spentAt: "2024-01-20", selected: true }),
        createMockEditableRow(2, { spentAt: "2024-01-15", selected: true }),
        createMockEditableRow(3, { spentAt: "2024-01-25", selected: true }),
      ];

      const merged = buildMergedRowFromSelected(selected);

      expect(merged?.spentAt).toBe("2024-01-15");
    });

    it("날짜가 없는 행들을 병합하면 빈 문자열이 반환된다", () => {
      const selected = [
        createMockEditableRow(1, { spentAt: "", selected: true }),
        createMockEditableRow(2, { spentAt: "", selected: true }),
      ];

      const merged = buildMergedRowFromSelected(selected);

      expect(merged?.spentAt).toBe("");
    });

    it("병합 후 원본 행들은 isDeleted=true로 표시된다", () => {
      const rows = [
        createMockEditableRow(1, { cost: 10000, selected: true }),
        createMockEditableRow(2, { cost: 20000, selected: true }),
        createMockEditableRow(3, { cost: 30000, selected: false }),
      ];

      const result = mergeSelectedRowsLogic(rows);

      expect(result).not.toBeNull();
      expect(result?.length).toBe(4);
      expect(result?.[0]?.isDeleted).toBe(true);
      expect(result?.[1]?.isDeleted).toBe(true);
      expect(result?.[2]?.isDeleted).toBe(false);
    });
  });

  describe("calculateTotalExpense", () => {
    it("숫자 비용들이 정확히 합산된다", () => {
      const rows = [
        createMockEditableRow(1, { cost: 10000 }),
        createMockEditableRow(2, { cost: 20000 }),
        createMockEditableRow(3, { cost: 30000 }),
      ];

      const total = calculateTotalExpense(rows);

      expect(total).toBe(60000);
    });

    it("null, undefined, 빈 문자열은 0으로 처리된다", () => {
      const rows = [
        createMockEditableRow(1, { cost: 0 }),
        createMockEditableRow(2, { cost: undefined }),
        createMockEditableRow(3, { cost: null }),
        createMockEditableRow(4, { cost: 10000 }),
      ];

      const total = calculateTotalExpense(rows);

      expect(total).toBe(10000);
    });
  });

  describe("getExpenseRowKey", () => {
    it("localId가 있으면 localId를 사용한다", () => {
      const row = createMockEditableRow(1, { localId: "custom-id" });

      const key = getExpenseRowKey(row, 0);

      expect(key).toBe("custom-id");
    });

    it("localId가 없고 expenseId가 있으면 expenseId를 사용한다", () => {
      const row = createMockEditableRow(123);

      const key = getExpenseRowKey(row, 0);

      expect(key).toBe("exp-123");
    });
  });
});
