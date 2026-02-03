import { Coin } from "@/app/(sidebar)/saving/_types";
import usePiggyBank from "@/app/(sidebar)/saving/_hooks/usePiggyBank";
import { useEffect, useRef } from "react";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import SavingButton from "./SavingButton";
import { DROP_DELAY } from "@/app/(sidebar)/saving/_constants";
import { useTooltipStyle } from "@/app/(sidebar)/saving/_hooks/useTooltipStyle";

export default function SavingContent({ coins, petName }: { coins: Coin[]; petName: string }) {
  const { ready, toolTip, sceneRef, handleDrop } = usePiggyBank();
  const { status } = useSavingStatus();
  const targetRef = useRef(status.target);
  const tooltipStyle = useTooltipStyle({ sceneRef, toolTip });

  // 초기 코인 드랍
  useEffect(() => {
    if (!ready || !coins) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    coins.forEach((coin, index) => {
      const timerId = setTimeout(() => {
        handleDrop(coin.name, coin.amount, coin.createdAt, targetRef.current);
      }, DROP_DELAY * index);
      timers.push(timerId);
    });
    return () => timers.forEach(clearTimeout);
  }, [ready, coins, handleDrop]);

  return (
    <div className="flex flex-col items-center gap-700 flex-1 min-h-0">
      <>
        <div
          ref={sceneRef}
          className="bg-yellow-200 rounded-600 flex justify-center items-center flex-1 min-h-0 w-full relative"
        >
          {!status.total && (
            <span className="typo-title-s-bold text-black-20">
              {petName}의 저금통이 비어있어요.
            </span>
          )}

          {toolTip.visible && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-slate-700/70 bg-slate-950/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-sm whitespace-pre-line"
              style={tooltipStyle}
            >
              {toolTip.text}
            </div>
          )}
        </div>

        <SavingButton handleDrop={handleDrop} />
      </>
    </div>
  );
}
