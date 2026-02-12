import {
  CHART_LABEL_LABEL_GAP,
  CHART_LABEL_LINE_GAP,
  CHART_LABEL_LINE_LENGTH,
  CHART_LABEL_RADIAN,
} from "@/app/(sidebar)/analysis/_constants";
import { PieChartLabelLayoutParams } from "../_types";
import { formatRatio } from "../_utils";
import { getChartLabelFromPayload } from "./getChartLabelFromPayload";

export const getPieChartLabelLayout = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
}: PieChartLabelLayoutParams) => {
  const radius = typeof outerRadius === "number" ? outerRadius : Number(outerRadius ?? 0);
  const resolvedRadius = Number.isFinite(radius) && radius > 0 ? radius : 0;

  const ratio = formatRatio(payload?.ratio ?? percent ?? 0);
  const label = getChartLabelFromPayload(payload);
  const angle = -(midAngle ?? 0) * CHART_LABEL_RADIAN;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const lineStartX = cx + (resolvedRadius + CHART_LABEL_LINE_GAP) * cos;
  const lineY = cy + (resolvedRadius + CHART_LABEL_LINE_GAP) * sin;
  const lineEndX = lineStartX + (cos >= 0 ? CHART_LABEL_LINE_LENGTH : -CHART_LABEL_LINE_LENGTH);

  const textX = lineEndX + (cos >= 0 ? CHART_LABEL_LABEL_GAP : -CHART_LABEL_LABEL_GAP);
  const textAnchor = cos >= 0 ? "start" : "end";

  return {
    ratio,
    label,
    lineStartX,
    lineY,
    lineEndX,
    textX,
    textAnchor,
  };
};
