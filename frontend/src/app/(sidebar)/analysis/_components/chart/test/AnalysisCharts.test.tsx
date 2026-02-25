import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import {
  CategoryAnalysisChartCard,
  MedicalAnalysisChartCard,
} from "@/app/(sidebar)/analysis/_components/chart/AnalysisCharts";

vi.mock("@/components/common/InfoTooltip/InfoTooltip", () => ({
  default: () => null,
}));

vi.mock("@/app/(sidebar)/analysis/_components/chart/MedicalAnalysisChart", () => ({
  default: () => null,
}));

vi.mock("@/app/(sidebar)/analysis/_components/chart/CategoryAnalysisChart", () => ({
  default: () => null,
}));

vi.mock("@/assets/icons/analysis/ic_warning.svg", () => ({ default: () => null }));

describe("MedicalAnalysisChartCard", () => {
  it("반려동물 정보가 없으면 기본 이름으로 제목을 노출한다", async () => {
    const ui = await MedicalAnalysisChartCard({
      petInfoPromise: Promise.resolve(null),
      medicalPromise: Promise.resolve({ total: 0, items: [] }),
    });

    const { container } = render(ui);

    expect(container.textContent).toContain("반려동물의 의료비");
  });

  it("의료비 조회에 실패하면 서버 폴백을 노출한다", async () => {
    const ui = await MedicalAnalysisChartCard({
      petInfoPromise: Promise.resolve(null),
      medicalPromise: Promise.resolve(new Error("의료비 조회 실패")),
    });

    const { container } = render(ui);

    expect(container.textContent).toContain("의료비 조회 실패");
  });
});

describe("CategoryAnalysisChartCard", () => {
  it("카테고리 조회에 실패하면 서버 폴백을 노출한다", async () => {
    const ui = await CategoryAnalysisChartCard({
      categoryPromise: Promise.resolve(new Error("카테고리 조회 실패")),
    });

    const { container } = render(ui);

    expect(container.textContent).toContain("카테고리 조회 실패");
  });
});
