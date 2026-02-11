import type { TooltipContentProps } from "recharts";

import Chip from "@/components/common/Chip/Chip";
import { formatAmountPlain } from "@/utils/amount";
import { formatRatio } from "@/app/(sidebar)/analysis/_utils";
import type { ChartPayloadType } from "@/app/(sidebar)/analysis/_types";
import { getChartLabelFromPayload } from "@/app/(sidebar)/analysis/_lib/getChartLabelFromPayload";
import { CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR } from "@/constants/colorTables";
export default function AnalysisChartTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const data = item?.payload as ChartPayloadType;
  const label = getChartLabelFromPayload(data);
  const ratio = formatRatio(data?.ratio);
  const rawValue = typeof item?.value === "number" ? item.value : (data?.cost ?? 0);
  const color = CATEGORY_COLOR_MAP[label] || DEFAULT_CATEGORY_COLOR;
  return (
    <div className={tooltipContainerClasses}>
      <div className="flex w-full items-start justify-between gap-300">
        <div className="flex flex-col gap-200">
          <Chip label={label} level="major" color={color} />
          <span className="typo-caption-s-medium text-gray-400">
            {formatAmountPlain(Number(rawValue))}원
          </span>
        </div>
        <span className="typo-body-m-bold text-gray-800">{ratio}%</span>
      </div>
    </div>
  );
}

const tooltipContainerClasses =
  "flex w-[132px] items-start rounded-[var(--radius-200)] border border-[var(--color-gray-50)] bg-[var(--color-white-100)] px-[var(--spacing-400)] py-[var(--spacing-300)] shadow-[0px_2px_6px_0px_var(--color-gray-100)]";
