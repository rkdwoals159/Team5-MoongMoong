import type { ReactNode } from "react";

export type ModalProps = {
  open: boolean;
  ariaLabel?: string;
  closeHref?: string;
  closeLabel?: string;
  showOverlayClose?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};
