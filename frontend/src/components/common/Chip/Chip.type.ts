export type ChipMajorColor =
  | "green"
  | "purple"
  | "blue"
  | "red"
  | "turquoise"
  | "orange"
  | "yellow"
  | "gray";

type ChipBaseProps = {
  label: string;
  price?: number;
  className?: string;
};

/**
 * Chip 컴포넌트 Props
 * - level: "major" | "minor"
 * - major인 경우엔 color가 필수, minor인 경우엔 color가 선택사항이므로 옵셔널 체이닝을 사용함
 */
export type ChipProps =
  | (ChipBaseProps & { level: "major"; color: ChipMajorColor })
  | (ChipBaseProps & { level: "minor"; color?: "none" });
