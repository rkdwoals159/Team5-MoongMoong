"use client";

import { CSSProperties } from "react";
import { createConfettiPieces } from "./confettiEffectUtil";

type ConfettiEffectProps = {
  count: number;
};

/**
 * 꽃가루 효과 컴포넌트
 * @param count - 꽃가루 개수 결정에 사용되는 값
 */
export default function ConfettiEffect({ count }: ConfettiEffectProps) {
  const confettiPieces = createConfettiPieces(count);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[180px] overflow-hidden">
      {confettiPieces.map((piece) => {
        const confettiStyle = {
          left: `${piece.left}%`,
          animationDelay: `${piece.delay}ms`,
          animationDuration: `${piece.duration}ms`,
          backgroundColor: piece.color,
          "--confetti-drift": `${piece.drift}px`,
          "--confetti-rotate": `${piece.rotate}deg`,
        } as CSSProperties;

        return (
          <span key={piece.id} className="saving-break-confetti-piece" style={confettiStyle} />
        );
      })}
    </div>
  );
}
