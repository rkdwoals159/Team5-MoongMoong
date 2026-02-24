import SavingClient from "./_components/SavingClient";
import MakeNewSaving from "./_components/piggybank/MakeNewSaving";
import { getBank, getBankCoins } from "@/api/client/savingApi";
import { getPetInfo } from "@/api/server/petApi";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function SavingPage() {
  const bankInfoResult = await safeServerFetch(() => getBank());
  if (bankInfoResult instanceof Error) {
    return <ServerComponentErrorFallback message={bankInfoResult.message} />;
  }
  const bankInfo = bankInfoResult;

  if (!bankInfo) {
    return <MakeNewSaving />;
  }

  const savingsResult = await safeServerFetch(() => Promise.all([getBankCoins(), getPetInfo()]));
  if (savingsResult instanceof Error) {
    return <ServerComponentErrorFallback message={savingsResult.message} />;
  }

  const [coinsResponse, petInfoResponse] = savingsResult;
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
