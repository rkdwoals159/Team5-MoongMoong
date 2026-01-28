import Link from "next/link";
import type { ModalProps } from "./Modal.type";
import cn from "@/utils/style";

export default function Modal({
  open,
  ariaLabel,
  closeHref,
  closeLabel = "닫기",
  showOverlayClose = false,
  overlayClassName,
  contentClassName,
  children,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={cn(baseOverlayClasses, overlayClassName ?? "")}>
      {showOverlayClose && closeHref && (
        <Link href={closeHref} aria-label={closeLabel} className="absolute inset-0" />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(baseContentClasses, contentClassName ?? "")}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}

// --------------Tailwind CSS classes------------------
const baseOverlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[rgba(26,31,39,0.25)] px-500";

const baseContentClasses =
  "relative z-10 w-full rounded-500 bg-(--color-white-100) shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]";
