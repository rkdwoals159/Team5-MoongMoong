"use client";

import type { SavingClientProps, SavingStatus } from "@/app/(sidebar)/saving/_types";
import { SavingStatusProvider } from "@/app/(sidebar)/saving/_contexts/SavingStatusContext";
import SavingInfo from "@/app/(sidebar)/saving/_components/header/SavingInfo";
import SavingContent from "@/app/(sidebar)/saving/_components/piggybank/SavingContent";
import SavingRanking from "@/app/(sidebar)/saving/_components/ranking/SavingRanking";
import ErrorBoundary from "@/components/ui/ErrorBoundary/ErrorBoundary";
import { useState } from "react";
import { CLIENT_ERROR_MESSAGES } from "@/api/constants";

export default function SavingClient({ bankInfo, coins, petName }: SavingClientProps) {
  const [status, setStatus] = useState<SavingStatus>({
    petName,
    bankId: bankInfo.bankId ?? -1,
    current: bankInfo.current ?? 0,
    target: bankInfo.target ?? 0,
    rankings: bankInfo.rankings ?? [],
    coins,
  });

  return (
    <SavingStatusProvider status={status} setStatus={setStatus}>
      <section className="flex flex-col gap-850 flex-1 min-h-0">
        <SavingInfo />
        <ErrorBoundary message={CLIENT_ERROR_MESSAGES.PIGGYBANK_ERROR}>
          <SavingContent />
        </ErrorBoundary>
      </section>
      <section className="flex flex-col w-1/3 shrink-0 border border-gray-100 rounded-600 py-700 px-600">
        <SavingRanking />
      </section>
    </SavingStatusProvider>
  );
}
