import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { buildExpenseColumns } from "@/app/(sidebar)/analysis/_lib/ExpenseColumns";
import { components } from "@/types/schema";
import { formatDateWithDots } from "@/utils/date";
import { formatAmountPlain } from "@/utils/amount";

type GroupExpenseResponse = components["schemas"]["GroupExpenseResponse"];

describe("buildExpenseColumns", () => {
  const mockExpense: GroupExpenseResponse = {
    expenseId: 1,
    spendAt: "2026-02-11",
    nickName: "테스트유저",
    usage: "강아지 약 구매",
    cost: 50000,
    mainCategory: "의료비",
    subCategory: "약/처방",
    memo: "월 1회 정기 구매",
    modifiedAt: "2026-02-11T12:00:00",
  };

  it("올바른 개수의 컬럼을 생성한다", () => {
    const columns = buildExpenseColumns();
    expect(columns).toHaveLength(6);
  });

  it("날짜 컬럼이 올바르게 포맷팅된다", () => {
    const columns = buildExpenseColumns();
    const dateColumn = columns[0];

    expect(dateColumn?.label).toBe("날짜");
    expect(dateColumn?.accessor).toBe("spendAt");

    const { container } = render(<>{dateColumn?.render?.(mockExpense.spendAt, mockExpense, 0)}</>);
    expect(container.textContent).toContain(formatDateWithDots(String(mockExpense.spendAt)));
  });

  it('날짜가 없으면 "-"를 표시한다', () => {
    const columns = buildExpenseColumns();
    const dateColumn = columns[0];

    const { container } = render(<>{dateColumn?.render?.(null, mockExpense, 0)}</>);
    expect(container.textContent).toContain("-");
  });

  it("닉네임 컬럼이 올바르게 렌더링된다", () => {
    const columns = buildExpenseColumns();
    const nicknameColumn = columns[1];

    expect(nicknameColumn?.label).toBe("닉네임");
    expect(nicknameColumn?.accessor).toBe("nickName");

    const { container } = render(
      <>{nicknameColumn?.render?.(mockExpense.nickName, mockExpense, 0)}</>,
    );
    expect(container.textContent).toContain(String(mockExpense.nickName));
  });

  it("항목 컬럼이 mainCategory와 subCategory를 모두 표시한다", () => {
    const columns = buildExpenseColumns();
    const categoryColumn = columns[2];

    expect(categoryColumn?.label).toBe("항목");
    expect(categoryColumn?.accessor).toBe("mainCategory");

    const { container } = render(
      <>{categoryColumn?.render?.(mockExpense.mainCategory, mockExpense, 0)}</>,
    );
    expect(container.textContent).toContain(String(mockExpense.mainCategory));
    expect(container.textContent).toContain(String(mockExpense.subCategory));
  });

  it("subCategory가 없으면 mainCategory만 표시한다", () => {
    const columns = buildExpenseColumns();
    const categoryColumn = columns[2];

    const expenseWithoutSub = { ...mockExpense, subCategory: undefined };
    const { container } = render(
      <>{categoryColumn?.render?.(expenseWithoutSub.mainCategory, expenseWithoutSub, 0)}</>,
    );

    expect(container.textContent).toContain(String(expenseWithoutSub.mainCategory));
    expect(container.textContent).not.toContain(String(expenseWithoutSub.subCategory));
  });

  it('mainCategory가 없으면 "기타"를 표시한다', () => {
    const columns = buildExpenseColumns();
    const categoryColumn = columns[2];

    const expenseWithoutMain = { ...mockExpense, mainCategory: undefined };
    const { container } = render(
      <>{categoryColumn?.render?.(expenseWithoutMain.mainCategory, expenseWithoutMain, 0)}</>,
    );

    expect(container.textContent).toContain("기타");
  });

  it("사용내역 컬럼이 올바르게 렌더링된다", () => {
    const columns = buildExpenseColumns();
    const usageColumn = columns[3];

    expect(usageColumn?.label).toBe("사용내역");
    expect(usageColumn?.accessor).toBe("usage");

    const { container } = render(<>{usageColumn?.render?.(mockExpense.usage, mockExpense, 0)}</>);
    expect(container.textContent).toContain(String(mockExpense.usage));
  });

  it("비용 컬럼이 숫자 포맷팅을 적용한다", () => {
    const columns = buildExpenseColumns();
    const costColumn = columns[4];

    expect(costColumn?.label).toBe("비용");
    expect(costColumn?.accessor).toBe("cost");

    const { container } = render(<>{costColumn?.render?.(mockExpense.cost, mockExpense, 0)}</>);
    expect(container.textContent).toContain(formatAmountPlain(Number(mockExpense.cost)));
  });

  it("메모 컬럼이 올바르게 렌더링된다", () => {
    const columns = buildExpenseColumns();
    const memoColumn = columns[5];

    expect(memoColumn?.label).toBe("메모");
    expect(memoColumn?.accessor).toBe("memo");

    const { container } = render(<>{memoColumn?.render?.(mockExpense.memo, mockExpense, 0)}</>);
    expect(container.textContent).toContain(String(mockExpense.memo));
  });
});
