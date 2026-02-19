import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { MedicalAnalysisChartCard } from "@/app/(sidebar)/analysis/_components/chart/AnalysisCharts";

vi.mock("@/components/common/InfoTooltip/InfoTooltip", () => ({
  default: () => null,
}));

vi.mock("@/app/(sidebar)/analysis/_components/chart/MedicalAnalysisChart", () => ({
  default: () => null,
}));

describe("MedicalAnalysisChartCard", () => {
  it("반려동물 정보가 없으면 기본 이름으로 제목을 노출한다", async () => {
    const ui = await MedicalAnalysisChartCard({
      petInfoPromise: Promise.resolve(null),
      medicalPromise: Promise.resolve({ total: 0, items: [] }),
    });

    const { container } = render(ui);

    expect(container.textContent).toContain("반려동물의 의료비");
  });
});
