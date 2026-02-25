import { getCompareLastMonth } from "@/api/server/dashboardApi";
import PetProfileImage from "@/app/(sidebar)/dashboard/_components/summary/PetProfileImage";
import SummaryCard from "@/app/(sidebar)/dashboard/_components/summary/SummaryCard";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";
import SummaryWrapper from "./SummaryWrapper";
import SummaryCardWrapper from "./SummaryCardWrapper";

const Summary = async () => {
  const summaryResult = await safeServerFetch(() => getCompareLastMonth());
  if (summaryResult instanceof Error) {
    return (
      <SummaryWrapper>
        <SummaryCardWrapper>
          <ServerComponentErrorFallback message={summaryResult.message} />
        </SummaryCardWrapper>
        <SummaryCardWrapper>
          <ServerComponentErrorFallback message={summaryResult.message} />
        </SummaryCardWrapper>
        <PetProfileImage petImageUrl={""} />
      </SummaryWrapper>
    );
  }

  const { progressData, petImageUrl } = summaryResult;

  return (
    <SummaryWrapper>
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
    </SummaryWrapper>
  );
};

export default Summary;
