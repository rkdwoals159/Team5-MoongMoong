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
const tooltipStyles = {
  backgroundColor: "var(--color-white-100)",
  borderColor: "var(--color-gray-100)",
  borderRadius: "12px",
  boxShadow: "0 6px 16px rgba(24, 24, 24, 0.12)",
};

const AnnualDiseaseRiskChart = ({
  chartData,
  selectedDiseases,
}: {
  chartData: RiskLineRow[];
  selectedDiseases: SelectedDisease[];
}) => {
  return (
    <div className="h-[300px] w-full pt-600">
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
            domain={[0, 100]}
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
};

export default AnnualDiseaseRiskChart;
