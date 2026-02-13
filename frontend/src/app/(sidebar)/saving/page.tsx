import SavingClient from "./_components/SavingClient";
import MakeNewSaving from "./_components/piggybank/MakeNewSaving";
import { getBankInfoServer, getBankCoins } from "@/api/savingApiQueries";
import { getPetInfo } from "@/api/analysisApi";

export default async function SavingPage() {
  const bankInfo = await getBankInfoServer();

  if (!bankInfo) {
    return <MakeNewSaving />;
  }

  const [coinsResponse, petInfoResponse] = await Promise.all([getBankCoins(), getPetInfo()]);
  return (
    <>
      <main className="flex gap-700 flex-1 min-h-0 min-w-0">
        <SavingClient
          bankInfo={bankInfo}
          coins={coinsResponse.coins ?? []}
          petName={petInfoResponse?.petName ?? "반려동물"}
        />
      </main>
    </>
  );
}
