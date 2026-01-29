import PaginationButton from "@/components/common/PaginationButton/PaginationButton";
import TreatmentCard from "@/app/(sidebar)/forecast/_components/medical-expense/TreatmentCard";
import SkeletonCard from "@/app/(sidebar)/forecast/_components/medical-expense/TreatmentSkeletonCard";
import { DiseaseCostResponse } from "@/app/(sidebar)/forecast/forecast.type";

type Treatment = DiseaseCostResponse["treatments"][number];

type MedicalExpenseTreatmentsProps = {
  isLoading: boolean;
  visibleTreatments: Treatment[];
  skeletonCount: number;
  totalPages: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const MedicalExpenseTreatments = ({
  isLoading,
  visibleTreatments,
  skeletonCount,
  totalPages,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: MedicalExpenseTreatmentsProps) => {
  return (
    <div className={cardsContainerClasses}>
      <div className={cardsGridClasses}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)
          : visibleTreatments.map((treatment) => (
              <TreatmentCard key={treatment.name} treatment={treatment} />
            ))}
      </div>

      {!isLoading && totalPages > 1 && (
        <>
          {canGoPrev && (
            <PaginationButton
              direction="left"
              isDisabled={false}
              className="absolute left-[-23px] top-1/2 -translate-y-1/2"
              onClick={onPrev}
            />
          )}
          {canGoNext && (
            <PaginationButton
              direction="right"
              isDisabled={false}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2"
              onClick={onNext}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MedicalExpenseTreatments;

const cardsContainerClasses = "flex flex-col gap-500 relative";
const cardsGridClasses = "grid grid-cols-3 gap-400";
