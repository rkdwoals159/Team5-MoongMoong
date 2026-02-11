import { describe, it, expect, vi } from "vitest";
import { getPieChartLabelLayout } from "@/app/(sidebar)/analysis/_lib/pieChartLabelLayout";

vi.mock("@/app/(sidebar)/analysis/_constants", () => ({
  CHART_LABEL_RADIAN: Math.PI / 180,
  CHART_LABEL_LINE_GAP: 10,
  CHART_LABEL_LINE_LENGTH: 20,
  CHART_LABEL_LABEL_GAP: 8,
}));

describe("getPieChartLabelLayout", () => {
  const baseParams = {
    cx: 200,
    cy: 200,
    midAngle: 0,
    outerRadius: 100,
    percent: 0,
  };

  it("기본 레이아웃을 올바르게 계산한다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    expect(result.ratio).toBe(42);
    expect(result.label).toBe("의료비");
    expect(result.textAnchor).toBe("start");
  });

  it("오른쪽 반구(cos >= 0)에서 textAnchor가 start이다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      midAngle: 0, // cos(0) = 1
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    expect(result.textAnchor).toBe("start");
  });

  it("왼쪽 반구(cos < 0)에서 textAnchor가 end이다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      midAngle: 180, // cos(180) = -1
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    expect(result.textAnchor).toBe("end");
  });

  it("outerRadius가 문자열인 경우 숫자로 변환한다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      outerRadius: "100",
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    expect(result.ratio).toBe(42);
  });

  it("outerRadius가 유효하지 않으면 0으로 처리한다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      outerRadius: NaN,
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    // radius가 0이면 lineStartX = cx + 0 * cos = cx
    expect(result.lineStartX).toBe(baseParams.cx + 10); // CHART_LABEL_LINE_GAP = 10
  });

  it("payload가 없으면 빈 레이블을 반환한다", () => {
    const result = getPieChartLabelLayout({
      ...baseParams,
      percent: 0.5,
    });

    expect(result.label).toBe("");
    // percent는 0~1 사이 값이므로 formatRatio(0.5) = Math.round(0.5 * 100) = 50
    expect(result.ratio).toBe(50);
  });

  it("좌표 계산이 올바른지 확인한다", () => {
    const result = getPieChartLabelLayout({
      cx: 100,
      cy: 100,
      midAngle: 0, // angle = 0, cos = 1, sin = 0
      outerRadius: 50,
      percent: 0,
      payload: { category: "의료비", cost: 1000, ratio: 42.3 },
    });

    // lineStartX = 100 + (50 + 10) * 1 = 160
    expect(result.lineStartX).toBe(160);
    // lineY = 100 + (50 + 10) * 0 = 100
    expect(result.lineY).toBe(100);
    // lineEndX = 160 + 20 = 180 (cos >= 0이므로 +)
    expect(result.lineEndX).toBe(180);
    // textX = 180 + 8 = 188 (cos >= 0이므로 +)
    expect(result.textX).toBe(188);
  });
});
