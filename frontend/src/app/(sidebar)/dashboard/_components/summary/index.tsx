import { getCompareLastMonth } from "@/app/(sidebar)/dashboard/_api";
import PetProfileImage from "@/app/(sidebar)/dashboard/_components/summary/PetProfileImage";
import SummaryCardsWrapper from "@/app/(sidebar)/dashboard/_components/summary/SummaryCardsWrapper";

const Summary = async () => {
  const { progressData, imageData } = await getCompareLastMonth();

  return (
    <section className="w-full">
      <div
        className="grid w-full items-stretch gap-500"
        style={{ gridTemplateColumns: "1fr 1fr 210px" }}
      >
        <SummaryCardsWrapper data={progressData} />
        <PetProfileImage image={imageData} />
      </div>
    </section>
  );
};

export default Summary;
