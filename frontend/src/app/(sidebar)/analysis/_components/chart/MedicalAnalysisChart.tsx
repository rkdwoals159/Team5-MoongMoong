"use client";

import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip as RechartsTooltip } from "recharts";
import type { PieSectorShapeProps } from "recharts";

import AnalysisChartEmpty from "@/app/(sidebar)/analysis/_components/chart/AnalysisChartEmpty";
import AnalysisChartTooltip from "@/app/(sidebar)/analysis/_components/chart/AnalysisChartTooltip";
import renderPieChartLabel from "@/app/(sidebar)/analysis/_components/chart/PieChartLabel";
import { CHART_COLORS_MAP } from "@/app/(sidebar)/analysis/_constants";
import type { MedicalAnalysisChartProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";

export default function MedicalAnalysisChart({ data }: MedicalAnalysisChartProps) {
  if (!data.length) {
    return <AnalysisChartEmpty message="의료비 데이터가 아직 없어요." />;
  }

  const renderSector = (props: PieSectorShapeProps) => {
    const color = CHART_COLORS_MAP[props.index % CHART_COLORS_MAP.length];
    return <Sector {...props} fill={color} />;
  };

  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200} debounce={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="cost"
            nameKey="label"
            outerRadius={110}
            shape={renderSector}
            label={renderPieChartLabel}
            labelLine={false}
            isAnimationActive={true}
            animationDuration={900}
          />
          <RechartsTooltip<number, string>
            content={(props) => <AnalysisChartTooltip {...props} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
