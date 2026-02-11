export type FilterChipProps = {
  label: string;
  colorIndicator?: boolean;
  color?: string;
  hasCancelIcon?: boolean;
  onCancel?: () => void;
  onSelect?: () => void;
  className?: string;
};
