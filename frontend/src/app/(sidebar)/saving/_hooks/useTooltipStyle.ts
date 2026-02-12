import { useEffect, useState } from "react";
import {
  DEFAULT_OFFSET_X,
  DEFAULT_PADDING,
  DEFAULT_OFFSET_Y,
  DEFAULT_STYLE,
} from "@/app/(sidebar)/saving/_constants";
import type { UseTooltipStyleParams, TooltipStyle } from "@/app/(sidebar)/saving/_types";
export function useTooltipStyle({
  sceneRef,
  toolTip,
  offsetX = DEFAULT_OFFSET_X,
  padding = DEFAULT_PADDING,
  offsetY = DEFAULT_OFFSET_Y,
}: UseTooltipStyleParams) {
  const [tooltipStyle, setTooltipStyle] = useState<TooltipStyle>(DEFAULT_STYLE);

  useEffect(() => {
    if (!sceneRef.current || !toolTip.visible) return;
    const { width } = sceneRef.current.getBoundingClientRect();
    const preferredLeft = toolTip.x - offsetX;
    const clampedLeft = Math.min(Math.max(preferredLeft, padding), width - padding);

    setTooltipStyle({
      left: clampedLeft,
      top: toolTip.y - offsetY,
      transform: "translate(0, -100%)",
    });
  }, [offsetX, offsetY, padding, sceneRef, toolTip.visible, toolTip.x, toolTip.y]);

  return tooltipStyle;
}
