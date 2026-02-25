import type { MedicalExpenseHeaderProps } from "@/app/(sidebar)/forecast/_types";
export default function MedicalExpenseHeader({
  subtitle = "2026년 기준, 주의가 필요한 질병 안내",
  title = "올해 주의 질병과 평균 의료비",
}: MedicalExpenseHeaderProps) {
  return (
    <div className={headerClasses}>
      <div className={titleContainerClasses}>
        <p className={subtitleClasses}>{subtitle}</p>
        <h2 className={titleClasses}>{title}</h2>
      </div>
    </div>
  );
}

const headerClasses = "flex items-start justify-between gap-500";
const titleContainerClasses = "flex flex-col gap-200";
const subtitleClasses = "typo-body-l-medium text-gray-500";
const titleClasses = "typo-headline-l-bold text-gray-800";
