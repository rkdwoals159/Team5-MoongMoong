import type { RefObject } from "react";

export type PanelLayout = {
  leftPx: number;
  topPx: number;
  widthPx: number;
  tableHeightPx: number;
};

export type CalculatePanelLayoutParams = {
  buttonRect: DOMRect;
  anchorRect: DOMRect;
  boundaryLeft: number;
  boundaryRight: number;
  boundaryTop: number;
  boundaryBottom: number;
};

export type PanelLayoutElementRefs = {
  panelAnchorRef: RefObject<HTMLElement | null>;
  panelContainerRef: RefObject<HTMLElement | null>;
};
