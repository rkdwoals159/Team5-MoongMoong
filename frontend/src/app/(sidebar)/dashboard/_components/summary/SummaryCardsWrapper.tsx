import { SummaryCardsWrapperProps } from "@/app/(sidebar)/dashboard/_types";
import SummaryCard from "@/app/(sidebar)/dashboard/_components/summary/SummaryCard";

const SummaryCardsWrapper = ({ data }: SummaryCardsWrapperProps) => {
  return (
    <>
      <SummaryCard
        variant="totalExpense"
        data={data.totalExpense ?? null}
        petName={data.petName ?? ""}
      />
      <SummaryCard
        variant="medicalExpense"
        data={data.medicalExpense ?? null}
        petName={data.petName ?? ""}
      />
    </>
  );
};

export default SummaryCardsWrapper;
