export type FilterChipProps = {
  label: string;
  colorIndicator?: boolean;
  number?: number;
  hasCancelIcon?: boolean;
  onCancel?: () => void;
  onSelect?: () => void;
  className?: string;
};
