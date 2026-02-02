import MedicalExpenseHeader from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpenseHeader";
import TreatmentSkeletonCard from "@/app/(sidebar)/forecast/_components/medical-expense/TreatmentSkeletonCard";

export default function MedicalExpenseLoading() {
  return (
    <section>
      <MedicalExpenseHeader />
      {/* 탭 스켈레톤 + 카드 스켈레톤 */}
      <div className="grid grid-cols-3 gap-400">
        {Array.from({ length: 3 }).map((_, i) => (
          <TreatmentSkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
