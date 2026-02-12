import PaginationButton from "@/components/common/PaginationButton/PaginationButton";
import TreatmentCard from "@/app/(sidebar)/forecast/_components/medical-expense/TreatmentCard";
import Link from "next/link";
import type { MedicalExpenseTreatmentsProps } from "@/app/(sidebar)/forecast/_types/medicalExpense";
const MedicalExpenseTreatments = ({
  visibleTreatments,
  totalPages,
  selectedDisease,
  currentPage,
}: MedicalExpenseTreatmentsProps) => {
  return (
    <div className={cardsContainerClasses}>
      <div className={cardsGridClasses}>
        {visibleTreatments.length === 0 ? (
          <p className={emptyMessageClasses}>아직 정보가 없습니다.</p>
        ) : (
          visibleTreatments.map((treatment) => (
            <TreatmentCard
              key={`${treatment.name}-${treatment.description}`}
              treatment={treatment}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <>
          {/* TODO: 페이지네이션 버튼 nesting 해결 */}
          {currentPage > 0 && (
            <Link
              href={`?disease=${selectedDisease}&page=${currentPage - 1}`}
              scroll={false}
              className="absolute left-[-23px] top-1/2 -translate-y-1/2"
            >
              <PaginationButton direction="left" />
            </Link>
          )}
          {currentPage < totalPages - 1 && (
            <Link
              href={`?disease=${selectedDisease}&page=${currentPage + 1}`}
              scroll={false}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2"
            >
              <PaginationButton direction="right" />
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default MedicalExpenseTreatments;

const cardsContainerClasses = "flex flex-col gap-500 relative";
const cardsGridClasses = "grid grid-cols-3 gap-400";
const emptyMessageClasses = "col-span-3 py-400 text-center typo-body-l-medium text-text-sub";
