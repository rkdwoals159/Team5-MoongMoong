import type { MedicalExpenseProps } from "@/app/(sidebar)/forecast/_types";
import MedicalExpenseTabs from "./MedicalExpenseTabs";
import MedicalExpenseTreatments from "./MedicalExpenseTreatments";
import { PAGE_SIZE } from "@/app/(sidebar)/forecast/_constants";
import MedicalExpenseWrapper from "./MedicalExpenseWrapper";

export default function MedicalExpense({
  diseaseList,
  selectedDisease,
  costData,
  currentPage,
}: MedicalExpenseProps) {
  const totalPages = Math.ceil(costData.length / PAGE_SIZE);
  const visibleTreatments = costData.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <MedicalExpenseWrapper>
      <MedicalExpenseTabs diseaseList={diseaseList} selectedDisease={selectedDisease} />
      <MedicalExpenseTreatments
        visibleTreatments={visibleTreatments}
        totalPages={totalPages}
        selectedDisease={selectedDisease}
        currentPage={currentPage}
      />
    </MedicalExpenseWrapper>
  );
}
