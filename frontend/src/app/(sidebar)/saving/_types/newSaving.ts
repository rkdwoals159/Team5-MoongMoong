export type NewSavingEmptyStateProps = {
  onCreateClick: () => void;
};

export type NewSavingFormProps = {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};
