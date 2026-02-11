export type NativeDateInputProps = {
  value: string;
  displayText: string;
  min?: string;
  max?: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  className?: string;
  focusable?: boolean;
};
