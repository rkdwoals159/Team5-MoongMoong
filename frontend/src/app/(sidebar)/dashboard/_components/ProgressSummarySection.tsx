import Image from "@/components/common/Image/Image";
import ProgressCard from "./ProgressCard";
import type { ProgressSummarySectionProps } from "../_types/dashboard.type";

const ProgressSummarySection = ({ data, image }: ProgressSummarySectionProps) => {
  return (
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
  );
};

export default ProgressSummarySection;
