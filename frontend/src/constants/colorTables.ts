import type { ChipMajorColor } from "@/components/common/Chip/chip.type";

export const CATEGORY_COLOR_MAP: Record<string, ChipMajorColor> = {
  "사료/간식": "orange",
  의료비: "red",
  미용: "green",
  물품구매비: "purple",
  기타: "gray",
};

export const DEFAULT_CATEGORY_COLOR: ChipMajorColor = "gray";

export const ANALYSIS_CHART_COLORS = [
  "var(--color-yellow-500)",
  "var(--color-yellow-300)",
  "var(--color-yellow-200)",
  "var(--color-yellow-150)",
  "var(--color-yellow-100)",
  "var(--color-gray-50)",
] as const;

export const FORECAST_DEFAULT_COLOR = "var(--color-gray-500)";

export const FORECAST_INDICATOR_PALETTE = [
  "var(--color-red-500)",
  "var(--color-amber-500)",
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
  "var(--color-cyan-500)",
] as const;
