import type { PieLabelRenderProps, TextAnchor } from "recharts";

import { getPieChartLabelLayout } from "@/app/(sidebar)/analysis/_lib/pieChartLabelLayout";
import {
  CHART_LABEL_LABEL_GAP,
  CHART_LABEL_MIN_VISIBLE_RATIO,
  CHART_LABEL_RATIO_GAP,
} from "@/app/(sidebar)/analysis/_constants";

export default function renderPieChartLabel(props: PieLabelRenderProps) {
  const { ratio, label, lineStartX, lineY, lineEndX, textX, textAnchor } =
    getPieChartLabelLayout(props);

  if (ratio < CHART_LABEL_MIN_VISIBLE_RATIO) {
    return null;
  }

  return (
    <g>
      <line
        x1={lineStartX}
        y1={lineY}
        x2={lineEndX}
        y2={lineY}
        stroke="var(--color-gray-100)"
        strokeWidth={1}
      />
      <text
        x={textX}
        y={lineY - CHART_LABEL_LABEL_GAP}
        textAnchor={textAnchor as TextAnchor}
        className="typo-body-m-bold"
        fill="var(--color-gray-600)"
      >
        {label || "-"}
      </text>
      <text
        x={textX}
        y={lineY + CHART_LABEL_RATIO_GAP}
        textAnchor={textAnchor as TextAnchor}
        className="typo-body-l-bold"
        fill="var(--color-gray-800)"
      >
        {ratio}%
      </text>
    </g>
  );
}
