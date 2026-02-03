import { ToolTipState } from "./saving";

export type TooltipStyle = {
  left: number;
  top: number;
  transform: string;
};

export type UseTooltipStyleParams = {
  sceneRef: React.RefObject<HTMLElement | null>;
  toolTip: ToolTipState;
  offsetX?: number;
  padding?: number;
  offsetY?: number;
};
