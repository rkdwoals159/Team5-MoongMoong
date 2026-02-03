import { Ranking } from "../_types";

export const updateRankings = (
  rankings: Ranking[],
  userName: string,
  amount: number,
): Ranking[] => {
  const existingIndex = rankings.findIndex((r) => r.userName === userName);
  const updated =
    existingIndex >= 0
      ? rankings.map((r, i) => (i === existingIndex ? { ...r, total: r.total + amount } : r))
      : [...rankings, { userName, total: amount }];
  return updated.sort((a, b) => b.total - a.total);
};
