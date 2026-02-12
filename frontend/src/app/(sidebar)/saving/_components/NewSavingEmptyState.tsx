import Button from "@/components/common/Button/Button";
import { TEXT } from "@/app/(sidebar)/saving/_constants";
import type { NewSavingEmptyStateProps } from "@/app/(sidebar)/saving/_types";
export default function NewSavingEmptyState({ onCreateClick }: NewSavingEmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-600">
      <p className="typo-title-m-bold text-neutral-600">{TEXT.EMPTY_TITLE}</p>
      <Button variant="primary" size="large" onClick={onCreateClick}>
        {TEXT.CREATE_BUTTON}
      </Button>
    </div>
  );
}
