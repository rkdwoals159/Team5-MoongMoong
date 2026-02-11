import type { BankRanking } from "@/app/(sidebar)/saving/_types";

export const updateRankings = (
  rankings: BankRanking[],
  userName: string,
  amount: number,
): BankRanking[] => {
  const existingIndex = rankings.findIndex((r) => r.userName === userName);
  const updated =
    existingIndex >= 0
      ? rankings.map((r, i) => (i === existingIndex ? { ...r, total: (r.total ?? 0) + amount } : r))
      : [...rankings, { userName, total: amount }];
  return updated.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
};
