import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PieLabelRenderProps } from "recharts";

import renderPieChartLabel from "@/app/(sidebar)/analysis/_components/chart/PieChartLabel";

const baseProps = {
  cx: 200,
  cy: 200,
  midAngle: 0,
  outerRadius: 110,
  percent: 0.2,
  payload: {
    category: "의료비",
    cost: 20000,
    ratio: 20,
  },
} as PieLabelRenderProps;

describe("renderPieChartLabel", () => {
  it("라벨 비율이 기준 이상이면 라벨을 렌더링한다", () => {
    const label = renderPieChartLabel(baseProps);

    render(<svg>{label}</svg>);

    expect(screen.getByText("의료비")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("라벨 비율이 기준 미만이면 라벨을 렌더링하지 않는다", () => {
    const label = renderPieChartLabel({
      ...baseProps,
      percent: 0.044,
      payload: {
        category: "기타",
        cost: 4400,
        ratio: 4.4,
      },
    } as PieLabelRenderProps);

    expect(label).toBeNull();
  });
});
