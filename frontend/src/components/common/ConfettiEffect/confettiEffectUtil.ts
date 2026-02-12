import { pseudoRandom } from "@/utils/pseudoRandom";
import type { ConfettiPiece } from "./confettiEffect.type";
import {
  CONFETTI_COLORS,
  CONFETTI_COUNT,
  CONFETTI_SEED_INCREMENT,
  CONFETTI_LEFT_RANGE,
  CONFETTI_DELAY_RANGE,
  CONFETTI_DURATION_MIN,
  CONFETTI_DURATION_RANGE,
  CONFETTI_DRIFT_MIN,
  CONFETTI_DRIFT_RANGE,
  CONFETTI_ROTATE_MIN,
  CONFETTI_ROTATE_RANGE,
} from "./confettiEffectConstants";

export const createConfettiPieces = (seedBase: number): ConfettiPiece[] => {
  return Array.from({ length: CONFETTI_COUNT }, (_, index) => {
    const seed = seedBase + index * CONFETTI_SEED_INCREMENT;

    return {
      id: index,
      left: pseudoRandom(seed + 1) * CONFETTI_LEFT_RANGE,
      delay: pseudoRandom(seed + 2) * CONFETTI_DELAY_RANGE,
      duration: CONFETTI_DURATION_MIN + pseudoRandom(seed + 3) * CONFETTI_DURATION_RANGE,
      drift: CONFETTI_DRIFT_MIN + pseudoRandom(seed + 4) * CONFETTI_DRIFT_RANGE,
      rotate: CONFETTI_ROTATE_MIN + pseudoRandom(seed + 5) * CONFETTI_ROTATE_RANGE,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length] as string,
    };
  });
};
