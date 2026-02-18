/** DateInput 트리거 버튼 props (DatePickerPopup 열기용) */
export type DateInputProps = {
  value: string;
  onOpen: () => void;
  className?: string;
  focusable?: boolean;
  ariaLabel?: string;
};
