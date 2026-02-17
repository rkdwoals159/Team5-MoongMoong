import type { components } from "@/types/schema";
export type BankInfo = components["schemas"]["BankInfoResponse"];
export type Coin = components["schemas"]["CoinResponse"];
export type BankRanking = components["schemas"]["BankRankingResponse"];

export type SavingStatus = {
  petName: string;
  bankId: number;
  target: number;
  current: number;
  rankings: BankRanking[];
  coins: Coin[];
};

export type SavingClientProps = {
  bankInfo: BankInfo;
  coins: Coin[];
  petName: string;
};

// SavingTargetModal
export type SavingTargetModalProps = {
  initialTarget: number;
  currentAmount: number;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  focusRef: React.RefObject<HTMLInputElement | null>;
};

// usePiggyBank
export type ToolTipState = {
  visible: boolean;
  x: number;
  y: number;
  text: string;
};

export type BallPluginData = {
  toolTip: string;
  label: string;
};

export type BallBody = {
  isStatic: boolean;
  position: { x: number; y: number };
  plugin?: BallPluginData;
  circleRadius?: number;
};

// SavingBreakSummaryModal
export type BreakSummary = {
  days: number;
  message: string;
};

export type SavingBreakSummaryModalProps = {
  summary: BreakSummary | null;
  onRefresh: () => void;
};

// useSavingPayment
export type UseSavingPaymentOptions = {
  onSuccess: () => void;
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
};
