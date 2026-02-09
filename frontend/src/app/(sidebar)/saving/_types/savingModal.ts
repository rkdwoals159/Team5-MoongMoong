import { ReactNode } from "react";

export type SavingModalProps = {
  open: boolean;
  onClose: () => void;
  handleDrop: (name: string, amount: number, createdAt: string, targetAmount: number) => void;
};

export type SavingModalCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export type SavingConfirmDialogProps = {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
};
