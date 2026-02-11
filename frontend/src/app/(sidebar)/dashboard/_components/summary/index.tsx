import { getCompareLastMonth } from "@/api/dashboardApi";
import PetProfileImage from "@/app/(sidebar)/dashboard/_components/summary/PetProfileImage";
import SummaryCard from "@/app/(sidebar)/dashboard/_components/summary/SummaryCard";

const Summary = async () => {
  const { progressData, petImageUrl } = await getCompareLastMonth();

  return (
    <section className="w-full">
      <div
        className="grid w-full items-stretch gap-500"
        style={{ gridTemplateColumns: "1fr 1fr 210px" }}
      >
        <SummaryCard
          variant="totalExpense"
          data={progressData.totalRatio ?? null}
          petName={progressData.petName ?? ""}
        />
        <SummaryCard
          variant="medicalExpense"
          data={progressData.medicalRatio ?? null}
          petName={progressData.petName ?? ""}
        />
        <PetProfileImage petImageUrl={petImageUrl} />
      </div>
    </section>
  );
};

export default Summary;
