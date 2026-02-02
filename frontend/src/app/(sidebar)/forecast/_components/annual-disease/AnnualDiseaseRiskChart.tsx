import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DiseaseCode, RiskLineRow } from "@/app/(sidebar)/forecast/_types";
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
  selectedDiseases: DiseaseCode[];
}) => {
  return (
    <div className="h-[260px] w-full pt-600">
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
            labelStyle={{ color: "var(--color-gray-600)", fontSize: 12 }}
            formatter={(value, code) => {
              return [`${value}%`, `${DISEASE_CODE_FULL_NAMES[code as DiseaseCode]} 위험도`];
            }}
          />
          {selectedDiseases.map((code, index) => (
            <Line
              key={`${code}-${index}`}
              type="monotone"
              dataKey={code}
              stroke={resolveIndicatorColor(index + 1)}
              strokeWidth={3}
              dot={{ r: 3, fill: resolveIndicatorColor(index + 1) }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnnualDiseaseRiskChart;

// TODO: className 변수로 정의
const indicatorPalette = [
  "var(--color-red-500)",
  "var(--color-yellow-500)",
  "var(--color-blue-500)",
  "var(--color-green-500)",
  "var(--color-purple-500)",
  "var(--color-pink-500)",
  "var(--color-orange-500)",
  "var(--color-lime-500)",
  "var(--color-indigo-500)",
  "var(--color-turquoise-500)",
  "var(--color-fuchsia-500)",
  "var(--color-lightblue-500)",
];

const resolveIndicatorColor = (rank?: number) => {
  if (!rank || rank < 1) {
    return "var(--color-gray-500)";
  }
  const index = Math.min(rank - 1, indicatorPalette.length - 1);
  return indicatorPalette[index];
};
