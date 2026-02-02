import Image from "@/components/common/Image/Image";
import ProgressCard from "./ProgressCard";
import type { ProgressSummarySectionProps } from "../_types";
import PageHeader from "@/components/layout/Header/PageHeader";
import { formatMonthLabel } from "@/utils/date";

const ProgressSummarySection = ({ data, image }: ProgressSummarySectionProps) => {
  const now = new Date();
  const monthLabel = formatMonthLabel(now.getFullYear(), now.getMonth());

  return (
    <div className="flex flex-col gap-600">
      {/* TODO: PageHeader 위치 타당성 검토 */}
      <PageHeader title={monthLabel} />
      <div
        className="grid w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(2, minmax(0, 1fr)) 210px`,
        }}
      >
        <ProgressCard
          variant="totalExpense"
          data={data.totalExpense ?? null}
          petName={data.petName ?? ""}
        />
        <ProgressCard
          variant="medicalExpense"
          data={data.medicalExpense ?? null}
          petName={data.petName ?? ""}
        />
        <Image src={image.src} alt="강아지 이미지" width={210} height={210} isHoverable={true} />
      </div>
    </div>
  );
};

export default ProgressSummarySection;
