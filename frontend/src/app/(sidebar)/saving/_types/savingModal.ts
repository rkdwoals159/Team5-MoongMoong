export type SavingModalProps = {
  open: boolean;
  onClose: () => void;
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
};
