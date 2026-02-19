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
