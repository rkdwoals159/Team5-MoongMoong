import { formatAmountPlain } from "@/utils/amount";
import { AMOUNT_PRESETS } from "@/app/(sidebar)/saving/_constants";
import Button from "@/components/common/Button/Button";
import type { AmountPresetButtonsProps } from "@/app/(sidebar)/saving/_types/savingModal";

export default function AmountPresetButtons({ onAdd }: AmountPresetButtonsProps) {
  return (
    <div role="group" aria-label="금액 추가 버튼" className="flex gap-300 mt-800">
      {AMOUNT_PRESETS.map((preset) => (
        <Button
          key={preset}
          type="button"
          variant="secondary"
          size="xsmall"
          onClick={() => onAdd(preset)}
          className="flex-1"
        >
          +{formatAmountPlain(preset)}원
        </Button>
      ))}
    </div>
  );
}
