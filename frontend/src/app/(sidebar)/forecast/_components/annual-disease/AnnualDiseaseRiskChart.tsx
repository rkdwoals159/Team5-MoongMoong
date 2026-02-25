"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DiseaseCode, RiskLineRow, SelectedDisease } from "@/app/(sidebar)/forecast/_types";
import { DISEASE_CODE_FULL_NAMES } from "@/app/(sidebar)/forecast/_constants";
import { LINECHART_Y_PADDING } from "@/app/(sidebar)/forecast/_constants";

const tooltipStyles = {
  backgroundColor: "var(--color-white-100)",
  borderColor: "var(--color-gray-100)",
  borderRadius: "12px",
  boxShadow: "0 6px 16px rgba(24, 24, 24, 0.12)",
};

export default function AnnualDiseaseRiskChart({
  chartData,
  selectedDiseases,
}: {
  chartData: RiskLineRow[];
  selectedDiseases: SelectedDisease[];
}) {
  const maxValue = Math.max(
    0,
    ...chartData.flatMap((row) => selectedDiseases.map((d) => row[d.code] ?? 0)),
  );
  const yMax = maxValue + LINECHART_Y_PADDING;

  if (selectedDiseases.length === 0) return <NoSelectedDiseasesChart />;

  return (
    <div className="h-[320px] w-full pt-600">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-gray-100)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "var(--color-gray-500)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-gray-100)" }}
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fill: "var(--color-gray-500)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyles}
            wrapperStyle={{ zIndex: 100 }}
            labelStyle={{ color: "var(--color-gray-600)", fontSize: 12 }}
            formatter={(value, code) => {
              return [`${value}%`, DISEASE_CODE_FULL_NAMES[code as DiseaseCode]];
            }}
            itemStyle={{ fontWeight: 500 }}
            itemSorter={(item) => -(Number(item.value) || 0)}
          />
          {selectedDiseases.map((disease) => (
            <Line
              key={disease.code}
              type="monotone"
              dataKey={disease.code}
              stroke={disease.color}
              strokeWidth={3}
              dot={{ r: 3, fill: disease.color }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function NoSelectedDiseasesChart() {
  return (
    <div className="flex h-[320px] w-full items-center justify-center pt-600">
      <p className="text-body-m text-gray-500">선택된 질환이 없습니다.</p>
    </div>
  );
}
