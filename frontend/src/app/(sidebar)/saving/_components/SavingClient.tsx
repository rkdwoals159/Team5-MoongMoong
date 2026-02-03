"use client";

import { SavingClientProps, SavingStatus } from "@/app/(sidebar)/saving/_types";
import { SavingStatusProvider } from "@/app/(sidebar)/saving/_contexts/SavingStatusContext";
import SavingInfo from "@/app/(sidebar)/saving/_components/header/SavingInfo";
import SavingContent from "@/app/(sidebar)/saving/_components/piggybank/SavingContent";
import SavingRanking from "@/app/(sidebar)/saving/_components/ranking/SavingRanking";
import { useState } from "react";

const SavingClient = ({ target, total, rankings, coins }: SavingClientProps) => {
  const [status, setStatus] = useState<SavingStatus>({ target, total, rankings });

  return (
    <SavingStatusProvider status={status} setStatus={setStatus}>
      <section className="flex flex-col gap-850 flex-1 min-h-0">
        <SavingInfo />
        <SavingContent coins={coins} petName={"또리"} />
      </section>
      <section className="flex flex-col w-1/3 shrink-0 border border-gray-100 rounded-600 py-700 px-600">
        <SavingRanking />
      </section>
    </SavingStatusProvider>
  );
};

export default SavingClient;
