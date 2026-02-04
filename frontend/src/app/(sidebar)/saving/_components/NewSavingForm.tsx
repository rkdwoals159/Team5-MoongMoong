import Button from "@/components/common/Button/Button";
import AmountInput from "@/components/common/Input/AmountInput";
import { TEXT } from "@/app/(sidebar)/saving/_constants";
import SavingModalCard from "@/app/(sidebar)/saving/_components/modals/SavingModalCard";
import { useAmountInput } from "@/app/(sidebar)/saving/_hooks/useAmountInput";
import { NewSavingFormProps } from "@/app/(sidebar)/saving/_types";

export default function NewSavingForm({ onSubmit, onCancel, isSubmitting }: NewSavingFormProps) {
  const { value, numericValue, handleChange } = useAmountInput();
  const isValid = numericValue > 0;

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
