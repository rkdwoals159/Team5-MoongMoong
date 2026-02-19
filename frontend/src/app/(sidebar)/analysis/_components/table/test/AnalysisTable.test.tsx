import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import AnalysisTable from "@/app/(sidebar)/analysis/_components/table/AnalysisTable";
import type { components } from "@/types/schema";

type GroupExpenseResponse = components["schemas"]["GroupExpenseResponse"];

const rows: GroupExpenseResponse[] = Array.from({ length: 30 }, (_, index) => ({
  expenseId: index + 1,
  spendAt: "2026-02-11",
  nickName: `테스터-${index + 1}`,
  usage: "정기 검진",
  cost: 10000 + index,
  mainCategory: "의료비",
  subCategory: "진료",
  memo: "메모",
  modifiedAt: "2026-02-11T12:00:00",
}));

describe("AnalysisTable", () => {
  it("테이블 영역은 고정 높이 + 내부 스크롤 구조를 유지한다", async () => {
    const ui = await AnalysisTable({
      petInfoPromise: Promise.resolve({
        petName: "몽몽",
      } as components["schemas"]["PetReadResponse"]),
      expensesPromise: Promise.resolve(rows),
    });

    const { container } = render(ui);
    const boundedContainer = container.querySelector("div.relative");
    const scrollContainer = container.querySelector(".data-table-scroll");

    expect(boundedContainer?.className).toContain("h-[336px]");
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.className).toContain("overflow-auto");
    expect(scrollContainer?.parentElement?.className).toContain("h-full");
  });

  it("반려동물 정보가 없으면 안내 문구에 기본 이름을 사용한다", async () => {
    const ui = await AnalysisTable({
      petInfoPromise: Promise.resolve(null),
      expensesPromise: Promise.resolve(rows),
    });

    const { container } = render(ui);

    expect(container.textContent).toContain("우리 가족이 반려동물에게 쓴 비용");
  });
});
