export type Coin = {
  name: string;
  amount: number;
  createdAt: string;
};

export type Ranking = {
  userName: string;
  total: number;
};

export type SavingStatus = {
  target: number;
  total: number;
  rankings: Ranking[];
};

export type SavingClientProps = SavingStatus & {
  coins: Coin[];
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
