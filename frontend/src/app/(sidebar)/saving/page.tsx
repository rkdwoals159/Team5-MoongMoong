import SavingClient from "./_components/SavingClient";
import MakeNewSaving from "./_components/MakeNewSaving";
import { getBankInfo, getBankCoins } from "@/api/savingApiQueries";

const SavingPage = async () => {
  const bankInfo = await getBankInfo();

  if (!bankInfo) {
    return <MakeNewSaving />;
  }

  const coinsResponse = await getBankCoins();

  return (
    <>
      <main className="flex gap-700 flex-1 min-h-0 min-w-0">
        <SavingClient bankInfo={bankInfo} coins={coinsResponse?.coins ?? []} />
      </main>
    </>
  );
};

export default SavingPage;
