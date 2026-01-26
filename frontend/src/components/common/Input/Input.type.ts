import type { InputHTMLAttributes, ReactNode } from "react";

export type InputType = "text" | "file";

export type TextInputOwnProps = {
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  isDisabled?: boolean;
  renderError?: (message: string) => ReactNode;
  showError?: boolean;
  errorMessage?: string;
  touched?: boolean;
  onTouchedChange?: (value: boolean) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
};

export type FileInputOwnProps = {
  filePlaceholder?: string;
  fileName?: string;
  onClear?: () => void;
  className?: string;
};

type InputBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export type TextInputProps = TextInputOwnProps &
  Omit<InputBaseProps, "defaultValue" | "value"> & {
    type?: "text";
  };

export type FileInputProps = FileInputOwnProps &
  InputBaseProps & {
    type: "file";
  };
