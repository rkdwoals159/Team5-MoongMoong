"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

import AnalysisChartEmpty from "./AnalysisChartEmpty";
import AnalysisChartTooltip from "./AnalysisChartTooltip";
import renderPieChartLabel from "./PieChartLabel";
import { CHART_COLORS_MAP } from "@/app/(sidebar)/analysis/_constants";
import type { CategoryAnalysisChartProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

export default function CategoryAnalysisChart({ data }: CategoryAnalysisChartProps) {
  if (!data.length) {
    return <AnalysisChartEmpty message="지출 데이터가 아직 없어요" />;
  }

  const chartData = data.map((entry, index) => ({
    ...entry,
    fill: CHART_COLORS_MAP[index % CHART_COLORS_MAP.length],
  }));

  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200} debounce={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="cost"
            nameKey="label"
            innerRadius={60}
            outerRadius={110}
            label={renderPieChartLabel}
            labelLine={false}
            isAnimationActive={false}
          />
          <RechartsTooltip<number, string>
            content={(props) => <AnalysisChartTooltip {...props} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
