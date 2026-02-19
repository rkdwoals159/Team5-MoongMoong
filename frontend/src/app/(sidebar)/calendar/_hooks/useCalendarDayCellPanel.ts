import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PanelLayout } from "@/app/(sidebar)/calendar/_types";
import type {
  UseCalendarDayCellPanelParams,
  UseCalendarDayCellPanelResult,
} from "@/app/(sidebar)/calendar/_types";
import { PANEL_LAYOUT_DEFAULT } from "@/app/(sidebar)/calendar/_constants/calendarDayCell";
import { calculatePanelLayoutFromRefs } from "@/app/(sidebar)/calendar/_lib";

export function useCalendarDayCellPanel({
  dayDate,
  isClickable,
  containerRef,
  dayButtonRef,
}: UseCalendarDayCellPanelParams): UseCalendarDayCellPanelResult {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelLayout, setPanelLayout] = useState<PanelLayout>(PANEL_LAYOUT_DEFAULT);
  const resizeRafRef = useRef<number | null>(null);

  const panelId = useMemo(() => `calendar-day-panel-${dayDate}`, [dayDate]);

  const updatePanelLayout = useCallback(() => {
    const nextPanelLayout = calculatePanelLayoutFromRefs({
      panelAnchorRef: dayButtonRef,
      panelContainerRef: containerRef,
    });

    if (!nextPanelLayout) {
      return;
    }

    setPanelLayout(nextPanelLayout);
  }, [containerRef, dayButtonRef]);

  const handleOutsidePointer = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!containerRef.current?.contains(target)) {
        setIsPanelOpen(false);
      }
    },
    [containerRef],
  );

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsPanelOpen(false);
    }
  }, []);

  const handleViewportChange = useCallback(() => {
    if (resizeRafRef.current !== null) {
      return;
    }

    resizeRafRef.current = window.requestAnimationFrame(() => {
      resizeRafRef.current = null;
      updatePanelLayout();
    });
  }, [updatePanelLayout]);

  useEffect(() => {
    if (!isPanelOpen || !isClickable) {
      return;
    }

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("touchstart", handleOutsidePointer, { passive: true });
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    updatePanelLayout();

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("touchstart", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);

      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [
    handleEscape,
    handleOutsidePointer,
    handleViewportChange,
    isClickable,
    isPanelOpen,
    updatePanelLayout,
  ]);

  const handleTogglePanel = useCallback(() => {
    if (!isClickable) {
      return;
    }

    setIsPanelOpen((prev) => {
      if (!prev) {
        updatePanelLayout();
      }

      return !prev;
    });
  }, [isClickable, updatePanelLayout]);

  const panelStyle = useMemo(
    () => ({
      width: `${panelLayout.widthPx}px`,
      left: `${panelLayout.leftPx}px`,
      top: `${panelLayout.topPx}px`,
    }),
    [panelLayout],
  );
  const tableStyle = useMemo(
    () => ({
      height: `${panelLayout.tableHeightPx}px`,
    }),
    [panelLayout.tableHeightPx],
  );

  return {
    isPanelOpen,
    panelId,
    panelStyle,
    tableStyle,
    handleTogglePanel,
  };
}
