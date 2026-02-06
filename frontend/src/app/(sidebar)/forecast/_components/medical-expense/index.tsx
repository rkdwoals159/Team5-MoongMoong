import { MedicalExpenseProps } from "@/app/(sidebar)/forecast/_types";
import MedicalExpenseHeader from "./MedicalExpenseHeader";
import MedicalExpenseTabs from "./MedicalExpenseTabs";
import MedicalExpenseTreatments from "./MedicalExpenseTreatments";
import { PAGE_SIZE } from "@/app/(sidebar)/forecast/_constants";

const MedicalExpense = ({
  diseaseList,
  selectedDisease,
  costData,
  currentPage,
}: MedicalExpenseProps) => {
  const totalPages = Math.ceil(costData.length / PAGE_SIZE);
  const visibleTreatments = costData.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <section>
      <div className={containerClasses}>
        <MedicalExpenseHeader />
        <MedicalExpenseTabs diseaseList={diseaseList} selectedDisease={selectedDisease} />
        <MedicalExpenseTreatments
          visibleTreatments={visibleTreatments}
          totalPages={totalPages}
          selectedDisease={selectedDisease}
          currentPage={currentPage}
        />
      </div>
    </section>
  );
};

export default MedicalExpense;

// Tailwind CSS classes
const containerClasses =
  "flex flex-col gap-600 rounded-500 border border-gray-100 bg-white-100 p-600 overflow-hidden w-full mb-[150px]";
