import usePiggyBank from "@/app/(sidebar)/saving/_hooks/usePiggyBank";
import { useEffect, useRef, useMemo } from "react";
import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";
import { useSSESaving } from "@/app/(sidebar)/saving/_hooks/useSSESaving";
import SavingButton from "./SavingButton";
import SavingNudgeButton from "./SavingNudgeButton";
import Loading from "@/components/common/Loading/Loading";
import { DROP_DELAY } from "@/app/(sidebar)/saving/_constants";
import { useTooltipStyle } from "@/app/(sidebar)/saving/_hooks/useTooltipStyle";

export default function SavingContent() {
  const { ready, toolTip, sceneRef, handleDrop, clearCoins } = usePiggyBank();
  const { status } = useSavingStatus();
  useSSESaving({ handleDrop });
  const hasDroppedRef = useRef(false);
  const targetRef = useRef(status.target);
  const tooltipStyle = useTooltipStyle({ sceneRef, toolTip });

  // coinsKey 메모이제이션으로 useEffect 최적화
  const coinsKey = useMemo(
    () => status.coins.map((c) => c.createdAt ?? "").join(","),
    [status.coins],
  );

  // target 변경 시 리드랍을 위해 리셋
  useEffect(() => {
    if (targetRef.current !== status.target) {
      targetRef.current = status.target;
      hasDroppedRef.current = false;
      clearCoins();
    }
  }, [status.target, clearCoins]);

  // 초기 코인 드랍
  useEffect(() => {
    if (!ready || hasDroppedRef.current) return;
    hasDroppedRef.current = true;
    if (!status.coins.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    status.coins.forEach((coin, index) => {
      const timerId = setTimeout(() => {
        handleDrop(coin.name ?? "", coin.amount ?? 0, coin.createdAt ?? "", targetRef.current);
      }, DROP_DELAY * index);
      timers.push(timerId);
    });
    return () => timers.forEach(clearTimeout);
    // coinsKey는 status.coins의 변경을 감지하기 위한 key로, coinsKey가 변경될 때만 실행됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, coinsKey, handleDrop, status.target]);

  return (
    <div className="flex flex-col items-center gap-700 flex-1 min-h-0">
      <div
        ref={sceneRef}
        className={`bg-yellow-200 rounded-600 flex justify-center items-center flex-1 min-h-0 w-full relative ${!ready ? "hidden" : ""}`}
      >
        {toolTip.visible && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-slate-700/70 bg-slate-950/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-sm whitespace-pre-line"
            style={tooltipStyle}
          >
            {toolTip.text}
          </div>
        )}
      </div>

      {!ready && (
        <div className="bg-yellow-200 rounded-600 flex justify-center items-center flex-1 min-h-0 w-full">
          <Loading count={3} />
        </div>
      )}

      <div className="flex gap-300 w-2/3 mx-auto">
        <div className="flex-[3]">
          <SavingButton handleDrop={handleDrop} />
        </div>
        <SavingNudgeButton />
      </div>
    </div>
  );
}
