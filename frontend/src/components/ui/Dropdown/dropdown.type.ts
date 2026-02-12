export type DropdownProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  className?: string;
};

export type DropdownListBoxProps = {
  options: string[];
  selectedValue: string;
  focusedIndex: number;
  onSelect: (value: string) => void;
  onMouseEnter: (index: number) => void;
};

export type DropdownListItemProps = {
  option: string;
  index: number;
  isSelected: boolean;
  isFocused: boolean;
  onSelect: (value: string) => void;
  onMouseEnter: (index: number) => void;
};
