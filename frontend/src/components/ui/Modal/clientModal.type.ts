import type { ReactNode, RefObject } from "react";

export type ClientModalProps = {
  open: boolean;
  onClose: () => void;
  variant?: "overlay" | "dropdown";
  outsideClickRefs?: Array<RefObject<Element | null>>;
  ariaLabel?: string;
  overlayClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};
