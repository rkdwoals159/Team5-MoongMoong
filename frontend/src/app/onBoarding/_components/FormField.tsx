import { cn } from "@/utils/style";
import type { FormFieldProps } from "@/app/onBoarding/_types";

/**
 * 온보딩 입력 필드의 공통 라벨/레이아웃을 렌더링한다.
 */
export default function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-[10px]", className ?? "")}>
      <div className="typo-title-m-bold text-gray-700">{label}</div>
      {children}
    </div>
  );
}
