import type { RefObject } from "react";
import {
  BOUNDARY_INSET,
  PANEL_ABSOLUTE_MIN_TABLE_HEIGHT,
  PANEL_CHROME_HEIGHT,
  PANEL_GAP,
  PANEL_MAX_TABLE_HEIGHT,
  PANEL_MAX_WIDTH,
  MIN_PANEL_WIDTH,
  PANEL_MIN_TABLE_HEIGHT,
  PANEL_VISUAL_PADDING,
  SAFE_VIEWPORT_MARGIN,
  HORIZONTAL_EPSILON,
} from "@/app/(sidebar)/calendar/_constants/calendarDayCell";
import type { CalculatePanelLayoutParams, PanelLayout } from "@/app/(sidebar)/calendar/_types";

export type PanelLayoutElementRefs = {
  panelAnchorRef: RefObject<HTMLElement | null>;
  panelContainerRef: RefObject<HTMLElement | null>;
};

export function calculatePanelLayout({
  buttonRect,
  anchorRect,
  boundaryLeft,
  boundaryRight,
  boundaryTop,
  boundaryBottom,
}: CalculatePanelLayoutParams): PanelLayout {
  const usableLeft = boundaryLeft + PANEL_VISUAL_PADDING;
  const usableRight = boundaryRight - PANEL_VISUAL_PADDING;
  const availableWidth = Math.max(usableRight - usableLeft, MIN_PANEL_WIDTH);
  const nextPanelWidth = Math.min(PANEL_MAX_WIDTH, availableWidth);

  const minLeft = usableLeft + BOUNDARY_INSET;
  const maxLeft = Math.max(
    minLeft,
    usableRight - nextPanelWidth - HORIZONTAL_EPSILON - BOUNDARY_INSET,
  );

  const nextLeft = Math.ceil(Math.min(Math.max(buttonRect.left, minLeft), maxLeft));

  const spaceBelow = boundaryBottom - (buttonRect.bottom + PANEL_GAP);
  const spaceAbove = buttonRect.top - PANEL_GAP - boundaryTop;
  const canOpenBottom = spaceBelow >= PANEL_CHROME_HEIGHT + PANEL_MIN_TABLE_HEIGHT;
  const canOpenTop = spaceAbove >= PANEL_CHROME_HEIGHT + PANEL_MIN_TABLE_HEIGHT;

  const nextPlacement: "top" | "bottom" = canOpenBottom
    ? "bottom"
    : canOpenTop
      ? "top"
      : spaceBelow >= spaceAbove
        ? "bottom"
        : "top";

  const maxTableByBoundary = Math.floor(
    boundaryBottom - boundaryTop - PANEL_CHROME_HEIGHT - BOUNDARY_INSET * 2,
  );

  const nextTableHeight = Math.max(
    PANEL_ABSOLUTE_MIN_TABLE_HEIGHT,
    Math.min(PANEL_MAX_TABLE_HEIGHT, maxTableByBoundary),
  );

  const panelHeight = PANEL_CHROME_HEIGHT + nextTableHeight;
  const desiredTop =
    nextPlacement === "bottom"
      ? buttonRect.bottom + PANEL_GAP
      : buttonRect.top - PANEL_GAP - panelHeight;

  const minTop = boundaryTop + BOUNDARY_INSET;
  const maxTop = Math.max(minTop, boundaryBottom - panelHeight - BOUNDARY_INSET);
  const nextTop = Math.ceil(Math.min(Math.max(desiredTop, minTop), maxTop));

  return {
    widthPx: nextPanelWidth,
    leftPx: Math.ceil(nextLeft - anchorRect.left),
    topPx: Math.ceil(nextTop - anchorRect.top),
    tableHeightPx: nextTableHeight,
  };
}

export function resolvePanelBoundaries(boundaryRect: DOMRect | null, mainRect: DOMRect | null) {
  return {
    boundaryLeft: Math.max(
      SAFE_VIEWPORT_MARGIN,
      Math.ceil(boundaryRect ? boundaryRect.left : SAFE_VIEWPORT_MARGIN),
      Math.ceil(mainRect ? mainRect.left : SAFE_VIEWPORT_MARGIN),
    ),
    boundaryRight: Math.min(
      window.innerWidth - SAFE_VIEWPORT_MARGIN,
      Math.floor(boundaryRect ? boundaryRect.right : window.innerWidth - SAFE_VIEWPORT_MARGIN),
      Math.floor(mainRect ? mainRect.right : window.innerWidth - SAFE_VIEWPORT_MARGIN),
    ),
    boundaryTop: Math.max(
      SAFE_VIEWPORT_MARGIN,
      Math.ceil(boundaryRect ? boundaryRect.top : SAFE_VIEWPORT_MARGIN),
      Math.ceil(mainRect ? mainRect.top : SAFE_VIEWPORT_MARGIN),
    ),
    boundaryBottom: Math.min(
      window.innerHeight - SAFE_VIEWPORT_MARGIN,
      Math.floor(boundaryRect ? boundaryRect.bottom : window.innerHeight - SAFE_VIEWPORT_MARGIN),
      Math.floor(mainRect ? mainRect.bottom : window.innerHeight - SAFE_VIEWPORT_MARGIN),
    ),
  };
}

export function calculatePanelLayoutFromRefs({
  panelAnchorRef,
  panelContainerRef,
}: PanelLayoutElementRefs): PanelLayout | null {
  if (typeof window === "undefined") {
    return null;
  }

  const panelAnchor = panelAnchorRef.current;
  const panelContainer = panelContainerRef.current;
  if (!panelAnchor || !panelContainer) {
    return null;
  }

  const buttonRect = panelAnchor.getBoundingClientRect();
  const anchorRect = panelContainer.getBoundingClientRect();
  const scrollContainer = panelAnchor.closest<HTMLElement>("[data-calendar-scroll-container]");
  const scrollRect = scrollContainer?.getBoundingClientRect() ?? null;
  const mainRect = panelAnchor.closest<HTMLElement>("main")?.getBoundingClientRect() ?? null;
  const boundaries = resolvePanelBoundaries(scrollRect, mainRect);

  return calculatePanelLayout({
    buttonRect,
    anchorRect,
    ...boundaries,
  });
}
