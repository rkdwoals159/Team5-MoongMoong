type ToastVariant = "error" | "success";

export type ToastType = {
  variant?: ToastVariant;
  message: string;
  className?: string;
};

export type TimerId = number;

export type ToastItem = ToastType & {
  id: string;
  duration: number;
  state: "open" | "closing";
};

export type ToastOptions = Omit<ToastType, "className"> & {
  duration?: number;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
};

export type ToastStore = ToastContextValue & {
  toasts: ToastItem[];
};
