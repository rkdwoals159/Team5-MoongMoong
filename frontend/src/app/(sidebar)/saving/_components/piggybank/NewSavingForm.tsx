import Button from "@/components/common/Button/Button";
import AmountInput from "@/components/common/Input/AmountInput";
import { TEXT, NEW_SAVING_AMOUNT_RESTRAINTS } from "@/app/(sidebar)/saving/_constants";
import SavingModalCard from "@/app/(sidebar)/saving/_components/modals/SavingModalCard";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";
import type { NewSavingFormProps } from "@/app/(sidebar)/saving/_types";

export default function NewSavingForm({ onSubmit, onCancel, isSubmitting }: NewSavingFormProps) {
  const { value, numericValue, warningMessage, isShaking, stopShaking, handleChange } =
    useAmountInput({
      min: NEW_SAVING_AMOUNT_RESTRAINTS.MIN,
      minWarningMessage: NEW_SAVING_AMOUNT_RESTRAINTS.MIN_WARNING,
      max: NEW_SAVING_AMOUNT_RESTRAINTS.MAX,
      maxWarningMessage: NEW_SAVING_AMOUNT_RESTRAINTS.MAX_WARNING,
    });
  const isValid = numericValue > 0 && !warningMessage;

  const handleSubmit = () => {
    if (!isValid || isSubmitting) return;
    onSubmit(numericValue);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <SavingModalCard title={TEXT.MODAL_TITLE} description={TEXT.MODAL_DESCRIPTION}>
        <div className="mt-700">
          <AmountInput
            value={value}
            onChange={handleChange}
            placeholder={TEXT.INPUT_PLACEHOLDER}
            warningMessage={warningMessage}
            isShaking={isShaking}
            onAnimationEnd={stopShaking}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        <div className="mt-900 flex gap-300">
          <Button variant="secondary" size="large" fullWidth onClick={onCancel}>
            {TEXT.CANCEL_BUTTON}
          </Button>
          <Button
            variant="primary"
            size="large"
            fullWidth
            isDisabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? TEXT.SUBMITTING_BUTTON : TEXT.SUBMIT_BUTTON}
          </Button>
        </div>
      </SavingModalCard>
    </div>
  );
}
